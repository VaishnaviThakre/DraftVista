'use client';
import Link from 'next/link';
import { useState, FormEvent } from 'react';

import Dropzone, { FileWithPreview } from './Dropzone';
import { isValidURL } from './validations';
import shared from '../LandingPage.module.css';
import styles from './SubmitPage.module.css';



export default function SubmitPage() {
  const [file, setFile] = useState<FileWithPreview|null>(null);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'Not submitted'|'Submitted'>('Not submitted');
  const [comments, setComments] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type:'error'|'success';text:string}|null>(null);

  const allValid =
    file !== null &&
    isValidURL(url) &&
    agreed &&
    (status==='Not submitted' || comments.trim().length>0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allValid || !file) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('manuscript', file);
      formData.append('journalUrl', url);
      
      // Add reviewer comments if submitted status
      if (status === 'Submitted') {
        formData.append('reviewerComments', comments);
      }
      
      // Determine API endpoint based on submission status
      const endpoint = status === 'Submitted' 
        ? 'http://localhost:3001/api/analyze-post-rejection'
        : 'http://localhost:3001/api/analyze-pre-submission';
      
      console.log(`Submitting to: ${endpoint}`);
      
      // Submit to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Analysis result:', result);
      
      // Store result in localStorage for results page
      const projectId = `analysis-${Date.now()}`;
      localStorage.setItem(`analysis-${projectId}`, JSON.stringify({
        ...result,
        projectId,
        submittedAt: new Date().toISOString()
      }));
      
      // Show success message
      setMessage({
        type: 'success',
        text: `Analysis complete! Your manuscript has been analyzed successfully.`
      });
      
      // Redirect to results page after short delay
      setTimeout(() => {
        window.location.href = `/results/${projectId}`;
      }, 2000);
      
    } catch (err: any) {
      console.error('Submission error:', err);
      setMessage({
        type: 'error',
        text: `Analysis failed: ${err.message}. Please ensure the backend server is running on port 3001.`
      });
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`${shared.container} ${shared.asulRegular} ${styles.gridWrapper}`}>
        {/* Sidebar stepper */}
        <aside className={styles.sidebar}>
          <ul>
            <li><span className={styles.stepActive}>1. Upload</span></li>
            <li><span>2. Details</span></li>
            <li><span>3. Confirm</span></li>
          </ul>
        </aside>

        {/* Main form area */}
        <main className={styles.mainContent}>
          <h1 className={shared.heroTitle}>Quick Manuscript Submission</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Dropzone onFileSelect={setFile} selectedFile={file} />

            <div className={styles.field}>
              <label htmlFor="journalUrl" className={shared.bodyText}>Target Journal URL</label>
              <input
                id="journalUrl"
                type="url"
                placeholder="https://journal.com/..."
                className={shared.inputField}
                value={url}
                onChange={e=>setUrl(e.target.value)}
                aria-invalid={!isValidURL(url)}
                required
              />
              {url && <span>{isValidURL(url)?'✅':'❌'}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="status" className={shared.bodyText}>
                Have you submitted this paper yet?
              </label>
              <select
                id="status"
                className={shared.inputField}
                value={status}
                onChange={e=>setStatus(e.target.value as any)}
              >
                <option>Not submitted</option>
                <option>Submitted</option>
              </select>
            </div>

            {status==='Submitted' && (
              <div className={styles.field}>
                <label htmlFor="comments" className={shared.bodyText}>
                  Paste reviewer comments here
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  className={shared.textareaField}
                  placeholder="e.g., “Revise methodology...”"
                  value={comments}
                  onChange={e=>setComments(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.tc}>
              <input
                id="tc"
                type="checkbox"
                checked={agreed}
                onChange={e=>setAgreed(e.target.checked)}
                className={shared.checkbox}
                required
              />
              <label htmlFor="tc" className={shared.bodyText}>
                I agree to the{' '}
                <Link href="/terms" className={shared.ctaSecondary}>Terms & Conditions</Link>
              </label>
            </div>

            {message && (
              <p role={message.type==='error'?'alert':undefined}
                 className={message.type==='error'?shared.textError:shared.textSuccess}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={!allValid||loading}
              className={shared.ctaPrimary}
            >
              {loading ? 'Submitting…' : 'Submit for Analysis'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
}