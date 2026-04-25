# DyslexiAI: Platform Deteksi & Pembelajaran Adaptif Disleksia Berbasis AI
## 1. Masalah: "The Identification Vacuum" di Indonesia
Di Indonesia, diperkirakan terdapat lebih dari **5 juta anak dengan disleksia**, namun **90% di antaranya tidak terdiagnosis** secara resmi hingga mereka lulus Sekolah Dasar. Hal ini menciptakan tiga beban utama:
* **Cognitive Tax:** Anak menghabiskan 80% energi hanya untuk mengeja, menyisakan sedikit kapasitas untuk memahami konteks.
* **Psychological Toll:** Rendahnya rasa percaya diri dan kecemasan akademik akibat standar baca nasional yang tidak mengakomodasi hambatan neurologis.
* **Akses Terbatas:** Biaya diagnosis formal ke psikolog yang mahal dan kurangnya tenaga ahli di daerah pelosok.

## 2. Solusi: Infrastruktur Deteksi & Intervensi Dini
DyslexiAI hadir sebagai solusi *web-based* yang anonim dan privat untuk menjembatani jurang diagnosis tersebut melalui:
* **Early Detection:** Screening non-invasif berbasis AI yang bisa diakses siapa saja secara instan tanpa perlu registrasi rumit.
* **Privacy-First AI:** Menggunakan **Ollama (Local LLM)** yang berjalan di mesin pengguna, memastikan data percakapan dan tulisan anak tidak pernah keluar ke server publik.
* **Evidence-Based:** Kurikulum latihan yang mengikuti prinsip **Orton-Gillingham**, metode yang terbukti secara klinis efektif untuk penyandang disleksia.

## 3. Yang Sedang Dikembangkan (Current Status)
Saat ini proyek berada dalam fase **Backend Core Development**. Fokus utama kami adalah:
* **Monorepo Architecture:** Struktur folder yang terisolasi antara `FE` (Frontend), `BE` (Backend), dan `ML_Pipeline`.
* **FastAPI Backend:** Membangun *engine* yang cepat dan asinkron untuk menangani beban kerja AI secara lokal.
* **Seeding Learning Content:** Penyiapan bank soal kurikulum level 1-5 ke dalam database PostgreSQL.
* **Local LLM Integration:** Menghubungkan sistem secara asinkron dengan Ollama (Llama3/Qwen) di jaringan lokal.

## 4. Tech Stack
Kami menggunakan kombinasi teknologi modern yang menjamin performa tinggi dan keamanan data:

| Komponen | Teknologi | Peran |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** | Antarmuka web responsif dengan performa tinggi. |
| **Backend** | **FastAPI** | REST API asinkron untuk orkestrasi AI dan Data. |
| **Local AI** | **Ollama** | Mesin LLM lokal untuk AI Tutor (Sahabat DyslexiAI). |
| **ML Models** | **ONNX & PaddleOCR** | Klasifikasi pola tulisan tangan secara *lightweight*. |
| **Database** | **PostgreSQL** | Penyimpanan sesi latihan dan bank soal kurikulum. |
| **Language** | **Python 3.12+** | Logika inti AI dan Backend. |

## 5. Fitur-Fitur yang Dikembangkan

### A. Mode Screening Otomatis
* **Handwriting Analysis:** Menggunakan kanvas digital untuk menangkap tulisan tangan anak. Gambar diproses oleh **PaddleOCR** untuk ekstraksi teks dan **ONNX** untuk mendeteksi pola *error* (seperti huruf terbalik atau omisi).
* **AI Scoring:** Memberikan skor risiko (0-100) dan label (Rendah/Sedang/Tinggi) secara instan.

### B. Sahabat DyslexiAI (AI Tutor Lokal)
* **Empathetic Interaction:** Chatbot yang didukung Ollama dengan *system prompt* khusus untuk memberikan motivasi dan perbaikan ejaan secara lembut tanpa menghakimi.
* **Local Inference:** Proses berpikir AI dilakukan sepenuhnya di perangkat (mesin ROG Zephyrus), menjamin privasi 100%.

### C. Mode Belajar Adaptif (Learning Mode)
* **Orton-Gillingham Curriculum:** Latihan berlevel (1-5) mulai dari pengenalan huruf konfusable (b/d, p/q) hingga morfologi kata.
* **Dynamic Feedback:** Sistem memberikan *feedback* langsung berdasarkan benar/salahnya jawaban anak dan menyesuaikan level secara otomatis.
