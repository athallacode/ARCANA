import { useRouter } from 'next/router';
import styles from '../styles/Result.module.css';

export default function Result() {
  const router = useRouter();
  const { correct = 4, total = 5 } = router.query;

  const handleStartLatihan = () => {
    // navigate to learning or exercises page
    router.push('/latihan');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Hasil Screening</p>
      </div>

      <div className={styles.content}>
        <div className={styles.scoreContainer}>
          <p className={styles.scoreText}>Kamu benar {correct} dari {total} kata</p>
        </div>

        <div className={styles.illustration}>
          <img src="/assets/duck.svg" alt="Success Illustration" className={styles.star} />
        </div>

        <div className={styles.messageContainer}>
          <h1 className={styles.message}>Kita mulai latihan yang cocok untukmu ya!</h1>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.button} onClick={handleStartLatihan}>
          Mulai
        </button>
      </div>
    </div>
  );
}
