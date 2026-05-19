
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';
import { AskUsClient } from './AskUsClient';

export const metadata: Metadata = {
  title: "Ask the Let's UBX Ecosystem | Bengaluru Startup Help & Support",
  description: "Have a question about the Bengaluru startup ecosystem? Need help with your startup idea? Ask the Let's UBX community. We're here to support you with resources, connections, and advice.",
  openGraph: {
    title: "Ask the Let's UBX Community | Bengaluru Startup Help & Support",
    description: "Get support and answers from the Let's UBX community. We're here to help you on your startup journey.",
    url: `${BASE_URL}/ask-us`,
    siteName: "Let\'s UBX",
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Ask the Let's UBX Community",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ask the Let's UBX Community | Bengaluru Startup Help & Support",
    description: "Get support and answers from the Let's UBX community. We're here to help you on your startup journey.",
    images: [LOGO_URL],
    creator: '@letsubx_org',
  },
};

import { getHomeSettings } from '@/lib/data/settings';

export default async function AskUsPage() {
  const homeSettings = await getHomeSettings();

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
      <AskUsClient 
        title={homeSettings.askUsTitle}
        description={homeSettings.askUsDescription}
        cardTitle={homeSettings.askUsCardTitle}
        cardDescription={homeSettings.askUsCardDescription}
        buttonLabel={homeSettings.askUsButtonLabel}
      />
    </>
  );
}
