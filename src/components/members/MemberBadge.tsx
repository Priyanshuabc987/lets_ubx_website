// import { Badge } from '@/components/ui/badge';
// import { Users, Mic, Handshake, Calendar } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export type BadgeType = 'member' | 'participant' | 'speaker' | 'partner';

// interface MemberBadgeProps {
//   type: BadgeType;
//   className?: string;
// }

// const badgeConfig: Record<BadgeType, { label: string; icon: React.ComponentType<{ className?: string }>; variant: 'verified' | 'participant' | 'speaker' | 'partner' }> = {
//   member: {
//     label: 'CEDAT Community Member',
//     icon: Users,
//     variant: 'verified',
//   },
//   participant: {
//     label: 'Event Participant',
//     icon: Calendar,
//     variant: 'participant',
//   },
//   speaker: {
//     label: 'Speaker / Partner',
//     icon: Mic,
//     variant: 'speaker',
//   },
//   partner: {
//     label: 'Institutional Partner',
//     icon: Handshake,
//     variant: 'partner',
//   },
// };

// export function MemberBadge({ type, className }: MemberBadgeProps) {
//   const config = badgeConfig[type];
//   const Icon = config.icon;

//   return (
//     <Badge variant={config.variant} className={cn("gap-1.5", className)}>
//       <Icon className="w-3 h-3" />
//       {config.label}
//     </Badge>
//   );
// }

