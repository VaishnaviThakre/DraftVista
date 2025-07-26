// src/components/Footer.tsx
import Link from 'next/link';
import styles from '@/app/LandingPage.module.css';
import '../globals.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <h4 className={styles.footerHeading}>Company</h4>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="https://medium.com/@vpthakre17">Blog</Link></li>
            <li><Link href="https://www.linkedin.com/in/vaishnavi-thakre-72b82a26a/">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.footerHeading}>Resources</h4>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={styles.footerHeading}>Follow Us</h4>
          <div className={styles.socialLinks}>
            <Link href="https://www.linkedin.com/in/vaishnavi-thakre-72b82a26a/">LinkedIn</Link>
            <Link href="https://github.com/VaishnaviThakre">GitHub</Link>
          </div>
        </div>
      </div>
      <p className={styles.footerText}>© 2025 DraftVista</p>
    </footer>
  );
}
