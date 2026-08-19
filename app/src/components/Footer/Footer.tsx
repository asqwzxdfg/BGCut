import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✂️</span>
          <span className={styles.logoText}>BGCut</span>
        </div>
        <p className={styles.copyright}>
          © 2026 Sandeul. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
