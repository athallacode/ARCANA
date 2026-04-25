"""
Test module untuk menguji akurasi OCR menggunakan PaddleOCR
Berguna untuk mengenali dan mengekstrak teks dari gambar tulisan tangan
"""

from paddleocr import PPStructureV3
import os
import json
from pathlib import Path

class OCRTester:
    """Class untuk melakukan testing dan pengukuran akurasi OCR"""
    
    def __init__(self, input_dir="input", output_dir="output"):
        """
        Inisialisasi OCR Tester
        
        Args:
            input_dir: Direktori input untuk gambar yang akan ditest
            output_dir: Direktori output untuk hasil testing
        """
        self.input_dir = input_dir
        self.output_dir = output_dir
        
        # Initialize PPStructureV3 tanpa doc orientation dan unwarping
        self.pipeline = PPStructureV3(
            use_doc_orientation_classify=False,
            use_doc_unwarping=False
        )
        
        # Buat output directory jika belum ada
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def process_image(self, img_path):
        """
        Memproses satu gambar dengan OCR
        
        Args:
            img_path: Path ke gambar yang akan diproses
            
        Returns:
            output: Hasil OCR dari pipeline
        """
        if not os.path.exists(img_path):
            print(f"Error: File tidak ditemukan di {img_path}")
            return None
        
        try:
            output = self.pipeline.predict(input=img_path)
            return output
        except Exception as e:
            print(f"Error saat memproses {img_path}: {str(e)}")
            return None
    
    def save_results(self, output, filename_prefix):
        """
        Menyimpan hasil OCR ke berbagai format
        
        Args:
            output: Hasil dari pipeline.predict()
            filename_prefix: Prefix untuk nama file output
        """
        if output is None:
            return
        
        try:
            for res in output:
                res.print()
                res.save_to_json(save_path=self.output_dir)
                res.save_to_markdown(save_path=self.output_dir)
        except Exception as e:
            print(f"Error saat menyimpan hasil: {str(e)}")
    
    def extract_text(self, output):
        """
        Ekstrak teks dari hasil OCR
        
        Args:
            output: Hasil dari pipeline.predict()
            
        Returns:
            extracted_text: Teks yang telah diekstrak
        """
        extracted_text = []
        if output is None:
            return extracted_text
        
        try:
            for res in output:
                if hasattr(res, 'tables'):
                    for table in res.tables:
                        if hasattr(table, 'text'):
                            extracted_text.append(table.text)
        except Exception as e:
            print(f"Error saat ekstrak teks: {str(e)}")
        
        return extracted_text
    
    def test_single_image(self, img_filename):
        """
        Test satu gambar
        
        Args:
            img_filename: Nama file gambar di folder input
        """
        img_path = os.path.join(self.input_dir, img_filename)
        
        print(f"\n{'='*60}")
        print(f"Testing: {img_filename}")
        print(f"{'='*60}")
        
        output = self.process_image(img_path)
        
        if output:
            self.save_results(output, img_filename.split('.')[0])
            extracted_text = self.extract_text(output)
            
            print(f"\nTeks yang diekstrak:")
            for i, text in enumerate(extracted_text, 1):
                print(f"  {i}. {text}")
            
            print(f"\nProses selesai. Hasil disimpan di folder '{self.output_dir}'.")
        else:
            print("Gagal memproses gambar.")
    
    def test_all_images(self):
        """
        Test semua gambar di folder input
        """
        if not os.path.exists(self.input_dir):
            print(f"Error: Folder '{self.input_dir}' tidak ditemukan.")
            return
        
        # Daftar ekstensi gambar yang didukung
        supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff')
        
        image_files = [f for f in os.listdir(self.input_dir) 
                      if f.lower().endswith(supported_formats)]
        
        if not image_files:
            print(f"Tidak ada gambar ditemukan di folder '{self.input_dir}'")
            return
        
        print(f"\nMenemukan {len(image_files)} gambar untuk ditest")
        
        results = {
            'total_images': len(image_files),
            'processed': 0,
            'failed': 0,
            'files': []
        }
        
        for img_filename in image_files:
            self.test_single_image(img_filename)
            results['processed'] += 1
            results['files'].append(img_filename)
        
        # Simpan summary hasil testing
        self.save_test_summary(results)
    
    def save_test_summary(self, results):
        """
        Simpan summary dari hasil testing
        
        Args:
            results: Dictionary berisi hasil testing
        """
        summary_path = os.path.join(self.output_dir, 'test_summary.json')
        
        try:
            with open(summary_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\nSummary testing disimpan di: {summary_path}")
        except Exception as e:
            print(f"Error saat menyimpan summary: {str(e)}")


def main():
    """Main function untuk menjalankan testing"""
    
    tester = OCRTester(input_dir="input", output_dir="output")
    
    print("\n" + "="*60)
    print("OCR Accuracy Testing dengan PaddleOCR")
    print("="*60)
    print("\nGunakan folder 'input' untuk menempatkan gambar tulisan tangan")
    print("Hasil testing akan disimpan di folder 'output'\n")
    
    # Test semua gambar di folder input
    tester.test_all_images()


if __name__ == "__main__":
    main()
