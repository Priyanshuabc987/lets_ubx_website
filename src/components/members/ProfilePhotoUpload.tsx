// import { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Loader2, Upload, X, Camera } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useMutation } from '@tanstack/react-query';
// import { membersAPI } from '@/lib/api';
// import { queryClient } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';
// import { getImageUrl } from '@/lib/images';

// export function ProfilePhotoUpload() {
//   const { user, refreshUser } = useAuth();
//   const { toast } = useToast();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const uploadMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const response = await membersAPI.uploadProfilePhoto(file);
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Failed to upload photo');
//       }
//       return await response.json();
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries({ queryKey: ['current-user'] });
//       await refreshUser();
//       setPreview(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       toast({
//         title: "Photo Uploaded",
//         description: "Your profile photo has been updated successfully.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Upload Failed",
//         description: error?.message || "Failed to upload photo. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async () => {
//       const response = await membersAPI.deleteProfilePhoto();
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Failed to delete photo');
//       }
//       return await response.json();
//     },
//     onSuccess: async () => {
//       queryClient.invalidateQueries({ queryKey: ['current-user'] });
//       await refreshUser();
//       toast({
//         title: "Photo Removed",
//         description: "Your profile photo has been removed.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Delete Failed",
//         description: error?.message || "Failed to delete photo. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       toast({
//         title: "Invalid File",
//         description: "Please select an image file.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Validate file size (10MB)
//     if (file.size > 10 * 1024 * 1024) {
//       toast({
//         title: "File Too Large",
//         description: "Please select an image smaller than 10MB.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleUpload = () => {
//     const file = fileInputRef.current?.files?.[0];
//     if (!file) return;
//     uploadMutation.mutate(file);
//   };

//   const handleRemove = () => {
//     if (confirm('Are you sure you want to remove your profile photo?')) {
//       deleteMutation.mutate();
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   if (!user) return null;

//   const displayImage = preview || (user.profile_photo_url ? getImageUrl(user.profile_photo_url) : null);

//   return (
//     <Card>
//       <CardHeader className="p-4 sm:p-6">
//         <CardTitle className="text-base sm:text-lg">Profile Photo</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4 p-4 sm:p-6">
//         {/* Current Photo / Avatar */}
//         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
//           <div className="relative flex-shrink-0">
//             {displayImage ? (
//               <img
//                 src={displayImage}
//                 alt={user.full_name}
//                 className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-accent/30 shadow-lg"
//               />
//             ) : (
//               <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-xl sm:text-2xl font-extrabold text-accent-foreground border-2 border-accent/30 shadow-lg">
//                 {getInitials(user.full_name)}
//               </div>
//             )}
//           </div>

//           <div className="flex-1 space-y-3 sm:space-y-2 w-full sm:w-auto">
//             <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
//               {user.profile_photo_url
//                 ? 'Your profile photo is visible on your public profile.'
//                 : 'Upload a photo to personalize your profile. It will be visible on your public profile.'}
//             </p>
//             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 id="profile-photo-upload"
//               />
//               <label htmlFor="profile-photo-upload" className="w-full sm:w-auto">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   asChild
//                   disabled={uploadMutation.isPending}
//                   className="w-full sm:w-auto min-h-[44px]"
//                 >
//                   <span>
//                     <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
//                     {user.profile_photo_url ? 'Change Photo' : 'Upload Photo'}
//                   </span>
//                 </Button>
//               </label>
//               {user.profile_photo_url && (
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   onClick={handleRemove}
//                   disabled={deleteMutation.isPending}
//                   className="w-full sm:w-auto min-h-[44px]"
//                 >
//                   {deleteMutation.isPending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
//                       Removing...
//                     </>
//                   ) : (
//                     <>
//                       <X className="w-4 h-4 mr-2 flex-shrink-0" />
//                       Remove
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Preview and Upload Button */}
//         {preview && (
//           <div className="space-y-3 sm:space-y-2 p-3 sm:p-4 bg-muted rounded-lg border">
//             <p className="text-xs sm:text-sm font-medium">Preview</p>
//             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-accent/30 flex-shrink-0"
//               />
//               <div className="flex-1 w-full sm:w-auto">
//                 <p className="text-xs text-muted-foreground mb-2 text-center sm:text-left">
//                   This is how your photo will appear. Click "Confirm Upload" to save.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={handleUpload}
//                     disabled={uploadMutation.isPending}
//                     className="w-full sm:w-auto min-h-[44px]"
//                   >
//                     {uploadMutation.isPending ? (
//                       <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <Camera className="w-4 h-4 mr-2 flex-shrink-0" />
//                         Confirm Upload
//                       </>
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setPreview(null);
//                       if (fileInputRef.current) {
//                         fileInputRef.current.value = '';
//                       }
//                     }}
//                     disabled={uploadMutation.isPending}
//                     className="w-full sm:w-auto min-h-[44px]"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Upload Guidelines */}
//         <div className="text-xs text-muted-foreground space-y-1">
//           <p>• Maximum file size: 10MB</p>
//           <p>• Supported formats: JPG, PNG, GIF, WEBP</p>
//           <p>• Photo will be resized to 400x400 pixels</p>
//           <p>• Your photo will be visible on your public profile</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

