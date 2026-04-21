// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Save, Edit } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useMutation } from '@tanstack/react-query';
// import { membersAPI } from '@/lib/api';
// import { queryClient } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';

// const questionsSchema = z.object({
//   about_yourself: z.string()
//     .min(1, 'Please write about yourself')
//     .refine((val) => {
//       const trimmed = val.trim();
//       if (!trimmed) return false;
//       const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
//       return wordCount >= 100 && wordCount <= 300;
//     }, 'Please write between 100 to 300 words'),
//   building_description: z.string()
//     .min(1, 'Please share about your startup, project or services')
//     .refine((val) => {
//       const trimmed = val.trim();
//       if (!trimmed) return false;
//       const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
//       return wordCount >= 100 && wordCount <= 300;
//     }, 'Please write between 100 to 300 words'),
//   startup_support_needs: z.string()
//     .min(1, 'Please describe the support or resources you need')
//     .refine((val) => {
//       const trimmed = val.trim();
//       if (!trimmed) return false;
//       const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
//       return wordCount >= 100 && wordCount <= 300;
//     }, 'Please write between 100 to 300 words'),
//   experiences_interests_skills: z.string()
//     .min(1, 'Please share your skills, interests and experiences')
//     .refine((val) => {
//       const trimmed = val.trim();
//       if (!trimmed) return false;
//       const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
//       return wordCount >= 100 && wordCount <= 300;
//     }, 'Please write between 100 to 300 words'),
// });

// type QuestionsFormData = z.infer<typeof questionsSchema>;

// export function ProfileQuestionsEdit() {
//   const { user, refreshUser } = useAuth();
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<QuestionsFormData>({
//     resolver: zodResolver(questionsSchema),
//     defaultValues: user ? {
//       about_yourself: user.about_yourself || '',
//       building_description: user.building_description || '',
//       startup_support_needs: user.startup_support_needs || '',
//       experiences_interests_skills: user.experiences_interests_skills || '',
//     } : {},
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: async (data: QuestionsFormData) => {
//       const response = await membersAPI.updateProfile(data);
//       return await response.json();
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries({ queryKey: ['current-user'] });
//       await refreshUser();
//       setIsEditing(false);
//       toast({
//         title: "Profile Updated",
//         description: "Your profile questions have been successfully updated.",
//       });
//     },
//     onError: (error: any) => {
//       console.error('Profile update failed:', error);
//       toast({
//         title: "Update Failed",
//         description: error?.message || "Failed to update profile. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = async (data: QuestionsFormData) => {
//     try {
//       await updateProfileMutation.mutateAsync(data);
//     } catch (error) {
//       // Error handled by onError
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     // Reset form with current user data
//     reset({
//       about_yourself: user?.about_yourself || '',
//       building_description: user?.building_description || '',
//       startup_support_needs: user?.startup_support_needs || '',
//       experiences_interests_skills: user?.experiences_interests_skills || '',
//     });
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     reset();
//   };

//   if (!user) return null;

//   return (
//     <Card className="mt-6 sm:mt-8">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-xl sm:text-2xl">Your Profile</CardTitle>
//           {!isEditing && (
//             <Button onClick={handleEdit} variant="outline" size="sm">
//               <Edit className="w-4 h-4 mr-2" />
//               Edit
//             </Button>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
//           {/* Question 1 */}
//           <div className="space-y-2">
//             <Label htmlFor="about_yourself" className="text-sm font-semibold">
//               1. Write about Yourself (In 100 to 300 Words) *
//             </Label>
//             {isEditing ? (
//               <>
//                 <Textarea
//                   id="about_yourself"
//                   placeholder="Tell us about yourself, your background, interests, and what drives you..."
//                   {...register('about_yourself')}
//                   rows={6}
//                   className={`resize-y ${errors.about_yourself ? 'border-destructive' : ''}`}
//                 />
//                 <div className="flex justify-between items-center">
//                   <p className="text-xs text-muted-foreground">
//                     {watch('about_yourself')
//                       ? `${watch('about_yourself').trim().split(/\s+/).filter(w => w.length > 0).length} words`
//                       : '100 to 300 words'}
//                   </p>
//                   {errors.about_yourself && (
//                     <p className="text-xs text-destructive">{errors.about_yourself.message}</p>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-md border bg-muted/40 p-3 sm:p-4 min-h-[80px] whitespace-pre-line text-sm">
//                 {user.about_yourself && user.about_yourself.trim()
//                   ? user.about_yourself
//                   : 'Not answered yet.'}
//               </div>
//             )}
//           </div>

//           {/* Question 2 */}
//           <div className="space-y-2">
//             <Label htmlFor="building_description" className="text-sm font-semibold">
//               2. Kindly Share about your startup, project or services (In 100 to 300 Words) *
//             </Label>
//             {isEditing ? (
//               <>
//                 <Textarea
//                   id="building_description"
//                   placeholder="Share details about your startup, project, or services..."
//                   {...register('building_description')}
//                   rows={6}
//                   className={`resize-y ${errors.building_description ? 'border-destructive' : ''}`}
//                 />
//                 <div className="flex justify-between items-center">
//                   <p className="text-xs text-muted-foreground">
//                     {watch('building_description')
//                       ? `${watch('building_description').trim().split(/\s+/).filter(w => w.length > 0).length} words`
//                       : '100 to 300 words'}
//                   </p>
//                   {errors.building_description && (
//                     <p className="text-xs text-destructive">{errors.building_description.message}</p>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-md border bg-muted/40 p-3 sm:p-4 min-h-[80px] whitespace-pre-line text-sm">
//                 {user.building_description && user.building_description.trim()
//                   ? user.building_description
//                   : 'Not answered yet.'}
//               </div>
//             )}
//           </div>

//           {/* Question 3 */}
//           <div className="space-y-2">
//             <Label htmlFor="startup_support_needs" className="text-sm font-semibold">
//               3. What kind of support or resources do you need for your startup, project or services (In 100 to 300 Words) *
//             </Label>
//             {isEditing ? (
//               <>
//                 <Textarea
//                   id="startup_support_needs"
//                   placeholder="Describe the support or resources you need..."
//                   {...register('startup_support_needs')}
//                   rows={6}
//                   className={`resize-y ${errors.startup_support_needs ? 'border-destructive' : ''}`}
//                 />
//                 <div className="flex justify-between items-center">
//                   <p className="text-xs text-muted-foreground">
//                     {watch('startup_support_needs')
//                       ? `${watch('startup_support_needs').trim().split(/\s+/).filter(w => w.length > 0).length} words`
//                       : '100 to 300 words'}
//                   </p>
//                   {errors.startup_support_needs && (
//                     <p className="text-xs text-destructive">{errors.startup_support_needs.message}</p>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-md border bg-muted/40 p-3 sm:p-4 min-h-[80px] whitespace-pre-line text-sm">
//                 {user.startup_support_needs && user.startup_support_needs.trim()
//                   ? user.startup_support_needs
//                   : 'Not answered yet.'}
//               </div>
//             )}
//           </div>

//           {/* Question 4 */}
//           <div className="space-y-2">
//             <Label htmlFor="experiences_interests_skills" className="text-sm font-semibold">
//               4. Is there anything else you would like us to know about your skills, interests & experiences (In 100 to 300 Words) *
//             </Label>
//             {isEditing ? (
//               <>
//                 <Textarea
//                   id="experiences_interests_skills"
//                   placeholder="Share your skills, interests, and experiences..."
//                   {...register('experiences_interests_skills')}
//                   rows={6}
//                   className={`resize-y ${errors.experiences_interests_skills ? 'border-destructive' : ''}`}
//                 />
//                 <div className="flex justify-between items-center">
//                   <p className="text-xs text-muted-foreground">
//                     {watch('experiences_interests_skills')
//                       ? `${watch('experiences_interests_skills').trim().split(/\s+/).filter(w => w.length > 0).length} words`
//                       : '100 to 300 words'}
//                   </p>
//                   {errors.experiences_interests_skills && (
//                     <p className="text-xs text-destructive">{errors.experiences_interests_skills.message}</p>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-md border bg-muted/40 p-3 sm:p-4 min-h-[80px] whitespace-pre-line text-sm">
//                 {user.experiences_interests_skills && user.experiences_interests_skills.trim()
//                   ? user.experiences_interests_skills
//                   : 'Not answered yet.'}
//               </div>
//             )}
//           </div>

//           {isEditing && (
//             <div className="flex gap-3 sm:gap-4 pt-4">
//               <Button
//                 type="submit"
//                 disabled={updateProfileMutation.isPending}
//                 className="flex-1 min-h-[44px]"
//                 size="lg"
//               >
//                 {updateProfileMutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="mr-2 h-4 w-4" />
//                     Save Changes
//                   </>
//                 )}
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={updateProfileMutation.isPending}
//                 className="min-h-[44px]"
//                 size="lg"
//               >
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
