
import { getGalleryPhotos, getGalleryVideos } from "@/lib/data/gallery";
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { Metadata } from "next";
import { BASE_URL, LOGO_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Event Gallery - Photos of Bengaluru's Startup and Tech Community",
  description: "Explore photos from Cedat's vibrant events. See the energy of our startup meetups, workshops, and networking sessions. A glimpse into the heart of Bengaluru's tech ecosystem.",
  openGraph: {
    title: "Event Gallery - Cedat",
    description: "Explore photos from Cedat's vibrant events and see the energy of our startup community.",
    url: `${BASE_URL}/gallery`,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Cedat Event Gallery',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Event Gallery - Cedat",
    description: "Explore photos from Cedat's vibrant events and see the energy of our startup community.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};


export default async function GalleryPage() {
  const [photos, videos] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
  ]);

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
        "name": "Gallery",
        "item": `${BASE_URL}/gallery`
      }
    ]
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GalleryPageClient photos={photos} videos={videos}  />
    </>
  );
}
