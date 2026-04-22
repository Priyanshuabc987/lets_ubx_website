
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EventManagement } from '@/components/admin/EventManagement';
import { Card, CardContent } from '@/components/ui/card';
import { generateSEO, seoConfigs } from '@/lib/seo';
import { Calendar, Images, FileText, Link as LinkIcon } from 'lucide-react';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
import { HeroManagement } from '@/components/admin/HeroManagement';
import { SocialPostManagement } from '@/components/admin/SocialPostManagement';
import { FixManagement } from '@/components/admin/FixManagement';

export const adminSections = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'hero', label: 'Hero Images', icon: Images },
  { id: 'gallery', label: 'Gallery Images', icon: Images },
  { id: 'social', label: 'Social Media', icon: FileText },
  { id: 'fix', label: 'FIX Page', icon: LinkIcon },
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('events');

  useEffect(() => {
    if (searchParams) {
      const s = searchParams.get('section');
      if (s && adminSections.some(section => section.id === s)) {
        setActiveSection(s);
      }
    }
  }, [searchParams]);

  const onSectionChange = (s: string) => {
    router.push(s === 'events' ? '/admin' : `/admin?section=${s}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventManagement />;
      case 'hero':
        return <HeroManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'social':
        return <SocialPostManagement />;
      case 'fix':
        return <FixManagement />;
      default:
        return <EventManagement />;
    }
  };

  return (
    <>
      {generateSEO(seoConfigs.admin)}
      <AdminLayout
        sections={adminSections}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      >
        {renderContent()}
      </AdminLayout>
    </>
  );
}
