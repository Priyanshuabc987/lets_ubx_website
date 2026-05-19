
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EventManagement } from '@/components/admin/EventManagement';
import { generateSEO, seoConfigs } from '@/lib/seo';
import { Calendar, Images, FileText, Link as LinkIcon, ClipboardList } from 'lucide-react';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
import { HeroManagement } from '@/components/admin/HeroManagement';
import { SocialPostManagement } from '@/components/admin/SocialPostManagement';
import { FixManagement } from '@/components/admin/FixManagement';
import { ContentManagement } from '@/components/admin/ContentManagement';

export const adminSections = [
  // { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'hero', label: 'Hero Images', icon: Images },
  { id: 'gallery', label: 'Gallery Images', icon: Images },
  { id: 'social', label: 'Social Media', icon: FileText },
  // { id: 'fix', label: 'FIX Page', icon: LinkIcon },
  // { id: 'fix-applications', label: 'FIX Applications', icon: ClipboardList },
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
    router.push(s === 'overview' ? '/admin' : `/admin?section=${s}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventManagement />;
      case 'content':
        return <ContentManagement />;
      case 'hero':
        return <HeroManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'social':
        return <SocialPostManagement />;
      case 'fix':
        return <FixManagement mode="content" />;
      case 'fix-applications':
        return <FixManagement mode="applications" />;
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
