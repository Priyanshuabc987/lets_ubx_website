
"use client";

import { useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { HeroItem } from '@/lib/types';
import { revalidateHeroImages } from '@/lib/actions/revalidate';

// Hook to fetch all hero images, ordered by their display_order
export function useHeroImages() {
  const db = useFirestore();
  const heroRef = collection(db, 'hero');

  return useQuery<HeroItem[]>({ 
    queryKey: ['heroImages'],
    queryFn: async () => {
      const q = query(heroRef, orderBy('display_order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as HeroItem[];
    },
  });
}

// Hook to upload a new hero image
export function useUploadHeroImage() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async (file: File) => {
            const heroRef = collection(db, 'hero');
            const snapshot = await getDocs(heroRef);
            const currentCount = snapshot.size;
            const imageUrl = await uploadToCloudinary(file);

            await addDoc(heroRef, {
                url: imageUrl,
                display_order: currentCount + 1,
                createdAt: serverTimestamp(),
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['heroImages'] });
            await revalidateHeroImages();
        },
    });
}

// Hook to delete a hero image
export function useDeleteHeroImage() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async ({ id, url }: { id: string, url: string }) => {
            // Note: Add logic here to delete from Cloudinary if needed
            await deleteDoc(doc(db, 'hero', id));
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['heroImages'] });
            await revalidateHeroImages();
        },
    });
}

// Hook to update the display order of all hero images
export function useUpdateHeroOrder() {
    const queryClient = useQueryClient();
    const db = useFirestore();

    return useMutation({
        mutationFn: async (orderedIds: string[]) => {
            const batch = writeBatch(db);
            orderedIds.forEach((id, index) => {
                const docRef = doc(db, 'hero', id);
                batch.update(docRef, { display_order: index + 1 });
            });
            await batch.commit();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['heroImages'] });
            await revalidateHeroImages();
        },
    });
}
