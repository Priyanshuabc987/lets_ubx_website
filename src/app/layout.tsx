
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { BASE_URL, LOGO_URL } from "@/lib/constants";
import { FaviconFixer } from "@/components/layout/FaviconFixer";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
  description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. We are community builders across all sectors, offering regular meetups, events, funding opportunities, and resources for founders in Hardware, Healthcare, Tech, Social Impact, and more. Join us to connect, learn, and grow your startup.",
  keywords: "startup ecosystem Bengaluru, startup community Bengaluru, tech community Bengaluru, entrepreneur network Bengaluru, startup events Bengaluru, tech meetups Bengaluru, founder events, startup funding Bengaluru, seed funding, angel investors Bengaluru, startup ideas, how to start a startup, hardware startups, healthcare startups, edtech, foodtech, social impact startups, fashion startups, import export business, sustainability, NGOs, Bengaluru, Karnataka",
  icons: {
    icon: LOGO_URL,
  },
  openGraph: {
    title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    url: BASE_URL,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Cedat Community',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Cedat",
        "url": BASE_URL,
        "logo": LOGO_URL,
        "description": "Cedat is Bengaluru's largest and most diverse startup ecosystem, providing resources, events, and a community for entrepreneurs across all sectors.",
        "sameAs": [
          "https://www.linkedin.com/company/cedat/",
          "https://twitter.com/cedat_org",
          "https://www.instagram.com/cedat.in"
        ]
      },
      {
        "@type": "LocalBusiness",
        "name": "Cedat",
        "description": "The central hub for Bengaluru's startup ecosystem, offering events, meetups, and community support across various tech and business sectors.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "116, OM SHIVA SHAKTHI, 3RD MAIN, 4TH CROSS, Marathahalli Colony",
            "addressLocality": "Bangalore",
            "addressRegion": "KA",
            "postalCode": "560037",
            "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.9569,
          "longitude": 77.7011
        },
        "url": BASE_URL,
        "telephone": "+91-7406345305",
        "pricerange": "₹",
        "image": LOGO_URL,
        "department": [
          { "@type": "Organization", "name": "Hardware" },
          { "@type": "Organization", "name": "Healthcare" },
          { "@type": "Organization", "name": "Technology" },
          { "@type": "Organization", "name": "Import & Export" },
          { "@type": "Organization", "name": "Food & Agriculture" },
          { "@type": "Organization", "name": "Fashion & Lifestyle" },
          { "@type": "Organization", "name": "Sustainability & SDGs" },
          { "@type": "Organization", "name": "Social Impact & NGOs" },
          { "@type": "Organization", "name": "Education & Employment" },
          { "@type": "Organization", "name": "Nexus of CEDAT (NOC)" }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <FaviconFixer />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
