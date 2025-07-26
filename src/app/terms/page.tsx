import Link from 'next/link'
import shared from '../../app/LandingPage.module.css';
import styles from './terms.module.css';
import '../globals.css';

export default function TermsPage() {
  return (
    <>


      <div className={`${shared.container} ${shared.asulRegular} ${styles.gridWrapper}`}>
        {/* left nav */}
        <nav className={styles.sidebar}>
          <ul>
            <li><a href="#1" className={styles.active}>Your Use of Our Service</a></li>
            <li><a href="#2">Intellectual Property</a></li>
            <li><a href="#3">Disclaimer</a></li>
            <li><a href="#4">Limitation of Liability</a></li>
            <li><a href="#5">Changes</a></li>
            <li><a href="#6">Contact</a></li>
          </ul>
        </nav>

        {/* right content */}
        <main className={styles.content}>
          <h1 className={shared.heroTitle}>Terms of Use</h1>
          <p className={`${shared.bodyText} ${styles.effectiveDate}`}>
            Effective Date: June 16, 2025
          </p>

          <section id="1" className={styles.section}>
            <h2>1. Your Use of Our Service</h2>
            <ul>
              <li>By submitting your manuscript, you confirm you have the right to share it with us and agree to its processing.</li>
              <li>This is a frontend-only demonstration. In a full implementation, manuscripts would be temporarily stored on secure servers to facilitate processing.</li>
              <li>In a full implementation, manuscript content would be processed using large language models (LLMs) to generate feedback.</li>
              <li>By using this service, you consent to this processing of your manuscript by third-party services (Backblaze and OpenAI).</li>
            </ul>
          </section>

          <section id="2" className={styles.section}>
            <h2>2. Intellectual Property</h2>
            <ul>
              <li>Your manuscript remains your property.</li>
              <li>Our feedback is generated automatically by AI and does not constitute formal peer review.</li>
              <li>You are responsible for ensuring that you do not share any confidential, sensitive, or proprietary information in your manuscript submission.</li>
            </ul>
          </section>

          <section id="3" className={styles.section}>
            <h2>3. Disclaimer</h2>
            <ul>
              <li>Our service is for informational purposes only and does not guarantee acceptance of your paper or accuracy of feedback.</li>
              <li>Use of our service is at your own risk.</li>
            </ul>
          </section>

          <section id="4" className={styles.section}>
            <h2>4. Limitation of Liability</h2>
            <ul>
              <li>We are not liable for damages arising from use of this website or our feedback.</li>
            </ul>
          </section>

          <section id="5" className={styles.section}>
            <h2>5. Changes</h2>
            <ul>
              <li>We may update these terms as needed.</li>
            </ul>
          </section>

          <section id="6" className={styles.section}>
            <h2>6. Contact</h2>
            <p className={shared.bodyText}>
              For questions, email us at{' '}
              <a href="vpthakre17@gmail.com" className={shared.ctaSecondary}>
                vpthakre17@gmail.com
              </a>.
            </p>
          </section>
        </main>
      </div>
    </>
  )
}
