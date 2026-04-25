import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Screening.module.css';

export default function Screening() {
  const router = useRouter();
  const [mode, setMode] = useState<'listening' | 'camera'>('listening');
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleCapture = async () => {
    if (!videoRef.current) return;
    
    setIsCapturing(true);
    
    // Create a canvas to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      console.log("Photo captured:", imageData.substring(0, 50) + "...");
    }

    // Simulasi proses pengambilan foto seperti di gambar
    setTimeout(() => {
      setIsCapturing(false);
      // Redirect to result page
      router.push('/result');
    }, 3000);
  };

  return (
    <div className={styles.container} style={{ color: '#6F45BA' }}>
      <div className={styles.header}>
        <p className={styles.headerTitle} style={{ color: '#333333' }}>Halaman screening</p>
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.row}>
          <img src="/assets/duck.svg" alt="Duck" className={styles.duck} />
          <h1 className={styles.title} style={{ color: '#6F45BA' }}>
            {mode === 'listening' ? 'Dengarkan lalu tulis dalam kertas' : 'Tulis di kertas, lalu ambil foto tulisanmu'}
          </h1>
        </div>
      </div>

      {mode === 'listening' ? (
        <div className={styles.centerAction}>
          <button className={styles.button} style={{ color: '#ffffff', backgroundColor: '#7d57c1' }} onClick={startCamera}>
            <img src="/assets/ear.svg" alt="Listen" className={styles.icon} /> Dengar
          </button>
          <p className={styles.instruction} style={{ color: '#333333' }}>Tekan tombol untuk mendengar!</p>
        </div>
      ) : (
        <div className={styles.centerAction} style={{ justifyContent: 'flex-start', paddingBottom: '40px' }}>
          <div className={styles.cameraContainer}>
            <video ref={videoRef} autoPlay playsInline className={styles.videoFeed} />
            
            {isCapturing && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <span>Sedang melihat tulisanmu ...</span>
              </div>
            )}

            <button 
              className={`${styles.cameraButton} ${isCapturing ? styles.cameraButtonDisabled : ''}`} 
              onClick={handleCapture}
              disabled={isCapturing}
            >
              Ambil foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}