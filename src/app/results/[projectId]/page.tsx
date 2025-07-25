import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResultsClient } from './results-client';

export const metadata: Metadata = {
  title: 'Analysis Results | DraftVista',
  description: 'View your manuscript analysis results',
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // Basic validation of projectId format
  if (!projectId || typeof projectId !== 'string' || projectId.length < 8) {
    notFound();
  }

  // The actual data loading and interactive UI is handled by the client component
  return <ResultsClient projectId={projectId} />;
}

export const dynamic = 'force-dynamic';
