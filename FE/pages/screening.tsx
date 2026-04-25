import styles from '../styles/Screening.module.css';

export default function Screening() {
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
          <h1 className={styles.title} style={{ color: '#6F45BA' }}>Dengarkan lalu tulis dalam kertas</h1>
        </div>
      </div>
      <div className={styles.centerAction}>
        <button className={styles.button} style={{ color: '#ffffff', backgroundColor: '#7d57c1' }}>
          <img src="/assets/ear.svg" alt="Listen" className={styles.icon} /> Dengar
        </button>
        <p className={styles.instruction} style={{ color: '#333333' }}>Tekan tombol untuk mendengar!</p>
      </div>
    </div>
  );
}