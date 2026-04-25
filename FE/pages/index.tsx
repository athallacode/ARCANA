
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <img src="/assets/duck.svg" alt="Duck" className={styles.duck} draggable={false} />
        <h1 className={styles.title}>Yuk main dulu!</h1>
      </div>
      <button className={styles.button}>Mulai</button>
    </div>
  );
}
