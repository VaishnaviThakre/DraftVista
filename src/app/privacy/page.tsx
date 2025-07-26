'use client';
import Link from 'next/link';
import shared from '../LandingPage.module.css';
import styles from './PrivacyPage.module.css';
import '../globals.css';

export default function PrivacyPage() {
  return (
    <>

      <div className={`${shared.container} ${shared.asulRegular} ${styles.gridWrapper}`}>
        {/* Sidebar nav */}
        <nav className={styles.sidebar}>
          <ul>
            <li><a href="#1" className={styles.active}>1. Information We Collect</a></li>
            <li><a href="#2">2. How We Use It</a></li>
            <li><a href="#3">3. Sharing & Disclosure</a></li>
            <li><a href="#4">4. Security</a></li>
            <li><a href="#5">5. Your Choices</a></li>
            <li><a href="#6">6. Changes to This Policy</a></li>
            <li><a href="#7">7. Contact Us</a></li>
          </ul>
        </nav>

        {/* Main content */}
        <main className={styles.content}>
          <h1 className={shared.heroTitle}>Privacy Policy</h1>
          <p className={`${shared.bodyText} ${styles.effectiveDate}`}>
            Effective Date: June 24, 2025
          </p>

          <section id="1" className={styles.section}>
            <h2>1. Information We Collect</h2>
            <ul>
              <li><strong>Manuscript files:</strong> PDFs or DOCX you upload for review.</li>
              <li><strong>Journal URLs:</strong> the links you provide to identify target journals.</li>
              <li><strong>Usage data:</strong> pages visited, features used, and timestamps.</li>
              <li><strong>Contact info:</strong> if you sign up or reach out to support.</li>
            </ul>
          </section>

          <section id="2" className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To process and analyze your manuscript using our AI models.</li>
              <li>To improve our service, troubleshoot issues, and develop new features.</li>
              <li>To send you updates, security alerts, and support messages if you opt in.</li>
            </ul>
          </section>

          <section id="3" className={styles.section}>
            <h2>3. Sharing & Disclosure</h2>
            <ul>
              <li>We share your manuscript data with third-party AI providers (e.g., OpenAI) solely to deliver our review service.</li>
              <li>We never sell your personal data to advertisers or other third parties.</li>
              <li>We may disclose information to comply with legal obligations or protect our rights.</li>
            </ul>
          </section>

          <section id="4" className={styles.section}>
            <h2>4. Security</h2>
            <p className={shared.bodyText}>
              We take industry-standard measures (encryption in transit, secure cloud storage) to protect your data, but no system is infallible. Use our service at your own risk.
            </p>
          </section>

          <section id="5" className={styles.section}>
            <h2>5. Your Choices</h2>
            <ul>
              <li>You can delete your account and all submitted manuscripts at any time by contacting support.</li>
              <li>You may opt out of marketing emails via the unsubscribe link in each message.</li>
              <li>You can request a copy of or deletion of your personal data under applicable laws.</li>
            </ul>
          </section>

          <section id="6" className={styles.section}>
            <h2>6. Changes to This Policy</h2>
            <p className={shared.bodyText}>
              We may update this policy periodically. We’ll post a new “Effective Date” here whenever we do.
            </p>
          </section>

          <section id="7" className={styles.section}>
            <h2>7. Contact Us</h2>
            <p className={shared.bodyText}>
              If you have questions or requests about your data, email us at{' '}
              <a href="vpthakre17@gmail.com" className={shared.ctaSecondary}>
                vpthakre17@gmail.com
              </a>.
            </p>
          </section>

        </main>
      </div>
    </>
  );
}
