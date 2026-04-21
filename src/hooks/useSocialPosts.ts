
"use client"; // 1. MARK AS A CLIENT COMPONENT

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useFirestore } from "@/firebase/index"; // 2. IMPORT THE CLIENT-SIDE HOOK
import { revalidateSocialPosts } from "@/lib/actions/revalidate";

export interface SocialPost {
  id: string;
  post_url: string;
  platform: "instagram" | "linkedin" | "youtube";
  created_at: string;
  priority: number;
}

export interface SocialPostsByPlatform {
  linkedin: SocialPost[];
  instagram: SocialPost[];
  youtube: SocialPost[];
}

// --- DATA FETCHING HOOK (for Admin Panel) ---
export function useSocialPosts() {
  const db = useFirestore(); // 3. USE THE HOOK TO GET THE DB INSTANCE
  const socialPostsCollection = collection(db, "social_posts");

  return useQuery<SocialPostsByPlatform>({
    queryKey: ["social-posts"],
    queryFn: async () => {
      const linkedinQuery = query(
        socialPostsCollection,
        where("platform", "==", "linkedin"),
        orderBy("priority")
      );
      const instagramQuery = query(
        socialPostsCollection,
        where("platform", "==", "instagram"),
        orderBy("priority")
      );
      const youtubeQuery = query(
        socialPostsCollection,
        where("platform", "==", "youtube"),
        orderBy("priority")
      );

      const [linkedinSnapshot, instagramSnapshot, youtubeSnapshot] = await Promise.all([
        getDocs(linkedinQuery),
        getDocs(instagramQuery),
        getDocs(youtubeQuery),
      ]);

      const linkedinPosts = linkedinSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
      );
      const instagramPosts = instagramSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
      );
      const youtubePosts = youtubeSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SocialPost)
      );

      return { linkedin: linkedinPosts, instagram: instagramPosts, youtube: youtubePosts };
    },
  });
}

// --- MUTATIONS ---

export function useAddSocialPost() {
  const queryClient = useQueryClient();
  const db = useFirestore(); // 3. USE THE HOOK

  return useMutation({
    mutationFn: async (newPost: { post_url: string; platform: "instagram" | "linkedin" | "youtube"; }) => {
      const socialPostsCollection = collection(db, "social_posts");
      const platformQuery = query(socialPostsCollection, where("platform", "==", newPost.platform));
      const snapshot = await getDocs(platformQuery);
      const newPriority = snapshot.size + 1;

      return await addDoc(socialPostsCollection, {
        ...newPost,
        created_at: new Date().toISOString(),
        priority: newPriority,
      });
    },
    onSuccess: async () => {
      await revalidateSocialPosts();
      await queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
  });
}

export function useUpdateSocialPost() {
    const queryClient = useQueryClient();
    const db = useFirestore(); // 3. USE THE HOOK

    return useMutation({
        mutationFn: async (variables: { id: string; post_url: string }) => {
            const postDoc = doc(db, "social_posts", variables.id);
            await updateDoc(postDoc, { post_url: variables.post_url });
        },
        onSuccess: async () => {
            await revalidateSocialPosts();
            await queryClient.invalidateQueries({ queryKey: ["social-posts"] });
        },
    });
}

export function useDeleteSocialPost() {
    const queryClient = useQueryClient();
    const db = useFirestore(); // 3. USE THE HOOK

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteDoc(doc(db, "social_posts", id));
        },
        onSuccess: async () => {
            await revalidateSocialPosts();
            await queryClient.invalidateQueries({ queryKey: ["social-posts"] });
        },
    });
}

export function useUpdateSocialPostOrder() {
  const queryClient = useQueryClient();
  const db = useFirestore(); // 3. USE THE HOOK

  return useMutation({
    mutationFn: async (variables: { postIds: string[]; platform: "instagram" | "linkedin" | "youtube"; }) => {
      const batch = writeBatch(db);
      variables.postIds.forEach((id, index) => {
        const docRef = doc(db, "social_posts", id);
        batch.update(docRef, { priority: index + 1 });
      });
      await batch.commit();
    },
    onSuccess: async (_data, variables) => {
      await revalidateSocialPosts();
      await queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      
      queryClient.setQueryData<SocialPostsByPlatform>(['social-posts'], (oldData) => {
          if (!oldData) return { linkedin: [], instagram: [], youtube: [] };
          const reorderedPosts = variables.postIds.map(id => 
              [...oldData.linkedin, ...oldData.instagram, ...oldData.youtube].find(p => p.id === id)
          ).filter((p): p is SocialPost => !!p);
          
          return {
              ...oldData,
              [variables.platform]: reorderedPosts
          };
      });
    },
  });
}
