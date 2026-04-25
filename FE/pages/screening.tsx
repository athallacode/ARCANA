import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Screening.module.css';

export default function Screening() {
  const router = useRouter();
  const [mode, setMode] = useState<'listening' | 'camera'>('listening');
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const letters = ['a', 'i', 'u', 'e', 'o'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLetter = letters[currentIndex];

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const handleListen = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Play dynamic audio per letter
    const audio = new Audio(`/assets/instruksi_${currentLetter}.mp3`);
    
    audio.play().then(() => {
      audio.onended = () => {
        setIsPlaying(false);
        setAudioFinished(true); // Show Saya Siap
      };
    }).catch(err => {
      console.error("Gagal memutar audio:", err);
      // fallback
      setIsPlaying(false);
      setAudioFinished(true);
    });
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    
    setIsCapturing(true);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const response = await fetch('http://localhost:8000/api/v1/screening/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image_base64: imageData,
            target_letter: currentLetter.toUpperCase() 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store result in session storage cumulatively
          const pastResults = JSON.parse(sessionStorage.getItem('dyslexia_screening_results') || '[]');
          pastResults.push({ letter: currentLetter.toUpperCase(), result: data });
          sessionStorage.setItem('dyslexia_screening_results', JSON.stringify(pastResults));
          
          if (currentIndex < letters.length - 1) {
            // Lanjut Huruf Berikutnya
            setCurrentIndex(currentIndex + 1);
            setMode('listening');
            setAudioFinished(false);
            setIsCapturing(false);
            setIsPlaying(false);
            // Matikan Kamera
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) stream.getTracks().forEach(track => track.stop());
          } else {
            // Semua beres, lempar ke summary
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) stream.getTracks().forEach(track => track.stop());
            router.push('/summary');
          }
        } else {
          console.error('Analysis failed', await response.text());
          alert('Gagal mendeteksi tulisan. Coba ulangi dengan pencahayaan yang lebih baik.');
          setIsCapturing(false);
        }
      } catch (error) {
        console.error('Network Error:', error);
        alert('Tidak dapat terhubung ke Backend. Pastikan FastAPI sedang berjalan.');
        setIsCapturing(false);
      }
    } else {
      setIsCapturing(false);
    }
  };

  return (
    <div className={styles.container} style={{ color: '#6F45BA' }}>
      <div className={styles.header}>
        <p className={styles.headerTitle} style={{ color: '#333333' }}>
          Soal {currentIndex + 1} dari {letters.length}
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${((currentIndex) / letters.length) * 100}%` }}></div>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.row}>
          <img src="/assets/duck.svg" alt="Duck" className={styles.duck} />
          <h1 className={styles.title} style={{ color: '#6F45BA', fontSize: '1.4rem' }}>
            {mode === 'listening' 
              ? `Dengarkan Instruksi, lalu tulis Huruf ${currentLetter.toUpperCase()} di kertas!` 
              : `Ambil foto tulisan Huruf ${currentLetter.toUpperCase()} mu`}
          </h1>
        </div>
      </div>

      {mode === 'listening' ? (
        <div className={styles.centerAction}>
          {!audioFinished ? (
            <>
              <button 
                className={styles.button} 
                style={{ backgroundColor: isPlaying ? '#ccc' : '#7d57c1', color: '#fff' }} 
                onClick={handleListen}
                disabled={isPlaying}
              >
                <img src="/assets/ear.svg" alt="Listen" className={styles.icon} /> 
                {isPlaying ? 'Mendengarkan...' : 'Dengar'}
              </button>
              <p className={styles.instruction} style={{ color: '#333333' }}>Tekan tombol untuk mendengar instruksi!</p>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
              <button 
                className={styles.button} 
                style={{ backgroundColor: '#2ed573', color: '#fff', width: '100%', maxWidth: '300px', borderColor: '#26af5f', boxShadow: '0 4px 0 0 #26af5f' }} 
                onClick={startCamera}
              >
                ✅ Saya Siap
              </button>
              <button 
                className={styles.button} 
                style={{ backgroundColor: '#ffffff', color: '#7d57c1', width: '100%', maxWidth: '300px', border: '2px solid #7d57c1', boxShadow: '0 4px 0 0 #7d57c1' }} 
                onClick={handleListen}
              >
                <img src="/assets/ear.svg" alt="Listen" className={styles.icon} style={{ filter: 'invert(37%) sepia(58%) saturate(1478%) hue-rotate(233deg) brightness(85%) contrast(89%)' }} /> Dengar Lagi
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.centerAction} style={{ justifyContent: 'flex-start', paddingBottom: '40px' }}>
          <div className={styles.cameraContainer}>
            <video ref={videoRef} autoPlay playsInline className={styles.videoFeed} />
            
            {isCapturing && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <span>Sedang melihat tulisan {currentLetter.toUpperCase()} mu ...</span>
              </div>
            )}

            <button 
              className={`${styles.cameraButton} ${isCapturing ? styles.cameraButtonDisabled : ''}`} 
              onClick={handleCapture}
              disabled={isCapturing}
            >
              Ambil foto {currentLetter.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}