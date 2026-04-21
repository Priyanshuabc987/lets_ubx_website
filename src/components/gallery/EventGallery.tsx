
// "use client";

// import { useQuery } from '@tanstack/react-query';
// import { motion } from "framer-motion";
// import { useState } from "react";
// import Link from "next/link";
// import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, ZoomIn, Filter, Calendar, MapPin } from "lucide-react";
// import { eventsAPI } from '@/lib/api';
// import { format } from 'date-fns';
// import { ImageWithFallback } from '@/components/ui/image-with-fallback';

// interface GalleryImage {
//   id: string;
//   image_url: string;
//   caption?: string;
//   event_title?: string;
//   event_date?: string;
//   event_location?: string;
// }

// export function EventGallery() {
//   const [selectedEvent, setSelectedEvent] = useState<string>('all');

//   const { data: events, isLoading: eventsLoading, error: eventsError } = useQuery({
//     queryKey: ['events-gallery'],
//     queryFn: async () => {
//       try {
//         const firstResponse = await eventsAPI.listEvents({ page_size: 1000 });
//         if (!firstResponse.ok) {
//           return { items: [], total: 0 };
//         }
//         const firstData = await firstResponse.json();
//         return firstData;
//       } catch (error) {
//         console.error('Error fetching events for gallery:', error);
//         return { items: [], total: 0 };
//       }
//     },
//     retry: 1,
//     staleTime: 30000,
//   });

//   const allImages: GalleryImage[] = [];
//   const eventsByYear: Record<number, any[]> = {};
  
//   if (events && events.items && Array.isArray(events.items)) {
//     events.items.forEach((event: any) => {
//       if (!event || !event.event_date) return;
      
//       const eventDate = new Date(event.event_date);
//       if (isNaN(eventDate.getTime())) return;
      
//       const eventYear = eventDate.getFullYear();
//       if (!eventsByYear[eventYear]) eventsByYear[eventYear] = [];
//       eventsByYear[eventYear].push(event);
      
//       if (event.images && Array.isArray(event.images)) {
//         event.images.forEach((image: any) => {
//           if (image && image.image_url) {
//             allImages.push({
//               id: image.id,
//               image_url: image.image_url,
//               caption: image.caption,
//               event_title: event.title,
//               event_date: event.event_date,
//               event_location: event.location,
//             });
//           }
//         });
//       }
//     });
//   }

//   const sortedYears = Object.keys(eventsByYear).map(Number).sort((a, b) => b - a);
//   const filteredImages = selectedEvent === 'all' ? allImages : allImages.filter(img => img.event_title === selectedEvent);
//   const eventNames = Array.from(new Set(allImages.map(img => img.event_title).filter(Boolean)));

//   if (eventsLoading) {
//     return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
//   }

//   return (
//     <div className="container mx-auto px-6">
//       {eventNames.length > 0 && (
//         <div className="flex items-center justify-center mb-12">
//           <div className="flex items-center gap-4">
//             <Filter className="w-4 h-4 text-muted-foreground" />
//             <Select value={selectedEvent} onValueChange={setSelectedEvent}>
//               <SelectTrigger className="w-64">
//                 <SelectValue placeholder="Filter by event" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Events</SelectItem>
//                 {eventNames.map((name) => <SelectItem key={name} value={name!}>{name}</SelectItem>)}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       )}

//       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
//         {filteredImages.map((image, index) => (
//           <Dialog key={image.id || index}>
//             <DialogTrigger asChild>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.05 }}
//                 className="break-inside-avoid relative group cursor-zoom-in rounded-2xl overflow-hidden bg-muted"
//               >
//                 <ImageWithFallback src={image.image_url} alt={image.caption || "Event photo"} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
//                 <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent text-white">
//                   <p className="text-sm font-medium">{image.event_title}</p>
//                   <p className="text-xs opacity-80">{format(new Date(image.event_date!), 'PPP')}</p>
//                 </div>
//               </motion.div>
//             </DialogTrigger>
//             <DialogContent className="max-w-5xl bg-black/90 border-none p-0">
//               <ImageWithFallback src={image.image_url} alt={image.caption || "Event photo"} className="max-h-[85vh] w-auto mx-auto object-contain" />
//             </DialogContent>
//           </Dialog>
//         ))}
//       </div>
//     </div>
//   );
// }
