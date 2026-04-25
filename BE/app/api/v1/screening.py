"""
Screening API Router.
Alur baru: Gambar → OpenCV Preprocessing → LLaVA Vision (Ollama Local) → Skor Disleksia.
"""

import base64
import re

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.screening_schema import ScreeningRequest, ScreeningResponse
from app.core.database import get_db
from app.services.image_processor import preprocess_handwriting
from app.services.llava_service import analyze_handwriting_llava

router = APIRouter()

@router.post("/upload", response_model=ScreeningResponse)
async def analyze_handwriting(payload: ScreeningRequest, db: Session = Depends(get_db)):
    """
    Pipeline Deteksi Disleksia Generasi 2.
    
    Alur (Flow):
    1. Decode gambar Base64 dari Frontend.
    2. PRE-PROCESSING (OpenCV): Bersihkan noise, threshold adaptif.
    3. AI VISION (LLaVA / Ollama): Analisis pola tulisan tangan secara multimodal.
    4. Kalkulasi skor risiko disleksia & tentukan level belajar.
    """
    try:
        if not payload.image_base64 or len(payload.image_base64) < 50:
            raise HTTPException(status_code=400, detail="Gambar tidak valid atau kosong.")

        # Step 1: Decode base64 → raw bytes
        b64_data = re.sub(r'^data:image/.+;base64,', '', payload.image_base64)
        raw_bytes = base64.b64decode(b64_data)
        print(f"[Screening] Gambar diterima: {len(raw_bytes)/1024:.1f} KB | Target: '{payload.target_letter}'")

        # Step 2: OpenCV Preprocessing — Hapus noise, tajamkan tinta tulisan
        print("[Preprocessing] Menjalankan OTSU Thresholding via OpenCV...")
        clean_bytes = preprocess_handwriting(raw_bytes)
        print(f"[Preprocessing] Selesai. Ukuran setelah diproses: {len(clean_bytes)/1024:.1f} KB")

        # Step 3: LLaVA Vision — Kirim ke Ollama (100% Lokal, Offline)
        print("[LLaVA] Mengirim ke model Vision LLaVA via Ollama...")
        analysis_result = await analyze_handwriting_llava(clean_bytes, target_letter=payload.target_letter)
        
        dynamic_score = analysis_result["score"]
        detected_errors = analysis_result["errors"]
        engine_used = analysis_result.get("engine", "unknown")
        print(f"[LLaVA] Skor: {dynamic_score:.1f} | Engine: {engine_used} | Errors: {len(detected_errors)}")

        # Step 4: Kalkulasi Level Disleksia
        if dynamic_score > 70:
            label = "Tinggi"
            level = 1
            msg = "Disarankan untuk menjadwalkan konsultasi dengan ahli. Kami merekomendasikan mulai dari Level 1 untuk memperkuat fondasi fonemik."
        elif dynamic_score >= 40:
            label = "Sedang"
            level = 2
            msg = "Terdapat beberapa pola indikasi disleksia. Mari asah kemampuan di Level 2."
        else:
            label = "Rendah"
            level = 3
            msg = "Perkembangan sangat baik! Lanjutkan petualangan membaca di Level 3."
            detected_errors = []

        return ScreeningResponse(
            status="success",
            risk_score=round(dynamic_score, 1),
            risk_level=label,
            recommended_level=level,
            feedback=msg,
            detected_errors=detected_errors
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Screening] FATAL ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat pemrosesan: {str(e)}")