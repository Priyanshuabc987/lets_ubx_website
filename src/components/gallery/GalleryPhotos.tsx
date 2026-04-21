
"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Image as ImageIcon, Video as VideoIcon, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { motion } from 'framer-motion';
import { GalleryItem } from '@/lib/types'; // Assuming GalleryItem is defined in types

// The component now accepts items as a prop
export function GalleryPhotos({ items }: { items: GalleryItem[] }) {
  const [activeTab, setActiveTab] = useState('all');

  const sortedItems = items?.slice().sort((a, b) => a.display_order - b.display_order);

  const filteredItems = sortedItems?.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6 sm:mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="photo"><ImageIcon className="w-4 h-4 mr-2"/>Photos</TabsTrigger>
                <TabsTrigger value="video"><VideoIcon className="w-4 h-4 mr-2"/>Videos</TabsTrigger>
            </TabsList>
        </Tabs>

        {filteredItems && filteredItems.length > 0 ? (
             <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredItems.map((item, index) => (
                    <Dialog key={item.id}>
                        <DialogTrigger asChild>
                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.03, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-muted"
                            >
                                <ImageWithFallback 
                                    src={item.url} 
                                    alt={item.caption || 'Gallery item'}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {item.type === 'video' ? 
                                        <VideoIcon className="w-12 h-12 text-white"/> :
                                        <ZoomIn className="w-12 h-12 text-white"/>
                                    }
                                </div>
                            </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none">
                             <div className="relative w-full bg-black/90 rounded-lg overflow-hidden flex items-center justify-center p-2">
                                {item.type === 'photo' ? (
                                    <ImageWithFallback 
                                        src={item.url}
                                        alt={item.caption || 'Enlarged gallery view'}
                                        className="max-h-[90vh] w-auto object-contain rounded-md"
                                    />
                                ) : (
                                    <video 
                                        src={item.url} 
                                        controls 
                                        autoPlay 
                                        className="max-h-[90vh] w-auto object-contain rounded-md"
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold">No items to display</p>
                <p className="text-muted-foreground">There are no {activeTab !== 'all' ? activeTab + 's' : 'items'} in the gallery yet.</p>
            </div>
        )}
    </div>
  );
}
