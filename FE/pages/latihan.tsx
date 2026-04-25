import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Latihan.module.css';

// glowing star componenet svg btw
const GlowingStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_13_24853)">
      <path d="M12.8176 7.83914C12.3789 8.30314 12.0918 9.20225 12.1785 9.83603L12.5749 12.6987C12.6625 13.3329 12.2634 13.6262 11.6878 13.3516L9.08738 12.1089C8.51182 11.8334 7.57271 11.8374 6.99849 12.1169L4.40916 13.38C3.83538 13.6596 3.43449 13.3685 3.51716 12.7347L3.89182 9.86847C3.97449 9.23425 3.68071 8.3378 3.23849 7.87691L1.24116 5.79336C0.79849 5.33247 0.950046 4.85914 1.57671 4.74225L4.40782 4.21425C5.03449 4.09736 5.79271 3.53958 6.0936 2.97469L7.4496 0.424913C7.7496 -0.139976 8.24471 -0.141309 8.54871 0.420913L9.92427 2.96002C10.2292 3.52225 10.9909 4.07425 11.6194 4.1858L14.454 4.69291C15.0816 4.80491 15.2367 5.27691 14.798 5.74136L12.8176 7.83914Z" fill="#FFAC33" />
      <path d="M4.34787 0.969352C4.80254 1.59735 5.43498 3.15469 5.11098 3.39024C4.78742 3.62624 3.50787 2.54135 3.0532 1.91335C2.59853 1.28535 2.63765 0.727574 2.99498 0.46713C3.35231 0.206241 3.89276 0.341796 4.34787 0.969352ZM12.947 1.91335C12.4928 2.54135 11.2132 3.62669 10.8888 3.3898C10.5648 3.15424 11.1976 1.59735 11.6528 0.969796C12.1074 0.341352 12.6474 0.205796 13.0052 0.46713C13.3621 0.727574 13.4008 1.28535 12.947 1.91335ZM7.38876 14.796C7.38831 14.02 7.78787 12.3867 8.1892 12.3867C8.58787 12.3867 8.98831 14.02 8.98787 14.7956C8.98787 15.572 8.63053 16.0009 8.18787 16C7.74609 16.0009 7.38876 15.5725 7.38876 14.796ZM14.5794 10.6796C13.8439 10.44 12.4203 9.5538 12.5443 9.17069C12.6674 8.78935 14.3385 8.91246 15.0732 9.15246C15.8088 9.39246 16.1048 9.8658 15.9679 10.2885C15.831 10.7107 15.315 10.9196 14.5794 10.6796ZM0.925646 9.15291C1.6612 8.91291 3.33187 8.7898 3.45631 9.17246C3.57898 9.55335 2.15498 10.4409 1.42031 10.68C0.685202 10.92 0.167868 10.7111 0.0323126 10.2889C-0.104576 9.86668 0.189646 9.39335 0.925646 9.15291Z" fill="#FFD983" />
    </g>
    <defs>
      <clipPath id="clip0_13_24853">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function Latihan() {
  const router = useRouter();
  const [view, setView] = useState<'landing' | 'learning' | 'quiz'>('landing');
  const [stage, setStage] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleLanjut = () => {
    setView('learning');
  };

  const handleStartQuiz = () => {
    setView('quiz');
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const correctAns = stage === 1 ? 'A' : 'B';
    if (option === correctAns) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (stage === 1 && isCorrect) {
      setStage(2);
      setView('learning');
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Reset or continue
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  if (view === 'learning') {
    return (
      <div className={styles.container}>
        <Head>
          <title>Belajar - Arcana</title>
        </Head>

        <div className={styles.quizContainer}>
          <div className={styles.quizHeader}>
            <div className={styles.levelTextQuiz}>
              <GlowingStar />
              Level 1
            </div>
            <h1 className={styles.quizTitle}>Huruf & Bunyi Dasar</h1>
            <div className={styles.tahapText}>Tahap {stage}</div>
            <div className={styles.quizProgressTrack}>
              <div className={styles.quizProgressFill} style={{ width: stage === 1 ? '30%' : '50%' }}></div>
            </div>
          </div>

          <div className={styles.learningLabel}>{stage === 1 ? 'Huruf Vokal' : 'Huruf Mirip'}</div>

          <div className={styles.learningCard}>
            <div className={styles.arrowCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className={styles.bigLetter}>{stage === 1 ? 'Aa' : 'Bb'}</h2>
            <p className={styles.subText}>{stage === 1 ? 'seperti bunyi “ayam”' : 'seperti bunyi “bola”'}</p>

            <button className={styles.speakerBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dengarkan bunyinya
            </button>
          </div>

          <div className={styles.learningFooter}>
            <button className={styles.nextButtonPurple} onClick={handleStartQuiz}>
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    return (
      <div className={styles.container}>
        <Head>
          <title>Latihan Quiz - Arcana</title>
        </Head>

        <div className={styles.quizContainer}>
          <div className={styles.quizHeader}>
            <div className={styles.levelTextQuiz}>
              <GlowingStar />
              Level 1
            </div>
            <h1 className={styles.quizTitle}>Huruf & Bunyi Dasar</h1>
            <div className={styles.tahapText}>Tahap {stage}</div>
            <div className={styles.quizProgressTrack}>
              <div className={styles.quizProgressFill} style={{ width: stage === 1 ? '60%' : '80%' }}></div>
            </div>
          </div>

          <div className={styles.latihanLabel}>Latihan</div>

          <div className={styles.questionCard}>
            <h2 className={styles.questionText}>
              {stage === 1 ? 'Huruf vokal apakah aku?' : 'Huruf apakah aku?'}
            </h2>
            <button className={styles.speakerBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dengarkan bunyinya
            </button>
          </div>

          <div className={styles.instructionText}>Pilih huruf yang kamu dengar</div>

          <div className={styles.optionsGrid}>
            {(stage === 1 ? ['A', 'I', 'U', 'E', 'O'] : ['B', 'D', 'P', 'Q']).map((char) => (
              <button
                key={char}
                className={`${styles.optionButton} ${selectedOption === char ? (char === (stage === 1 ? 'A' : 'B') ? styles.optionButtonSelected : styles.optionButtonWrong) : ''}`}
                onClick={() => handleOptionClick(char)}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {isCorrect !== null && (
          <div className={`${styles.feedbackBanner} ${!isCorrect ? styles.feedbackBannerWrong : ''}`}>
            <div className={`${styles.feedbackHeader} ${!isCorrect ? styles.feedbackHeaderWrong : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isCorrect ? 'Benar' : 'Salah'}
            </div>
            <p className={styles.feedbackText}>
              {isCorrect
                ? stage === 1
                  ? 'Huruf vokal A'
                  : 'Huruf B ada pada kata "bola"'
                : 'Jawabanmu belum sesuai'}
            </p>
            <button className={`${styles.nextButton} ${!isCorrect ? styles.nextButtonWrong : ''}`} onClick={handleNext}>
              Berikutnya
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Latihan - Arcana</title>
      </Head>

      <div className={styles.topSection}>
        <div style={{ height: '30px' }}></div>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <img src="/assets/duck.svg" alt="User Avatar" className={styles.avatarImg} />
          </div>
          <div className={styles.greetingInfo}>
            <h1 className={styles.greetingTitle}>Hai!</h1>
            <div className={styles.levelBadge}>
              <GlowingStar />
              <span className={styles.levelText}>Level 2</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.progressCard}>
          <h2 className={styles.progressTitle}>Progress latihanmu</h2>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: '80%' }}></div>
          </div>
          <div className={styles.progressActionRow}>
            <span className={styles.progressSubtitle}>
              <strong className={styles.percentText}>80%</strong> menuju level 3
            </span>
            <button className={styles.lanjutButton} onClick={handleLanjut}>
              Lanjut
            </button>
          </div>
        </div>

        <div className={styles.tipCard}>
          <img src="/assets/duck.svg" alt="Tip Mascot" className={styles.tipMascot} />
          <p className={styles.tipText}>
            Ingat: huruf <strong>b</strong> seperti bola di depan tongkat! Coba bayangkan tongkat lurus dulu, baru bola di kanan.
          </p>
        </div>

        <div className={styles.exerciseListContainer}>
          <h2 className={styles.sectionTitle}>Huruf yang perlu dilatih</h2>

          <div className={styles.exerciseCard}>
            <span className={styles.exerciseText}>Inversi b/d sering tertukar</span>
          </div>

          <div className={styles.exerciseCard}>
            <span className={styles.exerciseText}>Inversi p/q sering tertukar</span>
          </div>
        </div>
      </div>
    </div >
  );
}
