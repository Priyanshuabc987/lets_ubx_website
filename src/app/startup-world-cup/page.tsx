
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';
import { StartupWorldCupClient } from './StartupWorldCupClient';

export const metadata: Metadata = {
  title: "Startup World Cup Bengaluru - Pitch Competition | Cedat",
  description: "Apply for the Startup World Cup Bengaluru regional, hosted by Cedat. Win $1M in investment, connect with global investors, and showcase your startup on a world stage. Your journey from Bengaluru to global recognition starts here.",
  openGraph: {
    title: "Startup World Cup Bengaluru - Pitch Competition | Cedat",
    description: "Apply for the Startup World Cup Bengaluru regional, hosted by Cedat. Win $1M in investment, connect with global investors, and showcase your startup on a world stage.",
    url: `${BASE_URL}/startup-world-cup`,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Startup World Cup Bengaluru',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Startup World Cup Bengaluru - Pitch Competition | Cedat",
    description: "Apply for the Startup World Cup Bengaluru regional, hosted by Cedat.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};

export default function StartupWorldCupPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Startup World Cup",
        "item": `${BASE_URL}/startup-world-cup`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StartupWorldCupClient />
    </>
  );
}
