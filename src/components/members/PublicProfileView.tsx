// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { ExternalLink, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
// import { MemberBadge } from './MemberBadge';
// import { getImageUrl } from '@/lib/images';
// import { getCommunityRoleCardStyles } from '@/lib/communityRoleStyles';

// interface PublicProfile {
//   id: string;
//   full_name: string;
//   linkedin_url: string;
//   community_role: string;
//   functional_role?: string | null;
//   company_name?: string | null;
//   designation?: string | null;
//   profile_slug: string;
//   profile_photo_url?: string | null;
//   created_at: string;
// }

// interface PublicProfileViewProps {
//   profile: PublicProfile;
// }

// export function PublicProfileView({ profile }: PublicProfileViewProps) {
//   const memberSinceYear = profile.created_at
//     ? new Date(profile.created_at).getFullYear()
//     : null;
//   const roleStyles = getCommunityRoleCardStyles(profile.community_role);

//   return (
//     <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 px-4 sm:px-6 md:px-8">
//       {/* Profile Header - Role-based card styling */}
//       <Card className={`overflow-hidden rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group border-2 ${roleStyles.card}`}>
//         <div className="p-6 sm:p-8 md:p-10 lg:p-12">
//           {/* Zone 1: Avatar + Name + Badge */}
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
//             <div className="relative flex-shrink-0">
//               {profile.profile_photo_url ? (
//                 <img
//                   src={getImageUrl(profile.profile_photo_url)}
//                   alt={profile.full_name}
//                   className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-2 ${roleStyles.avatarBorder} shadow-lg`}
//                 />
//               ) : (
//                 <div className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${roleStyles.avatarBg} flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-white shadow-lg border-2 ${roleStyles.avatarBorder}`}>
//                   {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 min-w-0 space-y-2">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground break-words">
//                   {profile.full_name}
//                 </h1>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <div className="flex-shrink-0">
//                         <MemberBadge type="member" className={`flex-shrink-0 ${roleStyles.badge} border ${roleStyles.badgeBorder} px-3 py-1 rounded-full text-xs font-medium`} />
//                       </div>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p className="flex items-center gap-2">
//                         <CheckCircle2 className="w-4 h-4" />
//                         Verified CEDAT Community Member
//                       </p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>
//             </div>
//           </div>

//           {/* Zone 2: Role + Company + Tags */}
//           <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
//             <div className="space-y-1">
//               <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-muted-foreground break-words">
//                 {profile.designation && profile.company_name
//                   ? `${profile.designation} at ${profile.company_name}`
//                   : profile.designation || profile.company_name || 'CEDAT Community Member'}
//               </p>
//               {memberSinceYear && (
//                 <p className="text-xs text-muted-foreground/70">
//                   Member since {memberSinceYear}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <Badge className={`${roleStyles.badge} border ${roleStyles.badgeBorder} px-3 py-1 rounded-full text-xs font-medium`}>
//                 {profile.community_role}
//               </Badge>
//               {profile.functional_role && (
//                 <Badge variant="outline" className="bg-transparent text-muted-foreground border-muted-foreground/30 px-3 py-1 rounded-full text-xs font-medium">
//                   {profile.functional_role}
//                 </Badge>
//               )}
//             </div>

//             <p className="text-xs text-muted-foreground/60 italic">
//               This is a public CEDAT member profile
//             </p>
//           </div>

//           {/* Zone 3: LinkedIn CTA */}
//           <div className="pt-4 sm:pt-6 border-t border-muted-foreground/20">
//             <a
//               href={profile.linkedin_url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-transparent border ${roleStyles.ctaBorder} rounded-lg ${roleStyles.ctaText} text-sm font-semibold ${roleStyles.ctaHover} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[44px]`}
//             >
//               <LinkIcon className="w-4 h-4 flex-shrink-0" />
//               <span className="hidden sm:inline">View Verified LinkedIn Profile</span>
//               <span className="sm:hidden">LinkedIn Profile</span>
//               <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
//             </a>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
