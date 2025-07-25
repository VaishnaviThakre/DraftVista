'use client';
import styles from '../LandingPage.module.css';

export default function AboutPage() {
  return (
    <>
      <section className={styles.aboutSection}>
        <h2 className={styles.sectionTitle}>About Me</h2>
        <div className={styles.aboutGrid}>
          {/* Photo */}
          <div className={styles.aboutPhotoWrapper}>
            <img
              src="/profile.jpg"
              alt="Vaishnavi Pravin Thakre"
              className={styles.aboutPhoto}
            />
          </div>

          {/* Bio & Details */}
          <div className={styles.aboutContent}>
            <p className={styles.bodyText}>
              Hi, I’m <strong>Vaishnavi Pravin Thakre</strong>, a BTech
              graduate, In my work helping researchers prepare and submit
              manuscripts, I’ve seen how easily papers get held up or
              rejected—be it because of mismatched formatting, unclear
              objectives, language mistakes, or journal scope misalignment.
            </p>

            <p className={styles.bodyText}>
              My goal is to give every author a fast, friendly way to understand
              exactly where their manuscript needs work—before they ever hit
              “submit.” So, I created DraftVista to help researchers see their
              papers the way journals do, before submission. By analyzing
              reviewer feedback and rejection patterns, we empower authors to
              refine their manuscripts and increase acceptance rates.{' '}
            </p>

            <p className={styles.bodyText}>
              Under the hood, DraftVista uses AI to look at your formatting,
              your paper’s clarity, and how well it aligns with the journal’s
              scope—and then it spits out a simple, prioritized list of exactly
              what to fix. No jargon, no waiting weeks for vague comments—just
              clear guidance so you can turn “revise and resubmit” into
              “accepted, congratulations.”
            </p>

            <h3 className={styles.featureTitle}>Connect with Me</h3>
            <div className={styles.socialLinks}>
              <a href="https://github.com/VaishnaviThakre" target="_blank">
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/vaishnavi-thakre-72b82a26a"
                target="_blank"
              >
                LinkedIn
              </a>
              <a href="mailto:vpthakre17@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
