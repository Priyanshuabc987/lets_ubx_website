
// "use client";

// import { useParams } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// import { publicAPI } from '@/lib/api';
// import { PublicProfileView } from '@/components/members/PublicProfileView';
// import { ProfileQuestionsEdit } from '@/components/members/ProfileQuestionsEdit';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';

// export default function ProfilePage() {
//   const { slug } = useParams() as { slug: string };
//   const { user, isAuthenticated } = useAuth();

//   const { data: profile, isLoading } = useQuery({
//     queryKey: ['public-profile', slug],
//     queryFn: async () => {
//       const response = await publicAPI.getPublicProfile(slug);
//       return await response.json();
//     },
//     enabled: !!slug,
//   });

//   const isOwnProfile = isAuthenticated && user?.profile_slug === slug;

//   if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>;

//   return (
//     <div className="min-h-screen bg-background pt-32 pb-20">
//       <div className="container mx-auto px-4 sm:px-6">
//         <Link href="/">
//           <Button variant="ghost" size="sm" className="mb-8"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
//         </Link>

//         {profile ? (
//           <div className="space-y-12">
//             <PublicProfileView profile={profile} />
//             {isOwnProfile && <ProfileQuestionsEdit />}
//           </div>
//         ) : (
//           <div className="text-center py-20 text-muted-foreground">Profile not found.</div>
//         )}
//       </div>
//     </div>
//   );
// }

export default function Dummy() { return null; }
