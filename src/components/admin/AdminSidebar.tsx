import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface AdminSection {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface AdminSidebarProps {
  sections: AdminSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function AdminSidebar({ sections, activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <div className="w-full lg:w-64 bg-card border-b lg:border-b-0 lg:border-r border-border lg:min-h-screen">
      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 break-words">Admin Panel</h2>

        <nav className="space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-16 lg:pb-0 -mx-2 lg:mx-0 px-2 lg:px-0">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <Button
                key={section.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-auto lg:w-full justify-start min-h-[44px] flex-shrink-0 lg:flex-shrink",
                  isActive && "bg-accent text-accent-foreground"
                )}
                onClick={() => onSectionChange(section.id)}
              >
                <Icon className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="flex-1 text-left text-xs sm:text-sm whitespace-nowrap">{section.label}</span>
                {section.badge && (
                  <Badge variant="secondary" className="ml-auto flex-shrink-0">
                    {section.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
