import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Result.module.css';

interface DyslexiaResult {
  risk_score: number;
  risk_level: 'Rendah' | 'Sedang' | 'Tinggi';
  detected_errors: string[];
  feedback: string;
}

export default function Result() {
  const router = useRouter();
  const [result, setResult] = useState<DyslexiaResult | null>(null);

  useEffect(() => {
    // Ambil data hasil kalkulasi ML dari session storage
    const storageData = sessionStorage.getItem('dyslexia_result');
    if (storageData) {
      setResult(JSON.parse(storageData));
    } else {
      // Jika tidak ada data, kembalikan ke halaman awal
      router.push('/');
    }
  }, [router]);

  if (!result) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center' }}>
        <h2 style={{ color: '#6F45BA' }}>Memuat Hasil...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Hasil Analisis PANDAI</p>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className={styles.content}>
        <img src="/assets/duck.svg" alt="Duck Mascot" className={styles.duck} />
        <h1 className={styles.title}>Kerja Bagus! 🎉</h1>
        
        <div className={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <span className={styles.scoreLabel}>Tingkat Presisi Tulisan</span>
            <div className={styles.scoreValue}>
              {100 - result.risk_score}%
            </div>
          </div>
          
          <p style={{ color: '#555555', fontSize: '0.95rem' }}>
            {result.feedback}
          </p>

          <div style={{ marginTop: '10px' }}>
            <span className={styles.scoreLabel} style={{ display: 'block', marginBottom: '8px' }}>Pola yang Dideteksi AI:</span>
            <ul className={styles.analysisList}>
              {result.detected_errors.length > 0 ? (
                result.detected_errors.map((err, idx) => (
                  <li key={idx} className={`${styles.analysisItem} ${styles.analysisItemError}`}>
                    ⚠️ {err}
                  </li>
                ))
              ) : (
                <li className={styles.analysisItem} style={{ borderLeftColor: '#2ed573' }}>
                  ✅ Semua ejaan dan rotasi huruf terlihat sempurna.
                </li>
              )}
            </ul>
          </div>
        </div>

        <button 
          className={styles.buttonPrimary} 
          onClick={() => {
            sessionStorage.removeItem('dyslexia_result');
            router.push('/screening');
          }}
        >
          Mulai Latihan Menulis Lagi
        </button>
      </div>
    </div>
  );
}
