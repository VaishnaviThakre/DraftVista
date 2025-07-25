'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisData {
  success: boolean;
  analysisType: string;
  manuscript: {
    filename: string;
    size: number;
  };
  journal: {
    url: string;
    name: string;
  };
  analysis: {
    type: string;
    fullAnalysis: string;
    sections: Record<string, string> | { title: string; content: string; subsections?: { title: string; content: string }[] }[];
    summary: string;
    recommendations: string[];
    generatedAt: string;
  };
  timestamp: string;
  projectId: string;
  submittedAt: string;
}

export function ResultsClient({ projectId }: { projectId: string }) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = () => {
      try {
        const storedData = localStorage.getItem(`analysis-${projectId}`);
        if (storedData) {
          const data = JSON.parse(storedData) as AnalysisData;
          setAnalysisData(data);
        } else {
          setError('Analysis results not found. Please submit your manuscript for analysis first.');
        }
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Failed to load analysis results.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/submit" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit New Analysis
          </Link>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">Analysis results not found for this project.</p>
          <Link 
            href="/submit" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit New Analysis
          </Link>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manuscript Analysis Results</h1>
              <p className="text-gray-600">Project ID: {analysisData.projectId}</p>
              <p className="text-sm text-gray-500">
                Analyzed: {new Date(analysisData.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-md">
              <div className="text-sm text-gray-700">Analysis Type</div>
              <div className="text-lg font-semibold text-blue-600 capitalize">
                {analysisData.analysisType.replace('-', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Manuscript Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manuscript Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Filename</p>
              <p className="font-medium text-gray-900 break-all">{analysisData.manuscript.filename}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">File Size</p>
              <p className="font-medium text-gray-900">{formatFileSize(analysisData.manuscript.size)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Target Journal</p>
              <p className="font-medium text-gray-900">{analysisData.journal.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Journal URL</p>
              <a 
                href={analysisData.journal.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {analysisData.journal.url}
              </a>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        {analysisData.analysis.summary && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisData.analysis.summary}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Full Analysis */}
        {analysisData.analysis.fullAnalysis && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
            <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisData.analysis.fullAnalysis}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysisData.analysis.recommendations?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Recommendations</h2>
            <ul className="space-y-4">
              {analysisData.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="prose max-w-none text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {recommendation}
                    </ReactMarkdown>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sections Analysis */}
        {analysisData.analysis.sections && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Section-by-Section Analysis</h2>
            <div className="space-y-6">
              {Array.isArray(analysisData.analysis.sections) ? (
                // Handle array of section objects
                analysisData.analysis.sections.map((section, index) => (
                  <div key={index} className="border-l-4 border-blue-100 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{section.title || `Section ${index + 1}`}</h3>
                    <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {section.content || ''}
                      </ReactMarkdown>
                    </div>
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="mt-4 ml-4 space-y-3">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="border-l-2 border-gray-200 pl-3">
                            <h4 className="font-medium text-gray-800 mb-1">{subsection.title}</h4>
                            <div className="prose max-w-none text-gray-600 text-sm whitespace-pre-wrap">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {subsection.content || ''}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : typeof analysisData.analysis.sections === 'object' ? (
                // Handle object with key-value pairs
                Object.entries(analysisData.analysis.sections).map(([sectionName, content]) => (
                  <div key={sectionName} className="border-l-4 border-blue-100 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{sectionName}</h3>
                    <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/submit" 
              className="flex-1 bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit New Analysis
            </Link>
            <button 
              onClick={() => window.print()} 
              className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Print Results
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(analysisData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analysis-${analysisData.projectId}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Download Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
