# 🚀 Quick Start Guide - Digital Whiteboard OCR Testing

## ⚡ Instalasi Cepat (5 Menit)

### Step 1: Setup Environment
```bash
cd Test
pip install -r requirements.txt
```

### Step 2: Jalankan Aplikasi

**Windows:**
```bash
python digital_whiteboard.py
```

Atau double-click file: `run_whiteboard.bat`

**Mac/Linux:**
```bash
python3 digital_whiteboard.py
```

Atau jalankan: `bash run_whiteboard.sh`

## 📝 Cara Menggunakan

### Scenario 1: Menulis Huruf "A"

1. **Buka aplikasi** `digital_whiteboard.py`
2. **Gambar/Tulis huruf "A"** di papan tulis putih sebelah kiri
3. **Klik tombol biru** "🔍 Analisis dengan OCR"
4. **Lihat hasilnya** di panel sebelah kanan
   - AI akan menampilkan apa yang dikenalinya
   - Confidence level/akurasi pengenalan

### Scenario 2: Menulis "BA"

1. **Clear canvas** dengan tombol 🗑️
2. **Tulis "BA"** (kedua huruf sekaligus atau bergaris)
3. **Klik "🔍 Analisis dengan OCR"**
4. Lihat apakah AI bisa mengenali sebagai "BA"

### Scenario 3: Melihat Raw Output dari test_ocr.py

```bash
python test_ocr.py
```

Ini akan memproses semua gambar di folder `input/` dan menampilkan:
- Detail hasil OCR setiap gambar
- Teks yang terdeteksi
- File JSON dan Markdown di folder `output/`

## 🎨 UI Explanation

```
┌─────────────────────────────────┬──────────────────────┐
│  Papan Tulis Digital            │  Hasil OCR           │
│                                 │                      │
│  [Canvas untuk menggambar]      │  📊 HASIL OCR        │
│  (Klik & drag untuk menulis)    │  ===== ===== =======│
│                                 │  ⏰ Waktu: ...       │
│  [🗑️][🔍][💾]                   │  📝 Result 1:        │
│   Clear Analyze Save            │     Text: A          │
└─────────────────────────────────┴──────────────────────┘
```

## 📊 Sample Output

Ketika menulis "A":
```
📊 HASIL OCR ANALYSIS
===================================

⏰ Waktu: 2026-04-26 10:30:45

📝 Result 1:
-----------------------------------
  Text: A
  Confidence: 0.95

===================================
```

Ketika menulis "BA":
```
📊 HASIL OCR ANALYSIS
===================================

⏰ Waktu: 2026-04-26 10:35:20

📝 Result 1:
-----------------------------------
  Text: BA
  Confidence: 0.87

===================================
```

## 🔍 Troubleshooting

### ❌ "Module not found" error
```bash
pip install -r requirements.txt
```

### ❌ Application window tidak muncul
- Pastikan Tkinter terinstall
- Windows: Biasanya sudah include
- Linux: `sudo apt-get install python3-tk`

### ❌ OCR processing lambat
- Gambar pertama kali akan download model (besar)
- Tunggu 1-2 menit pada jalankan pertama
- Setelah itu cepat

### ❌ Hasil OCR tidak akurat
- Tulis lebih jelas
- Gunakan marker/pensil hitam tebal
- Hindari goresan yang berantakan

## 💾 Hasil Tersimpan Di

- **Whiteboard output**: `output/` folder
- **Batch test output**: `output/` folder
- **Temp drawings**: `temp_input/` folder

## 🎯 Testing Scenarios

### Test 1: Single Character
```
Input:  Draw "A"
Output: AI reads and displays "A"
Accuracy: Check confidence level
```

### Test 2: Multiple Characters
```
Input:  Draw "B", "A" together
Output: AI reads and displays "BA"
Accuracy: Check confidence level
```

### Test 3: Batch Test
```
Input:  All PNG/JPEG files in input/ folder
Output: JSON and Markdown files in output/
Summary: test_summary.json
```

## 🚀 Next Steps

1. ✅ Install & run aplikasi
2. ✅ Coba tulis beberapa huruf/angka
3. ✅ Lihat akurasi pengenalan AI
4. ✅ Bandingkan dengan hasil test_ocr.py
5. ✅ Save gambar untuk dokumentasi

## 📚 File Structure

```
Test/
├── digital_whiteboard.py    # Main app (GUI + OCR integration)
├── test_ocr.py             # Batch OCR testing
├── requirements.txt         # Dependencies
├── run_whiteboard.bat       # Windows launcher
├── run_whiteboard.sh        # Mac/Linux launcher
├── QUICKSTART.md           # File ini
├── README.md               # Full documentation
├── input/                  # Input images untuk batch test
├── output/                 # Output results
└── temp_input/             # Temp images dari whiteboard
```

---

**Happy Testing! 🎉**

Untuk pertanyaan atau issues, cek README.md untuk dokumentasi lebih lengkap.
