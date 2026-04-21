"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { EventManagement } from '@/components/admin/EventManagement';
import { Card, CardContent } from '@/components/ui/card';
import { generateSEO, seoConfigs } from '@/lib/seo';
import { Calendar, Images, FileText } from 'lucide-react';
import { GalleryManagement } from '@/components/admin/GalleryManagement';
// import { FICManagement } from '@/components/admin/FICManagement';
import { HeroManagement } from '@/components/admin/HeroManagement';
// import { ContentManagement } from '@/components/admin/ContentManagement';
import { SocialPostManagement } from '@/components/admin/SocialPostManagement';

export const adminSections = [
  // { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'events', label: 'Events', icon: Calendar },
  // { id: 'fic', label: 'FIC', icon: Star },
  // { id: 'content', label: 'Page Content', icon: FileText },
  { id: 'hero', label: 'Hero Images', icon: Images },
  { id: 'gallery', label: 'Gallery Images', icon: Images },
  { id: 'social', label: 'Social Media', icon: FileText },
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');

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
      case 'overview':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 break-words">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground break-words">Manage CEDAT events, members, and registrations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow min-h-[44px]" onClick={() => onSectionChange('events')}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto mb-3 sm:mb-4" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Manage Events</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Create, edit, and publish events</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'events':
        return <EventManagement />;
      // case 'fic':
      //   return <FICManagement />;
      // case 'content':
      //   return <ContentManagement />;
      case 'hero':
        return <HeroManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'social':
        return <SocialPostManagement />;
      default:
        return <div>Section not found</div>;
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
