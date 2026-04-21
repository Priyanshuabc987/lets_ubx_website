
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm, UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Event, useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import Image from 'next/image';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'Event date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']),
  featured_image_url: z.string().url().optional().or(z.literal('')),
  external_registration_url: z.string().url().optional().or(z.literal('')),
});

export type EventFormData = z.infer<typeof eventSchema>;

export function EventManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
  const { toast } = useToast();

  const { events, isLoading, loadMore, hasMore, isLoadingMore } = useEvents({ pageSize: 25 });
  
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { status: 'draft' },
  });

  useEffect(() => {
    const body = document.body;
    const originalPaddingRight = body.style.paddingRight;
    const originalOverflow = body.style.overflow;

    if (isDialogOpen) {
      const scrollbarWidth = window.innerWidth - body.clientWidth;
      body.style.paddingRight = `${scrollbarWidth}px`;
      body.style.overflow = 'hidden';
    } else {
      body.style.paddingRight = originalPaddingRight;
      body.style.overflow = originalOverflow;
    }

    return () => {
      body.style.paddingRight = originalPaddingRight;
      body.style.overflow = originalOverflow;
    };
  }, [isDialogOpen]);

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setValue('featured_image_url', '');
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const payload = {
        eventData: data,
        imageFile: imageInputType === 'upload' ? imageFile : null,
      };

      if (editingEvent) {
        await updateEvent.mutateAsync({ eventId: editingEvent.id, ...payload });
        toast({ title: 'Event Updated' });
      } else {
        await createEvent.mutateAsync(payload);
        toast({ title: 'Event Created' });
      }
      closeDialog();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({ title: 'Error', description: 'Failed to save event.', variant: 'destructive' });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent.mutateAsync(eventId);
      toast({ title: 'Event Deleted' });
    }
  };

  const openForCreate = () => {
    reset({ status: 'draft', title: '', featured_image_url: '', start_time: '18:00', end_time: '20:00' });
    setEditingEvent(null);
    setImageFile(null);
    setImageInputType('upload');
    setIsDialogOpen(true);
  };

  const openForEdit = (event: Event) => {
    setEditingEvent(event);
    reset({
      ...event,
      event_date: format(parseISO(event.event_date), "yyyy-MM-dd"),
      start_time: event.start_time || '',
      end_time: event.end_time || '',
    });
    setImageFile(null);
    // FIX: Always default the image input to 'upload' mode
    setImageInputType('upload');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingEvent(null);
    setImageFile(null);
    reset();
  };
  
  const getStatusBadgeVariant = (status: string) => {
    return status === 'published' ? 'default' : status === 'cancelled' ? 'destructive' : 'secondary';
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={openForCreate}><Plus className="w-4 h-4 mr-2" /> Create Event</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Events</CardTitle></CardHeader>
        <CardContent>
          {(isLoading && events.length === 0) ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{format(parseISO(event.event_date), 'PPP')}</TableCell>
                      <TableCell>{event.location || 'N/A'}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(event.status)}>{event.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openForEdit(event)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => loadMore()} disabled={isLoadingMore}>
                    {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleSubmit(onSubmit)}
            onCancel={closeDialog}
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            isSubmitting={createEvent.isPending || updateEvent.isPending}
            imageFile={imageFile}
            onImageFileChange={handleImageFileChange}
            existingImageUrl={editingEvent?.featured_image_url}
            imageInputType={imageInputType}
            onImageInputTypeChange={setImageInputType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EventFormProps {
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  register: UseFormRegister<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
  watch: UseFormWatch<EventFormData>;
  errors: FieldErrors<EventFormData>;
  isSubmitting: boolean;
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  existingImageUrl?: string | null;
  imageInputType: 'upload' | 'url';
  onImageInputTypeChange: (type: 'upload' | 'url') => void;
}

export function EventForm({ onSubmit, onCancel, register, setValue, watch, errors, isSubmitting, imageFile, onImageFileChange, existingImageUrl, imageInputType, onImageInputTypeChange }: EventFormProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageTypeChange = (type: 'upload' | 'url') => {
    onImageInputTypeChange(type);
    if (type === 'upload') setValue('featured_image_url', '');
    else onImageFileChange(null);
  };

  const handleUploadButtonClick = () => {
    handleImageTypeChange('upload');
    setTimeout(() => fileInputRef.current?.click(), 0);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register('category')} placeholder="e.g., Workshop, Meetup" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label htmlFor="event_date">Event Date *</Label>
            <Input id="event_date" type="date" {...register('event_date')} />
            {errors.event_date && <p className="text-sm text-destructive">{errors.event_date.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="start_time">Start Time *</Label>
            <Input id="start_time" type="time" {...register('start_time')} />
            {errors.start_time && <p className="text-sm text-destructive">{errors.start_time.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="end_time">End Time *</Label>
            <Input id="end_time" type="time" {...register('end_time')} />
            {errors.end_time && <p className="text-sm text-destructive">{errors.end_time.message}</p>}
        </div>
      </div>

      <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" {...register('location')} placeholder="e.g., Online, Conference Hall A" /></div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...register('description')} rows={3} /></div>

      <div className="space-y-3">
        <Label>Featured Image</Label>
        <div className="flex gap-2">
          <Button type="button" variant={imageInputType === 'upload' ? 'default' : 'outline'} size="sm" onClick={handleUploadButtonClick}><Upload className="w-4 h-4 mr-2"/>Upload</Button>
          <Button type="button" variant={imageInputType === 'url' ? 'default' : 'outline'} size="sm" onClick={() => handleImageTypeChange('url')}><LinkIcon className="w-4 h-4 mr-2"/>URL</Button>
        </div>
        {imageInputType === 'upload' ? (
          <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={(e) => onImageFileChange(e.target.files ? e.target.files[0] : null)} ref={fileInputRef} className="hidden" />
            {(imageFile || existingImageUrl) && <div className="w-24 h-24 mt-2 relative"><Image src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl!} alt="Preview" layout="fill" className="rounded-md object-cover" /></div>}
            {imageFile && <p className="text-sm text-muted-foreground">File: {imageFile.name}</p>}
          </div>
        ) : (
          <div className="space-y-2">
            <Input id="featured_image_url" type="url" {...register('featured_image_url')} placeholder="https://example.com/image.jpg" />
            {errors.featured_image_url && <p className="text-sm text-destructive">{errors.featured_image_url.message}</p>}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="external_registration_url">External Registration URL</Label>
        <Input id="external_registration_url" type="url" {...register('external_registration_url')} placeholder="https://your.event.link" />
        {errors.external_registration_url && <p className="text-sm text-destructive">{errors.external_registration_url.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
      </div>
    </form>
  );
}
