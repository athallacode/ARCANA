import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Summary.module.css';

export default function Summary() {
  const router = useRouter();
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(5);

  useEffect(() => {
    // Membaca array screeningResults yang disimpan di session
    const stored = sessionStorage.getItem('dyslexia_screening_results');
    if (stored) {
      try {
        const pastResults = JSON.parse(stored);
        setTotalCount(pastResults.length);
        
        // Kita asumsikan risk_score <= 40 artinya huruf cukup bisa dikenali dengan baik
        const correct = pastResults.filter((r: any) => r.result.risk_score <= 40).length;
        setCorrectCount(correct);
        
        // Agar data ini juga bisa disalurkan ke result.tsx untuk kalkulasi Level Akhir
        // kita akan menyimpan overall score (rata-rata) di 'dyslexia_result' 
        // sehingga result.tsx tetap jalan seperti sebelumnya.
        const avgScore = pastResults.reduce((acc: number, val: any) => acc + val.result.risk_score, 0) / pastResults.length;
        const allErrors = pastResults.flatMap((r: any) => r.result.detected_errors);
        
        let label = "Rendah";
        let level = 3;
        let msg = "Perkembangan sangat baik! Lanjutkan petualangan membaca di Level 3.";
        if (avgScore > 70) {
            label = "Tinggi";
            level = 1;
            msg = "Disarankan untuk menjadwalkan konsultasi dengan ahli. Kami merekomendasikan mulai dari Level 1 untuk memperkuat fondasi fonemik.";
        } else if (avgScore >= 40) {
            label = "Sedang";
            level = 2;
            msg = "Terdapat beberapa pola indikasi disleksia. Mari asah kemampuan di Level 2.";
        }

        const consolidated = {
           status: "success",
           risk_score: avgScore,
           risk_level: label,
           recommended_level: level,
           feedback: msg,
           detected_errors: allErrors
        };
        sessionStorage.setItem('dyslexia_result', JSON.stringify(consolidated));

      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleStart = () => {
    router.push('/result');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>Kamu benar {correctCount} dari {totalCount} kata</h1>
      
      <div className={styles.mascotContainer}>
        <img src="/assets/duck.svg" alt="Duck Mascot" className={styles.duck} />
      </div>
      
      <h2 className={styles.subheadline}>Kita mulai latihan yang cocok untukmu ya!</h2>
      
      <div className={styles.footer}>
        <button className={styles.button} onClick={handleStart}>
          Mulai
        </button>
      </div>
    </div>
  );
}
