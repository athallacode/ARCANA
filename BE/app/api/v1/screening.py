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

@router.post("/analyze", response_model=ScreeningResponse)
def analyze_handwriting(payload: ScreeningRequest, db: Session = Depends(get_db)):
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

        # ========================================================
        # TODO: INTEGRASI ML PIPELINE (MOCK LOGIC)
        # Bagian ini mensimulasikan hasil dari OCR & ONNX
        # ========================================================
        print("Menerima gambar dari FE, memulai pemrosesan AI...")
        
        # Simulasi proses (Nanti diganti dengan panggilan fungsi asli)
        mock_score = 65.5  # Contoh hasil kalkulasi ONNX
        
        # Logika Penentuan Label (Berdasarkan arsitektur diagrammu)
        if mock_score > 70:
            label = "Tinggi"
            level = 1
            msg = "Disarankan untuk menjadwalkan konsultasi dengan ahli. Kami merekomendasikan mulai dari Level 1 untuk memperkuat fondasi fonemik."
        elif mock_score >= 40:
            label = "Sedang"
            level = 2
            msg = "Terdapat beberapa pola indikasi disleksia. Mari asah kemampuan di Level 2."
        else:
            label = "Rendah"
            level = 3
            msg = "Perkembangan sangat baik! Lanjutkan petualangan membaca di Level 3."

        # TODO: Jika child_id ada, update current_level dan risk_score ke database

        return ScreeningResponse(
            status="success",
            risk_score=mock_score,
            risk_label=label,
            recommended_level=level,
            feedback_message=msg
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat pemrosesan: {str(e)}")