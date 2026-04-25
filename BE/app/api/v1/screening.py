"""
Screening API Router.
Menangani rute terkait proses deteksi disleksia menggunakan OCR dan ONNX.
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.screening_schema import ScreeningRequest, ScreeningResponse
from app.core.database import get_db
# Nanti kita akan import ini saat ML Pipeline sudah siap:
# from app.services.ocr_service import process_image
# from app.services.onnx_service import predict_dyslexia

router = APIRouter()

@router.post("/upload", response_model=ScreeningResponse)
async def analyze_handwriting(payload: ScreeningRequest, db: Session = Depends(get_db)):
    """
    Endpoint utama untuk menganalisis tulisan tangan anak.
    
    Alur (Flow):
    1. Menerima gambar Base64 dari Frontend.
    2. Ekstraksi teks & fitur stroke menggunakan PaddleOCR.
    3. Klasifikasi pola kesalahan menggunakan model ONNX.
    4. Mengkalkulasi skor risiko dan rekomendasi level.
    """
    try:
        # Validasi sederhana
        if not payload.image_base64 or len(payload.image_base64) < 50:
            raise HTTPException(status_code=400, detail="Gambar tidak valid atau kosong.")

        print("Menerima gambar dari FE, menganalisis dengan AI (Gemini/Dynamic Hasher)...")
        # Bersihkan awalan base64 (contoh: "data:image/jpeg;base64,")
        import base64
        import re
        b64_data = re.sub('^data:image/.+;base64,', '', payload.image_base64)
        image_bytes = base64.b64decode(b64_data)

        # Proses melalui Gemini Core Service
        from app.services.gemini_service import analyze_dyslexia_image
        
        analysis_result = await analyze_dyslexia_image(image_bytes, target_letter=payload.target_letter)
        
        dynamic_score = analysis_result["score"]
        detected_errors = analysis_result["errors"]

        # Logika Penentuan Label (Berdasarkan arsitektur diagrammu)
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

        # TODO: Jika child_id ada, update current_level dan risk_score ke database

        return ScreeningResponse(
            status="success",
            risk_score=dynamic_score,
            risk_level=label,
            recommended_level=level,
            feedback=msg,
            detected_errors=detected_errors
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat pemrosesan: {str(e)}")