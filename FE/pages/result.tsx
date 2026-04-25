import Head from 'next/head';
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
      <Head>
        <title>Ringkasan Hasil Tes - Arcana</title>
      </Head>

      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>Ringkasan Hasil Tes</h1>
      </div>

      <div className={styles.section}>
        <div className={styles.summaryList}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Inversi b/d</span>
            <span className={styles.summaryValue}>80% Sering</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Urutan huruf terbalik</span>
            <span className={styles.summaryValue}>40% Kadang</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Huruf hilang/tambah</span>
            <span className={styles.summaryValue}>20% Jarang</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Inversi p/q</span>
            <span className={styles.summaryValue}>0% Tidak ada</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Detail Hasil per Kata</h2>
        <div className={styles.detailCards}>
          <div className={styles.detailCard}>
            <div className={styles.statusIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#46A302" />
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <span className={styles.word}>Batu</span>
              <span className={styles.subWord}>Ditulis batu</span>
            </div>
          </div>
          <div className={styles.detailCard}>
            <div className={styles.statusIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#971200" />
                <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <span className={styles.word}>Buku</span>
              <span className={styles.subWord}>Ditulis duku</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Indikasi Awal Berdasarkan Pola Error</h2>
        <div className={styles.indicationBox}>
          <p className={styles.indicationText}>
            Pola kesalahan konsisten dengan gejala disleksia fonologis dan visual, khususnya kesulitan membedakan huruf yang mirip secara spasial (b/d) dan mempertahankan urutan huruf dalam kata. Pola ini bukan karena kurang belajar atau tidak teliti, melainkan cara otak memproses simbol tertulis yang berbeda.
          </p>
        </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Rekomendasi Tindak Lanjut</h2>
        <div className={styles.recommendationList}>
          <div className={styles.recommendationCard}>
            Lanjutkan latihan harian di Leksa level 1 pengenalan huruf dasar
          </div>
          <div className={styles.recommendationCard}>
            Konsultasikan ke psikolog atau dokter anak tumbuh kembang
          </div>
          <div className={styles.recommendationCard}>
            Informasikan ke guru kelas
          </div>
        </div>
      </div>

      <div className={styles.disclaimerBox}>
        <p className={styles.disclaimerText}>
          ⚠️ <strong>Disclaimer penting:</strong> Laporan ini adalah hasil skrining awal berbasis pola tulisan tangan menggunakan computer vision — BUKAN diagnosis klinis. Leksa bukan pengganti psikolog atau dokter. Jika pola error ini konsisten selama 2+ minggu, sangat disarankan konsultasi ke profesional untuk assessment formal. Hasil laporan ini dapat dicetak atau dikirim sebagai bahan diskusi dengan tenaga ahli.
        </p>
      </div>

      <div className={styles.footer}>
        <button className={styles.closeButton} onClick={handleClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
