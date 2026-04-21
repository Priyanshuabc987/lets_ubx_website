
"use client";

import { useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { GalleryItem } from '@/lib/types';
import { revalidateGalleryPhotos, revalidateGalleryVideos } from '@/lib/actions/revalidate';

// Type for the mutation input, which can be a photo file or a video URL
type AddGalleryItemInput =
  | { type: 'photo'; file: File }
  | { type: 'video'; url: string };

// Hook to fetch all gallery items, ordered by their display_order
export function useGalleryImages() {
  const db = useFirestore();
  const galleryRef = collection(db, 'gallery');

  return useQuery<GalleryItem[]>({ 
    queryKey: ['galleryImages'],
    queryFn: async () => {
      const q = query(galleryRef, orderBy('display_order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryItem[];
    },
  });
}

// Hook to add a new gallery item (photo or video)
export function useAddGalleryItem() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async (input: AddGalleryItemInput) => {
            const galleryRef = collection(db, 'gallery');
            const snapshot = await getDocs(galleryRef);
            const currentCount = snapshot.size;

            let itemUrl: string;
            if (input.type === 'photo') {
                itemUrl = await uploadToCloudinary(input.file);
            } else { // type is 'video'
                itemUrl = input.url;
            }

            await addDoc(galleryRef, {
                url: itemUrl,
                type: input.type,
                display_order: currentCount + 1,
                createdAt: serverTimestamp(),
            });
            return input.type; // Return the type for the onSuccess callback
        },
        onSuccess: async (type) => {
            // Invalidate the admin panel's cache
            await queryClient.invalidateQueries({ queryKey: ['galleryImages'] });

            // Revalidate the public-facing gallery page cache
            if (type === 'photo') {
                await revalidateGalleryPhotos();
            } else {
                await revalidateGalleryVideos();
            }
        },
    });
}

// Hook to delete a gallery image
export function useDeleteGalleryImage() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async ({ id, url, type }: { id: string, url: string, type: 'photo' | 'video' }) => {
            // Note: Add logic here to delete from Cloudinary if needed
            await deleteDoc(doc(db, 'gallery', id));
            return type;
        },
        onSuccess: async (type) => {
            await queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            if (type === 'photo') {
                await revalidateGalleryPhotos();
            } else {
                await revalidateGalleryVideos();
            }
        },
    });
}

// Hook to update the display order of all gallery items
export function useUpdateGalleryOrder() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async (orderedIds: string[]) => {
            const batch = writeBatch(db);
            orderedIds.forEach((id, index) => {
                const docRef = doc(db, 'gallery', id);
                batch.update(docRef, { display_order: index + 1 });
            });
            await batch.commit();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
            await Promise.all([
                revalidateGalleryPhotos(),
                revalidateGalleryVideos(),
            ]);
        },
    });
}
