import Link from 'next/link';
import styles from '@/app/LandingPage.module.css';
import '../globals.css';

export default function Header() {
  return (
    <header className={`${styles.header} ${styles.asulRegular}`}>
      <Link href="/" className={styles.logo}>DraftVista</Link>
      <div className={styles.authButtons}>
        {/* Removed theme toggle to prevent hydration issues */}
      </div>
    </header>
  );
}
