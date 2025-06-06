import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import styles from "./landing.module.css";
import logo from "./logo.png";

export default function Landing() {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src={logo}
            alt="Logo"
            width="50"
            height="50"
            style={{ borderRadius: "9999px" }} // 완전한 원형
          />
        </div>
        <nav className={styles.nav}>
          <a
            href="https://cautious-cheque-326.notion.site/209bce475fda80bbb685eb3d014d1fa0?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            개발진
          </a>
          <a
            href="https://cautious-cheque-326.notion.site/209bce475fda80f699e9f1687ed3f746"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            이용 약관
          </a>
          <a
            href="https://cautious-cheque-326.notion.site/209bce475fda804f8b33ca1c81ece677"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            광고 문의
          </a>
        </nav>
        <ModeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.contentSection}>
          <h1 className={`${styles.title} ${styles.fadeInUp}`}>
            AIWI <br />
            쇼핑을 똑똑하게
          </h1>

          <p className={`${styles.description} ${styles.fadeInUp}`}>
            쇼핑 고민, AI가 대신합니다. 당신의 상황에 맞춘 AI 쇼핑 추천
            <br />더 이상 상품검색에 시간쓰지 마세요!
          </p>
          <div className={styles.buttonGroup}>
            <Link
              to="/login"
              className={`${styles.primaryButton} ${styles.fadeInUp} ${styles.delay3}`}
            >
              AIWI 바로가기
            </Link>
            <Link
              to="/about"
              className={`${styles.secondaryButton} ${styles.fadeInUp} ${styles.delay4}`}
            >
              사용 방법 →
            </Link>
          </div>
        </div>

        <div className={styles.imageSection}>
          <div
            className={`${styles.imageContainer} ${styles.fadeInUp} ${styles.delay5}`}
          >
            <img
              src={logo}
              alt="Design Tool Illustration"
              width="500"
              height="500"
              className={styles.heroImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
