import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FixRegistrationForm } from '@/components/fix/FixRegistrationForm';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: "FIX Registration - Let's UBX",
  description: "Apply for Founders & Investors Xplore (FIX) by Let's UBX and track your application status.",
  openGraph: {
    title: "FIX Registration - Let's UBX",
    description: "Apply for Founders & Investors Xplore (FIX) by Let's UBX and track your application status.",
    url: `${BASE_URL}/fix/register`,
    siteName: "Let\'s UBX",
    type: 'website',
  },
};

export default function FixRegisterPage() {
  return (
    <div className="min-h-screen ">
      <main className="pt-20 pb-20 md:pt-28">
        <div className="container mx-auto px-4">
          <Link href="/fix">
            <Button variant="ghost" size="sm" className="mb-6 text-black ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FIX
            </Button>
          </Link>

          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex justify-center">
              <Link href="/fix/check">
                <Button size="lg" className="rounded-full bg-primary px-6 font-semibold text-white shadow-lg ">
                  <Search className="mr-2 h-4 w-4" />
                  Check Your Status
                </Button>
              </Link>
            </div>

            <FixRegistrationForm />
          </div>
        </div>
      </main>
    </div>
  );
}
