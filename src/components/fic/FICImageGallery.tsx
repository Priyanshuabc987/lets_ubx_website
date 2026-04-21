
"use client";

import Image from 'next/image';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";

const FIC_IMAGES = [
    "/fic/20260207_150909.jpg.jpeg",
    "/fic/20260207_151713.jpg.jpeg",
    "/fic/20260207_152526.jpg.jpeg",
    "/fic/20260207_164904.jpg.jpeg",
    "/fic/20260207_180647.jpg.jpeg",
    "/fic/DSC01975.jpg.jpeg",
    "/fic/DSC01987.jpg.jpeg",
    "/fic/DSC01989.jpg.jpeg",
    "/fic/DSC01993.jpg.jpeg",
    "/fic/DSC01998.jpg.jpeg",
    "/fic/DSC02009.jpg.jpeg",
    "/fic/DSC02015.jpg.jpeg",
    "/fic/DSC02038.jpg.jpeg",
    "/fic/DSC02052.jpg.jpeg",
    "/fic/DSC02060.jpg.jpeg",
    "/fic/DSC02067.jpg.jpeg",
    "/fic/IMG_4758.jpg.jpeg",
    "/fic/IMG_4790.jpg.jpeg",
    "/fic/IMG_4809.jpg.jpeg",
    "/fic/IMG_4814.jpg.jpeg"
];

export function FICImageGallery() {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {FIC_IMAGES.map((src, index) => (
                <Dialog key={index}>
                    <DialogTrigger asChild>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            className="relative w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-1rem)] md:w-[calc(25%-1rem)]  aspect-[4/3] rounded-xl overflow-hidden border border-border/50 group cursor-pointer shadow-md"
                        >
                            <Image
                                src={src}
                                alt={`FIC Event Image ${index + 1}`}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border-2 border-white/50">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    </DialogTrigger>

                    <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center">
                        <DialogTitle className="sr-only">Enlarged Event Image</DialogTitle>
                        <DialogDescription className="sr-only">An enlarged view of image {index + 1}</DialogDescription>

                        {/* This wrapper ensures the 'fill' image has a boundary to expand into */}
                        <div className="relative w-full h-full">
                            <Image
                                src={src}
                                alt={`Enlarged FIC Event Image ${index + 1}`}
                                fill
                                priority // Use priority for the enlarged image for faster loading
                                sizes="95vw"
                                className="object-contain" // Keeps aspect ratio without cropping
                            />
                        </div>

                        {/* Adjusted Close Button */}
                        <DialogClose className="absolute top-4 right-4 z-50 text-white bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/70 transition-all focus:outline-none ring-1 ring-white/20">
                            <X className="w-5 h-5" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </DialogContent>

                </Dialog>
            ))}
        </div>
    );
}
