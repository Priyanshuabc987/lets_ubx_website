import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FixStatusLookup } from '@/components/fix/FixStatusLookup';
import { BASE_URL } from '@/lib/constants';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'FIX Application Status - CEDAT',
  description: 'Check the status of your Founders & Investors Xplore (FIX) application.',
  openGraph: {
    title: 'FIX Application Status - CEDAT',
    description: 'Check the status of your Founders & Investors Xplore (FIX) application.',
    url: `${BASE_URL}/fix/status`,
    siteName: 'CEDAT',
    type: 'website',
  },
};

export default function FixStatusPage() {
  return (
    <div className="min-h-screen ">
      <main className="pt-20 pb-20 md:pt-28">
        <div className="container mx-auto px-4">
          <Link href="/fix/register">
            <Button variant="ghost" size="sm" className="mb-6 text-black ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Registration
            </Button>
          </Link>

          <div className="mx-auto max-w-3xl">
            <Suspense fallback={<div>Loading status lookup…</div>}>
              <FixStatusLookup />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
