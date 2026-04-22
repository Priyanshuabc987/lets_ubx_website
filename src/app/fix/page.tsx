
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';
import { FixPageClient } from '@/components/fix/FixPageClient';
import { getFixSettings } from '@/lib/data/fix';

export const metadata: Metadata = {
    title: "Founders & Investors Xplore (FIX) - CEDAT",
    description: "An exclusive event that brings together founders, investors, mentors, and startup ecosystem leaders.",
    openGraph: {
      title: "Founders & Investors Xplore (FIX) - CEDAT",
      description: "An exclusive event that brings together founders, investors, mentors, and startup ecosystem leaders.",
      url: `${BASE_URL}/fix`,
      siteName: 'CEDAT',
      images: [
        {
          url: `${BASE_URL}/fix/DSC01989.jpg.jpeg`,
          width: 1200,
          height: 630,
          alt: 'Founders & Investors Xplore Event',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Founders & Investors Xplore (FIX) - CEDAT",
      description: "An exclusive event for founders and investors.",
      images: [`${BASE_URL}/fix/fix.jpeg`],
      creator: '@cedat_org',
    },
};

export default async function FICPage() {
  const fixSettings = await getFixSettings();
  const registrationLink = fixSettings?.registration_link || "https://form.svhrt.com/69e5b6ed001e39939dd3b51a";

  return <FixPageClient registrationLink={registrationLink} />;
}
