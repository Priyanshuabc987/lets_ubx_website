
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';
import { AskUsClient } from './AskUsClient';

export const metadata: Metadata = {
  title: "Ask the Cedat Community | Bengaluru Startup Help & Support",
  description: "Have a question about the Bengaluru startup ecosystem? Need help with your startup idea? Ask the Cedat community. We're here to support you with resources, connections, and advice.",
  openGraph: {
    title: "Ask the Cedat Community | Bengaluru Startup Help & Support",
    description: "Get support and answers from the Cedat community. We're here to help you on your startup journey.",
    url: `${BASE_URL}/ask-us`,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Ask the Cedat Community',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ask the Cedat Community | Bengaluru Startup Help & Support",
    description: "Get support and answers from the Cedat community. We're here to help you on your startup journey.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};

export default function AskUsPage() {
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
        "name": "Ask Us",
        "item": `${BASE_URL}/ask-us`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AskUsClient />
    </>
  );
}
