// src/app/page.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LandingPage.module.css';

import {
  FaFileAlt,
  FaChartLine,
  FaPenFancy,
  FaUsers,
  FaCheckCircle,
  FaComments,
} from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Bringing clarity to your manuscript with intelligent review and
            rejection analysis.
          </h1>
          <p className={styles.heroSubtitle}>
            DraftVista empowers researchers with AI-driven insights to decode
            reviewer feedback, refine manuscripts, and see their papers the way
            journals do—before submission.
          </p>
          <div className={styles.heroActions}>
            <Link href="/submit" className={styles.ctaPrimary}>
              Submit your manuscript
            </Link>
          </div>
        </div>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/homepage.webp"
            alt="Hero"
            width={600}
            height={400}
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.featuresGrid}>
          {[
            {
              Icon: FaFileAlt,
              title: 'Format Checks',
              desc: 'Automatically enforce each journal’s exact submission guidelines—margins, headings, citations and section order—so you submit with confidence every time.',
            },
            {
              Icon: FaChartLine,
              title: 'Rejection Analysis',
              desc: 'AI-powered insight into the most common reasons papers get turned down, so you can preemptively address key weaknesses before you submit.',
            },
            {
              Icon: FaPenFancy,
              title: 'Grammar & Plagiarism',
              desc: 'Deep grammar, spelling, and plagiarism scans that highlight issues inline and suggest precise rewrites to sharpen your writing and maintain integrity.',
            },
            {
              Icon: FaUsers,
              title: 'Collaboration',
              desc: 'Real-time sharing, version history, and comment threads let your co-authors and mentors collaborate seamlessly—no more emailed attachments.',
            },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} className={styles.featureCard}>
              <Icon className={styles.featureIcon} />
              <h3 className={styles.featureTitle}>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsContainer}>
          {[
            { icon: FaFileAlt, label: 'Upload your manuscript' },
            { icon: FaChartLine, label: 'Choose your journal' },
            { icon: FaComments, label: 'Paste reviewer comments' },
            { icon: FaCheckCircle, label: 'Get instant feedback' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={styles.stepCard}
                style={{ '--delay': `${i * 0.2}s` } as React.CSSProperties}
              >
                <div className={styles.stepCircle}>
                  <Icon />
                </div>
                <p className={styles.stepLabel}>{step.label}</p>
                {i < 3 && (
                  <svg
                    className={styles.stepArrow}
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,10 L90,10" />
                    <polygon points="90,5 100,10 90,15" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Feedback */}
      <section className={styles.feedbackSection}>
        <h2 className={styles.sectionTitle}>We’d Love Your Feedback</h2>
        <p className={styles.feedbackText}>
          Your experience with DraftVista helps us build a better tool for
          everyone. Share your thoughts, ideas or issues so we can make
          improvements that matter to you.
        </p>
        <div className={styles.feedbackActions}>
          <Link href="mailto:vpthakre17@gmail.com" className={styles.ctaPrimary}>
            Email Us Your Feedback
          </Link>
        </div>
      </section>
    </div>
  );
}
