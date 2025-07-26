'use client';
import { useRef, useState, DragEvent, ChangeEvent, useCallback } from 'react';
import styles from './SubmitPage.module.css';
import '../globals.css';


export interface FileWithPreview extends File {
  preview?: string;
}

interface DropzoneProps {
  onFileSelect: (file: FileWithPreview) => void;
  selectedFile: FileWithPreview | null;
}

export default function Dropzone({ onFileSelect, selectedFile }: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = useCallback((file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF or DOCX files are allowed');
      return;
    }
    setError(null);
    const fileWithPreview: FileWithPreview = Object.assign(file, {
      preview: file.type === 'application/pdf' ? '/icons/pdf-icon.svg' : '/icons/docx-icon.svg'
    });
    onFileSelect(fileWithPreview);
  }, [onFileSelect]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    validateAndSelect(files[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={styles.dropzoneWrapper}>
      <div
        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key==='Enter'||e.key===' ') fileInputRef.current?.click(); }}
      >
        {!selectedFile ? (
          <p className={styles.placeholder}>
            📄 Drag &amp; drop your manuscript here<br/>or click to browse…
          </p>
        ) : (
          <div className={styles.filePreview}>
            <img src={selectedFile.preview} alt="" className={styles.previewIcon}/>
            <div>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <p className={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
