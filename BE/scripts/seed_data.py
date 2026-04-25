from app.core.database import SessionLocal, engine, Base

# MENGIMPOR SELURUH MODEL SECARA EKSPLISIT
# Ini wajib agar Base.metadata mengenali seluruh tabel dan relasi (Foreign Keys)
from app.models.user import User
from app.models.child_profile import ChildProfile
from app.models.exercise import Exercise, LearningSession, ExerciseResponse

# Setelah semua model masuk ke memori, buat seluruh tabel yang belum ada
Base.metadata.create_all(bind=engine)

def seed():
    """Fungsi utama untuk memasukkan data awal ke database."""
    db = SessionLocal()
    
    # Mencegah duplikasi data jika skrip dijalankan berulang kali
    existing = db.query(Exercise).first()
    if existing:
        print("Data sudah ada, membatalkan seeding.")
        return

    # Menyiapkan data soal contoh
    ex1 = Exercise(
        level=1,
        type="visual",
        content={"text": "Pilih huruf 'b'", "options": ["b", "d", "p", "q"]},
        correct_answer="b"
    )
    
    db.add(ex1)
    db.commit()
    print("Data soal berhasil dimasukkan ke database!")

if __name__ == '__main__':
    seed()
