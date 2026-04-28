
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { GalleryItem } from "@/lib/types";
import { ArrowLeft, ArrowRight, Video as VideoIcon, X, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPreviousItem = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const showNextItem = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousItem();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextItem();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 ">
        <p className="text-lg font-semibold">No Items to Display</p>
        <p className="text-muted-foreground">This category is currently empty. Check back soon!</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 space-y-6">
        {items.map((item, index) => (
          <DialogTrigger key={item.id} asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="break-inside-avoid aspect-[4/3] relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-muted"
              onClick={() => setCurrentIndex(index)}
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
        ))}
      </div>

      <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center">
        <DialogTitle className="sr-only">
          {currentItem?.caption || (currentItem?.type === "photo" ? "Enlarged image" : "Video playback")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {currentItem ? `An enlarged view of item ${currentIndex + 1}` : "An enlarged gallery view"}
        </DialogDescription>

        {items.length > 1 && (
          <button
            type="button"
            onClick={showPreviousItem}
            className="absolute left-3 sm:left-6 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition hover:bg-black/70 focus:outline-none ring-1 ring-white/20"
            aria-label="Show previous item"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative h-full w-full px-14 sm:px-20">
          {currentItem?.type === "photo" ? (
            <ImageWithFallback
              src={currentItem.url}
              alt={currentItem.caption || "Enlarged gallery view"}
              fill
              className="object-contain"
            />
          ) : currentItem ? (
            <div className="flex h-full w-full items-center justify-center">
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : null}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={showNextItem}
            className="absolute right-3 sm:right-6 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition hover:bg-black/70 focus:outline-none ring-1 ring-white/20"
            aria-label="Show next item"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}

        <DialogClose className="absolute top-4 right-4 z-50 text-white bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/70 transition-all focus:outline-none ring-1 ring-white/20">
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
