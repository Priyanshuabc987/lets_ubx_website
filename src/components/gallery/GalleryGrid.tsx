
"use client";

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { GalleryItem } from "@/lib/types";
import { Video as VideoIcon, X, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 ">
        <p className="text-lg font-semibold">No Items to Display</p>
        <p className="text-muted-foreground">This category is currently empty. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 space-y-6">
      {items.map((item, index) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="break-inside-avoid aspect-[4/3] relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-muted"
            >
              <ImageWithFallback
                src={item.url}
                fallbackSrc="/placeholder-image.png"
                alt={item.caption || 'Gallery item'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.type === 'video' ? (
                  <VideoIcon className="w-12 h-12 text-white" />
                ) : (
                  <ZoomIn className="w-12 h-12 text-white" />
                )}
              </div>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] h-full w-full bg-transparent border-none p-0 shadow-none">
            <DialogTitle className="sr-only">{item.caption || (item.type === 'photo' ? 'Enlarged image' : 'Video playback')}</DialogTitle>
            <div className="relative aspect-video h-full w-full bg-black/90 rounded-lg overflow-hidden flex items-center justify-center">
              {item.type === 'photo' ? (
                <ImageWithFallback
                  src={item.url}
                  alt={item.caption || 'Enlarged gallery view'}
                  fill
                  className="object-contain rounded-md"
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
            <DialogClose className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
