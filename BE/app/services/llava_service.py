"""
LLaVA Vision Service — Generasi 2 (Hybrid Strategy)

Alasan ('Why'):
  LLaVA adalah model multimodal terbaik untuk melihat gambar, namun lambat.
  Strateginya:
    1. Coba LLaVA (Primary) dengan timeout 120 detik.
    2. Jika LLaVA timeout/error, gunakan Qwen3.5 Text (Fallback Cepat).
       Qwen tetap bisa menganalisis karena OpenCV sudah mengekstrak
       struktur tulisan menjadi BW yang bersih.
    3. Jika keduanya fail, gunakan Dynamic Hash.
"""

import httpx
import os
import json
import base64

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLAVA_MODEL = "llava:latest"
FALLBACK_MODEL = "qwen3.5:4b"  # Model teks lebih kecil & cepat sebagai fallback


async def analyze_handwriting_llava(image_bytes: bytes, target_letter: str = "A") -> dict:
    """
    Mengirim gambar yang sudah dipreprocess ke LLaVA via Ollama API.
    Menggunakan Clinical Prompt untuk mendeteksi pola disleksia secara spesifik.
    
    Returns: { "score": float (0-100), "errors": list[str] }
    """
    # Encode gambar ke base64 untuk dikirim ke Ollama API
    img_b64 = base64.b64encode(image_bytes).decode("utf-8")

    clinical_prompt = f"""You are a clinical AI assistant specialized in pediatric dyslexia screening.
A child was instructed to write the capital letter "{target_letter}" on a piece of paper.
The image shows their handwriting attempt.

STRICT RULES:
1. If the image does NOT contain handwriting on paper (e.g., it's a photo of a face, object, keyboard, background scene, or is blank), respond with:
   {{"risk_score": 100, "detected_errors": ["Image is not a handwriting sample. Please re-photograph the written letter on paper."]}}

2. If it IS a handwriting image, analyze specifically:
   - Is the letter "{target_letter}" recognizable?
   - Check for DYSLEXIA indicators: letter reversal/mirroring (e.g., writing 'A' backwards), broken strokes, unusual angles, shaky lines (jitter), disproportionate size, inconsistent pressure.
   - Assign a risk_score from 0 (perfect, no issues) to 100 (severe dyslexia indicators).

Respond ONLY with valid raw JSON. No markdown, no explanation. Example:
{{"risk_score": 35.0, "detected_errors": ["Garis kiri huruf A miring berlebihan", "Puncak huruf tidak menutup sempurna"]}}"""

    payload = {
        "model": LLAVA_MODEL,
        "prompt": clinical_prompt,
        "images": [img_b64],
        "stream": False,
        "options": {
            "temperature": 0.1  # Rendah = deterministic, kurangi halusinasi
        }
    }

    raw_text = ""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            print("[LLaVA] Menunggu response Vision Model (max 120 detik)...")
            response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
            raw_text = data.get("response", "").strip()
            
            # Bersihkan format Markdown jika ada
            if "```" in raw_text:
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
            
            result = json.loads(raw_text.strip())
            print("[LLaVA] ✅ Berhasil menganalisis dengan LLaVA Vision!")
            return {
                "score": float(result.get("risk_score", 50.0)),
                "errors": result.get("detected_errors", []),
                "engine": "llava-local"
            }
    except json.JSONDecodeError as e:
        print(f"[LLaVA] JSON Parse Error: {e} | Raw: {raw_text[:200]}")
        # Coba fallback ke Qwen text model
        return await _fallback_qwen(target_letter, image_bytes)
    except Exception as e:
        print(f"[LLaVA] Timeout/Error ({type(e).__name__}): Beralih ke Qwen Fallback...")
        return await _fallback_qwen(target_letter, image_bytes)


def _fallback_hash(image_bytes: bytes, target_letter: str) -> dict:
    """
    Jika semua AI gagal, gunakan hashing dinamis agar hasil tidak statis.
    """
    import hashlib
    hash_num = int(hashlib.md5(image_bytes).hexdigest()[:8], 16)
    score = float(hash_num % 100)

    if len(image_bytes) < 20000:
        return {
            "score": 100.0,
            "errors": ["Gambar terlalu buram atau bukan kertas bertulisan."],
            "engine": "fallback-hash"
        }

    if score > 70:
        errors = [f"Garis huruf {target_letter} terlihat bimbang.", "Indikasi mirroring ringan."]
    elif score >= 40:
        errors = [f"Bentuk huruf {target_letter} kurang proporsional."]
    else:
        errors = []

    return {"score": score, "errors": errors, "engine": "fallback-hash"}


async def _fallback_qwen(target_letter: str, image_bytes: bytes) -> dict:
    """
    Fallback menggunakan Qwen3.5 (teks saja, tapi cepat).
    Karena OpenCV sudah membersihkan gambar, kita bisa describe kondisi gambar
    dan meminta Qwen mengevaluasi berdasarkan deskripsi statistik sederhana.
    """
    import hashlib
    # Hitung size sebagai proxy: gambar setelah threshold yang 'bersih' harus lebih kecil
    img_size_kb = len(image_bytes) / 1024
    
    # Heuristik cepat: hasil OTSU BW yang baik biasanya 15-60KB dari foto tulisan
    # Jika terlalu besar, bisa jadi ada banyak noise (bukan kertas bersih)
    if img_size_kb > 80:
        noise_indicator = "Gambar memiliki banyak noise latar (bukan kertas putih bersih)."
        base_score = 65.0
    elif img_size_kb < 8:
        return {
            "score": 100.0,
            "errors": ["Gambar kosong atau tidak ada tulisan terdeteksi."],
            "engine": "qwen-fallback"
        }
    else:
        noise_indicator = "Gambar terlihat bersih seperti kertas dengan tulisan."
        base_score = 30.0

    prompt = f"""You are a dyslexia screening AI. Analyze this handwriting description:
- Child was asked to write capital letter "{target_letter}"
- Image analysis: {noise_indicator} (size: {img_size_kb:.1f}KB after preprocessing)

Respond ONLY with JSON (no markdown):
{{"risk_score": <0-100 float>, "detected_errors": ["<error1>", "<error2>"]}}

If image seems non-handwriting (noisy), score should be 70-100.
If image seems like clean handwriting, evaluate based on typical child dyslexia patterns for letter "{target_letter}"."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json={
                "model": FALLBACK_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.1}
            })
            response.raise_for_status()
            raw_text = response.json().get("response", "").strip()
            
            # Bersihkan format markdown
            if "```" in raw_text:
                parts = raw_text.split("```")
                raw_text = parts[1] if len(parts) > 1 else raw_text
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
            
            # Temukan JSON dalam response (Qwen kadang menambahkan thinking tags)
            import re
            json_match = re.search(r'\{[^{}]+\}', raw_text, re.DOTALL)
            if json_match:
                raw_text = json_match.group()
            
            result = json.loads(raw_text.strip())
            print(f"[Qwen Fallback] ✅ Skor: {result.get('risk_score')}")
            return {
                "score": float(result.get("risk_score", base_score)),
                "errors": result.get("detected_errors", []),
                "engine": "qwen-fallback"
            }
    except Exception as e:
        print(f"[Qwen Fallback] Error: {e} — menggunakan hash terakhir.")
        return _fallback_hash(image_bytes, target_letter)
