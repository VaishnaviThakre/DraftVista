'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
    sections: Record<string, string>;
    summary: string;
    recommendations: string[];
    generatedAt: string;
  };
  timestamp: string;
  projectId: string;
  submittedAt: string;
}

export default function ResultsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // Load from localStorage
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
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadResults();
    }
  }, [projectId, loadResults]);

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
          <Link href="/submit" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
          <Link href="/submit" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Submit New Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manuscript Analysis Results</h1>
              <p className="text-gray-600">Project ID: {projectId}</p>
              <p className="text-sm text-gray-500">
                Analyzed: {new Date(analysisData.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Analysis Type</div>
              <div className="text-lg font-semibold text-blue-600 capitalize">
                {analysisData.analysisType.replace('-', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Manuscript Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manuscript Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Filename</p>
              <p className="font-medium">{analysisData.manuscript.filename}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File Size</p>
              <p className="font-medium">{(analysisData.manuscript.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Journal</p>
              <p className="font-medium">{analysisData.journal.name}</p>
            </div>
            <div>
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
            <p className="text-gray-700 leading-relaxed">{analysisData.analysis.summary}</p>
          </div>
        )}

        {/* Full Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {analysisData.analysis.fullAnalysis}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {analysisData.analysis.recommendations && analysisData.analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Recommendations</h2>
            <ul className="space-y-2">
              {analysisData.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sections Analysis */}
        {analysisData.analysis.sections && Object.keys(analysisData.analysis.sections).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Section-by-Section Analysis</h2>
            <div className="space-y-4">
              {Object.entries(analysisData.analysis.sections).map(([sectionName, content]) => (
                <div key={sectionName} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{sectionName}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
                </div>
              ))}
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
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Print Results
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(analysisData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analysis-${projectId}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Download Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
