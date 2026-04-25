import os
from gtts import gTTS

output_dir = r"d:\4. Thoriq_KULIAH\1.Lomba Thoriq\SEMESTER 4\HackFest\ARCANA\ARCANA\FE\public\assets"
os.makedirs(output_dir, exist_ok=True)

huruf = ['a', 'i', 'u', 'e', 'o']
for h in huruf:
    text = f"Sekarang, coba tulis huruf {h.upper()} besar di atas selembar kertas ya."
    tts = gTTS(text=text, lang='id', slow=False)
    tts.save(os.path.join(output_dir, f"instruksi_{h}.mp3"))
    print(f"Generated instruksi_{h}.mp3")
