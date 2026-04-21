// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Save, Lock } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useMutation } from '@tanstack/react-query';
// import { membersAPI } from '@/lib/api';
// import { queryClient } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';

// const profileSchema = z.object({
//   full_name: z.string().min(2, 'Full name must be at least 2 characters'),
//   linkedin_url: z.string().url('Please enter a valid LinkedIn URL').refine(
//     (url) => url.includes('linkedin.com'),
//     'Please enter a valid LinkedIn URL'
//   ),
//   community_role: z.string().min(1, 'Please select a community role'),
//   functional_role: z.string().min(1, 'Please select a functional role'),
//   company_name: z.string().min(1, 'Company name is required'),
//   designation: z.string().min(1, 'Designation is required'),
//   phone: z.string().min(1, 'Phone number is required'),
//   about_company: z.string().optional(),
//   building_description: z.string().optional(),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;

// const communityRoles = [
//   { value: 'Investor', label: 'Investor' },
//   { value: 'Startup Founder', label: 'Startup Founder' },
//   { value: 'Institution', label: 'Institution' },
//   { value: 'Government', label: 'Government' },
//   { value: 'Ecosystem Enabler', label: 'Ecosystem Enabler' },
//   { value: 'Aspiring Entrepreneur', label: 'Aspiring Entrepreneur' },
//   { value: 'Student', label: 'Student' },
// ];

// const functionalRoles = [
//   { value: 'Tech', label: 'Tech' },
//   { value: 'Marketing', label: 'Marketing' },
//   { value: 'Sales', label: 'Sales' },
//   { value: 'Operations', label: 'Operations' },
//   { value: 'Product', label: 'Product' },
//   { value: 'Strategy', label: 'Strategy' },
//   { value: 'Legal', label: 'Legal' },
//   { value: 'Finance', label: 'Finance' },
//   { value: 'Research', label: 'Research' },
//   { value: 'Other', label: 'Other' },
// ];

// export function ProfileForm() {
//   const { user, refreshUser } = useAuth();
//   const { toast } = useToast();

//   const {
//     register: registerField,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: user ? {
//       full_name: user.full_name,
//       linkedin_url: user.linkedin_url,
//       community_role: user.community_role,
//       functional_role: user.functional_role,
//       company_name: user.company_name,
//       designation: user.designation,
//       phone: user.phone || '',
//       about_company: user.about_company || '',
//       building_description: user.building_description || '',
//     } : {},
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: async (data: ProfileFormData) => {
//       const response = await membersAPI.updateProfile(data);
//       return await response.json();
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries({ queryKey: ['current-user'] });
//       // Refresh user data in useAuth hook
//       await refreshUser();
//       toast({
//         title: "Profile Updated",
//         description: "Your profile has been successfully updated.",
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

//   const onSubmit = async (data: ProfileFormData) => {
//     try {
//       await updateProfileMutation.mutateAsync(data);
//     } catch (error) {
//       // Error handled by onError
//     }
//   };

//   if (!user) return null;

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
//       {/* Basic Information */}
//       <div className="space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="full_name" className="text-sm">Full Name *</Label>
//             <Input
//               id="full_name"
//               placeholder="John Doe"
//               {...registerField('full_name')}
//               className={`min-h-[44px] ${errors.full_name ? 'border-destructive' : ''}`}
//             />
//             {errors.full_name && (
//               <p className="text-xs sm:text-sm text-destructive">{errors.full_name.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="linkedin_url" className="text-sm">LinkedIn Profile URL *</Label>
//             <Input
//               id="linkedin_url"
//               placeholder="https://linkedin.com/in/yourprofile"
//               {...registerField('linkedin_url')}
//               className={`min-h-[44px] ${errors.linkedin_url ? 'border-destructive' : ''}`}
//             />
//             {errors.linkedin_url && (
//               <p className="text-xs sm:text-sm text-destructive">{errors.linkedin_url.message}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Community Role */}
//       <div className="space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-lg font-semibold">Community Role</h3>

//         <div className="space-y-2">
//           <Label className="text-sm">What describes you best in the startup ecosystem? *</Label>
//           <Select
//             value={watch('community_role')}
//             onValueChange={(value) => setValue('community_role', value)}
//           >
//             <SelectTrigger className={`min-h-[44px] ${errors.community_role ? 'border-destructive' : ''}`}>
//               <SelectValue placeholder="Select your community role" />
//             </SelectTrigger>
//             <SelectContent>
//               {communityRoles.map((role) => (
//                 <SelectItem key={role.value} value={role.value}>
//                   {role.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.community_role && (
//             <p className="text-sm text-destructive">{errors.community_role.message}</p>
//           )}
//         </div>
//       </div>

//       {/* Functional Role */}
//       <div className="space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-lg font-semibold">Functional Expertise</h3>

//         <div className="space-y-2">
//           <Label className="text-sm">What is your primary functional expertise? *</Label>
//           <Select
//             value={watch('functional_role')}
//             onValueChange={(value) => setValue('functional_role', value)}
//           >
//             <SelectTrigger className={`min-h-[44px] ${errors.functional_role ? 'border-destructive' : ''}`}>
//               <SelectValue placeholder="Select your functional role" />
//             </SelectTrigger>
//             <SelectContent>
//               {functionalRoles.map((role) => (
//                 <SelectItem key={role.value} value={role.value}>
//                   {role.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.functional_role && (
//             <p className="text-sm text-destructive">{errors.functional_role.message}</p>
//           )}
//         </div>
//       </div>

//       {/* Organization */}
//       <div className="space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-lg font-semibold">Organization</h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="company_name" className="text-sm">Company / Institution Name *</Label>
//             <Input
//               id="company_name"
//               placeholder="TechCorp Inc."
//               {...registerField('company_name')}
//               className={`min-h-[44px] ${errors.company_name ? 'border-destructive' : ''}`}
//             />
//             {errors.company_name && (
//               <p className="text-xs sm:text-sm text-destructive">{errors.company_name.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="designation" className="text-sm">Your Designation / Role *</Label>
//             <Input
//               id="designation"
//               placeholder="CEO, Product Manager, etc."
//               {...registerField('designation')}
//               className={`min-h-[44px] ${errors.designation ? 'border-destructive' : ''}`}
//             />
//             {errors.designation && (
//               <p className="text-xs sm:text-sm text-destructive">{errors.designation.message}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Optional Fields */}
//       <div className="space-y-3 sm:space-y-4">
//         <h3 className="text-base sm:text-lg font-semibold">Additional Information (Optional)</h3>

//         <div className="space-y-2">
//           <div className="flex flex-wrap items-center gap-2">
//             <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
//             <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
//             <span className="text-xs text-muted-foreground">Visible only to you</span>
//           </div>
//           <Input
//             id="phone"
//             placeholder="+91 98765 43210"
//             {...registerField('phone')}
//             className={`min-h-[44px] bg-muted/50 ${errors.phone ? 'border-destructive' : ''}`}
//           />
//           {errors.phone && (
//             <p className="text-xs sm:text-sm text-destructive">{errors.phone.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <div className="flex flex-wrap items-center gap-2">
//             <Label htmlFor="about_company" className="text-sm">About Your Company / Institution</Label>
//             <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
//             <span className="text-xs text-muted-foreground">Visible only to you</span>
//           </div>
//           <Textarea
//             id="about_company"
//             placeholder="Tell us about your organization..."
//             {...registerField('about_company')}
//             rows={3}
//             className="bg-muted/50 min-h-[100px]"
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex flex-wrap items-center gap-2">
//             <Label htmlFor="building_description" className="text-sm">What are you building?</Label>
//             <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
//             <span className="text-xs text-muted-foreground">Visible only to you</span>
//           </div>
//           <Textarea
//             id="building_description"
//             placeholder="Describe your current projects, products, or initiatives..."
//             {...registerField('building_description')}
//             rows={3}
//             className="bg-muted/50"
//           />
//         </div>
//       </div>

//       {/* Note about public profile */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <h4 className="font-medium text-blue-900 mb-2">Public Profile Note</h4>
//         <p className="text-sm text-blue-800">
//           Your name, company, designation, community role, functional role, and LinkedIn profile will be visible on your public profile page.
//           Private information like phone number and company details will only be visible to you and CEDAT administrators.
//         </p>
//       </div>

//       {updateProfileMutation.error && (
//         <Alert variant="destructive">
//           <AlertDescription>
//             {updateProfileMutation.error.message || 'Failed to update profile. Please try again.'}
//           </AlertDescription>
//         </Alert>
//       )}

//       <Button
//         type="submit"
//         disabled={updateProfileMutation.isPending}
//         className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6"
//         size="lg"
//       >
//         {updateProfileMutation.isPending ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Updating Profile...
//           </>
//         ) : (
//           <>
//             <Save className="mr-2 h-4 w-4" />
//             Update Profile
//           </>
//         )}
//       </Button>
//     </form>
//   );
// }
