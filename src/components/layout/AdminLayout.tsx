
import { Navbar } from '@/components/layout/Navbar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { type LucideIcon } from 'lucide-react'; // 1. IMPORT THE LUCIDEICON TYPE

export interface AdminSection {
  id: string;
  label: string;
  icon: LucideIcon; // 2. USE THE SPECIFIC TYPE
}

interface AdminLayoutProps {
  sections: AdminSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  children: React.ReactNode;
}

export function AdminLayout({ sections, activeSection, onSectionChange, children }: AdminLayoutProps) {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 sm:pt-24">
          <div className="flex flex-col lg:flex-row">
            <AdminSidebar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
