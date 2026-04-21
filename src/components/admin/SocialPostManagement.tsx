
"use client";

import { useState, useEffect } from 'react';
import { useSocialPosts, useAddSocialPost, useDeleteSocialPost, useUpdateSocialPostOrder, SocialPost } from "@/hooks/useSocialPosts";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Delete, Plus, ExternalLink, Loader2, ChevronsUpDown, ArrowRight, X } from 'lucide-react';
import { Reorder } from "framer-motion"

function ReorderablePostList({ 
    platform, 
    posts, 
    onDelete, 
    onUpdateOrder 
}: {
    platform: 'linkedin' | 'instagram' | 'youtube';
    posts: SocialPost[];
    onDelete: (id: string) => void;
    onUpdateOrder: (platform: 'linkedin' | 'instagram' | 'youtube', ids: string[]) => void;
}) {
    const [localPosts, setLocalPosts] = useState(posts);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const handleSaveOrder = async () => {
        setIsSaving(true);
        const postIds = localPosts.map(p => p.id);
        await onUpdateOrder(platform, postIds);
        setIsSaving(false);
    };

    const handleCancelOrder = () => {
        setLocalPosts(posts);
    };

    const originalOrder = JSON.stringify(posts.map(p => p.id));
    const currentOrder = JSON.stringify(localPosts.map(p => p.id));
    const hasOrderChanged = originalOrder !== currentOrder;

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg capitalize">{platform} Posts</CardTitle>
                {hasOrderChanged && (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancelOrder} disabled={isSaving}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveOrder} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <ChevronsUpDown className="w-4 h-4 mr-2"/>}
                            Save Order
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {localPosts.length > 0 ? (
                    <Reorder.Group axis="y" values={localPosts} onReorder={setLocalPosts}>
                        <div className="space-y-3">
                            {localPosts.map((post, index) => {
                                const originalPost = posts.find(p => p.id === post.id);
                                const originalPriority = originalPost ? originalPost.priority : 'N/A';
                                const newPriority = index + 1;
                                const hasChanged = originalPriority !== newPriority;

                                return (
                                    <Reorder.Item key={post.id} value={post}>
                                        <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50 cursor-grab active:cursor-grabbing">
                                            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                                                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold">
                                                    {originalPriority}
                                                 </span>
                                                {hasChanged && <ArrowRight className="w-4 h-4 text-primary" />}
                                                <span className={hasChanged ? 'text-primary font-bold' : ''}>{newPriority}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm break-all text-muted-foreground line-clamp-1">{post.post_url}</p>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button variant="outline" size="sm" asChild><a href={post.post_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a></Button>
                                                <Button variant="destructive" size="sm" onClick={() => onDelete(post.id)}><Delete className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                );
                            })}
                        </div>
                    </Reorder.Group>
                ) : (
                     <p className="text-center py-8 text-muted-foreground">No {platform} posts yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function SocialPostManagement() {
    const { toast } = useToast();
    const { data, isLoading } = useSocialPosts();
    const addMutation = useAddSocialPost();
    const deleteMutation = useDeleteSocialPost();
    const updateOrderMutation = useUpdateSocialPostOrder();

    const [postUrl, setPostUrl] = useState('');
    const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'youtube'>('instagram');

    const handleAddPost = async () => {
        if (!postUrl.trim()) {
            toast({ title: 'Error', description: 'Post URL cannot be empty.', variant: 'destructive' });
            return;
        }
        try {
            await addMutation.mutateAsync({ post_url: postUrl, platform });
            toast({ title: 'Success', description: 'Social post added.' });
            setPostUrl('');
        } catch (e) {
            toast({ title: 'Error', description: 'Failed to add post.', variant: 'destructive' });
        }
    };

    const handleDeletePost = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteMutation.mutateAsync(id);
                toast({ title: 'Success', description: 'Social post deleted.' });
            } catch (e) {
                toast({ title: 'Error', description: 'Failed to delete post.', variant: 'destructive' });
            }
        }
    };

    const handleUpdateOrder = async (platform: 'linkedin' | 'instagram' | 'youtube', postIds: string[]) => {
        try {
            await updateOrderMutation.mutateAsync({ platform, postIds });
            toast({ title: 'Success', description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} order updated!` });
        } catch (e) {
            toast({ title: 'Error', description: 'Failed to update order.', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-display font-bold">Social Media Posts</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Add and reorder posts for the home page social feed.</p>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg">Add New Post</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Platform</label>
                        <Select value={platform} onValueChange={(v) => setPlatform(v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="instagram">Instagram</SelectItem><SelectItem value="linkedin">LinkedIn</SelectItem><SelectItem value="youtube">YouTube</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Post URL</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input placeholder="Paste the full post URL" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} className="flex-1"/>
                            <Button onClick={handleAddPost} disabled={addMutation.isPending} className="w-full sm:w-auto">
                                {addMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Plus className="w-4 h-4 mr-2"/>} Add Post
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto"/></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReorderablePostList 
                        platform="linkedin"
                        posts={data?.linkedin || []}
                        onDelete={handleDeletePost}
                        onUpdateOrder={handleUpdateOrder}
                    />
                    <ReorderablePostList 
                        platform="instagram"
                        posts={data?.instagram || []}
                        onDelete={handleDeletePost}
                        onUpdateOrder={handleUpdateOrder}
                    />
                     <ReorderablePostList 
                        platform="youtube"
                        posts={data?.youtube || []}
                        onDelete={handleDeletePost}
                        onUpdateOrder={handleUpdateOrder}
                    />
                </div>
            )}
        </div>
    );
}
