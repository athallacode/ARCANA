# OCR Accuracy Testing Module + Digital Whiteboard

Module untuk menguji akurasi **Optical Character Recognition (OCR)** menggunakan **PaddleOCR** dengan **Digital Whiteboard** interface.

## 🎯 Kegunaan

Module ini berguna untuk:
- ✅ **Mengenali tulisan tangan** dari gambar
- ✅ **Papan tulis digital** untuk menulis langsung
- ✅ **Live OCR testing** - lihat hasil pengenalan real-time
- ✅ **Mengukur akurasi** OCR
- ✅ **Menyimpan hasil** dalam format JSON dan Markdown

## 📁 Struktur Folder

```
Test/
├── input/                    # Folder untuk gambar input
├── output/                   # Folder untuk hasil output OCR
├── temp_input/              # Folder temp untuk digital whiteboard
├── requirements.txt         # Dependencies
├── test_ocr.py             # Script testing OCR batch
├── digital_whiteboard.py    # Papan tulis digital dengan OCR live
└── README.md               # File dokumentasi
```

## 🚀 Instalasi

### 1. Install dependencies:
```bash
cd Test
pip install -r requirements.txt
```

Atau install manual:
```bash
pip install paddlepaddle==3.2.0 -i https://www.paddlepaddle.org.cn/packages/stable/cpu/
pip install "paddleocr[all]" "paddlex[ocr]"
pip install opencv-python numpy Pillow
```

## 💻 Cara Menggunakan

### Method 1: Digital Whiteboard (Recommended untuk Testing)

```bash
python digital_whiteboard.py
```

**Fitur:**
- 🖊️ Papan tulis digital untuk menulis
- 🔍 Tombol "Analisis dengan OCR" untuk instant testing
- 📊 Lihat hasil pengenalan AI secara real-time
- 💾 Simpan gambar yang telah dibuat
- 🗑️ Clear untuk mulai ulang

**Cara Pakai:**
1. Jalankan script
2. **Tulis huruf atau angka** di papan tulis (misal: "A", "BA", "C")
3. Klik **"Analisis dengan OCR"**
4. Lihat hasil pengenalan AI di panel sebelah kanan
5. Ulangi atau simpan gambar jika ingin

### Method 2: Batch Testing

Untuk test multiple file sekaligus:

```bash
python test_ocr.py
```

**Cara Pakai:**
1. Tempatkan gambar di folder `input/`
2. Jalankan script
3. Semua gambar akan diproses otomatis
4. Hasil disimpan di folder `output/`

## 📊 Contoh Output

Saat Anda menulis "A" di papan tulis dan klik analyze:

```
📊 HASIL OCR ANALYSIS
===================================

⏰ Waktu: 2026-04-26 10:30:45

📝 Result 1:
-----------------------------------
  Text: A
  Confidence: 0.95

===================================
💡 Tip: Tulis lebih jelas untuk hasil lebih akurat
```

## 🔧 Advanced Usage

### Custom Input di Script
```python
from digital_whiteboard import DigitalWhiteboard
import tkinter as tk

root = tk.Tk()
app = DigitalWhiteboard(root)
root.mainloop()
```

### Langsung Pakai OCRTester
```python
from test_ocr import OCRTester

tester = OCRTester(input_dir="input", output_dir="output")

# Test satu gambar
tester.test_single_image("gambar.jpg")

# Test semua
tester.test_all_images()
```

## 🎨 UI Controls

| Button | Fungsi |
|--------|--------|
| 🗑️ Clear | Hapus papan tulis |
| 🔍 Analisis dengan OCR | Analisis gambar dengan AI |
| 💾 Save | Simpan gambar ke file |

## 📝 Tips untuk Akurasi Lebih Baik

1. **Tulis Jelas** - Hindari coretan yang berantakan
2. **Ukuran Cukup** - Jangan terlalu kecil
3. **Kontras Baik** - Warna hitam di background putih
4. **Format Standar** - Tulis seperti di kertas biasa

## 🐛 Troubleshooting

### Error: tkinter not found (Windows)
tkinter biasanya sudah include di Python Windows, jika tidak:
```bash
pip install tk
```

### Error: paddleocr not found
```bash
pip install "paddleocr[all]"
```

### Performa Lambat
- Kurangi ukuran canvas
- Atau gunakan GPU jika tersedia

## 📂 Output Files

Hasil testing tersimpan di folder `output/`:
- `temp_drawing_res.json` - Hasil OCR dalam JSON
- `temp_drawing.md` - Hasil OCR dalam Markdown
- `test_summary.json` - Summary hasil testing batch

## 🎓 Pembelajaran

Module ini cocok untuk:
- Learning OCR technology
- Testing AI accuracy
- Handwriting recognition research
- Digital art dengan AI integration

## 📋 Requirements

- Python 3.7+
- PaddleOCR
- PaddlePaddle
- OpenCV
- Pillow
- NumPy

## License

Part dari ARCANA Project
