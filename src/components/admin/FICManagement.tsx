import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventForm, eventSchema, type EventFormData } from '@/components/admin/EventManagement';
import { useFICEvent, useCreateEvent, useUpdateEvent, useDeleteEvent, useUploadEventImage } from '@/hooks/useEvents';
import { useAdminEventRegistrations } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function FICManagement() {
  const queryClient = useQueryClient();
  const { data: ficEvent, isLoading, error } = useFICEvent();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const uploadImage = useUploadEventImage();
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
  const [pendingImages, setPendingImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'draft',
      is_featured: true,
      category: 'FIC',
      theme: '',
    },
  });

  // When opening for edit, populate form with existing FIC event
  useEffect(() => {
    if (isDialogOpen && isEditing && ficEvent) {
      reset({
        title: ficEvent.title,
        description: ficEvent.description || '',
        event_date: ficEvent.event_date?.slice(0, 16) || '',
        location: ficEvent.location || '',
        is_featured: ficEvent.is_featured ?? true,
        category: ficEvent.category || 'FIC',
        theme: ficEvent.theme || '',
        status: (ficEvent.status as 'draft' | 'published' | 'cancelled') ?? 'draft',
        featured_image_url: ficEvent.featured_image_url || '',
        external_registration_url: ficEvent.external_registration_url || '',
      });
    } else if (isDialogOpen && !isEditing) {
      // New FIC event
      reset({
        title: '',
        description: '',
        event_date: '',
        location: '',
        is_featured: true,
        category: 'FIC',
        theme: '',
        status: 'draft',
        featured_image_url: '',
        external_registration_url: '',
      });
    }
  }, [isDialogOpen, isEditing, ficEvent, reset]);

  const handleDeleteFICEvent = async () => {
    if (!ficEvent?.id) return;
    if (!confirm('Are you sure you want to delete the FIC event? This cannot be undone.')) return;
    try {
      await deleteEvent.mutateAsync(ficEvent.id);
      queryClient.invalidateQueries({ queryKey: ['fic-event'] });
      toast({ title: 'FIC event deleted' });
    } catch {
      toast({ title: 'Failed to delete FIC event', variant: 'destructive' });
    }
  };

  const handleCreateOrUpdate = async (data: EventFormData) => {
    const payload: any = {
      title: data.title,
      description: data.description || undefined,
      event_date: data.event_date,
      location: data.location || undefined,
      is_featured: data.is_featured ?? true,
      category: 'FIC',
      theme: data.theme || undefined,
      status: data.status,
      external_registration_url:
        data.external_registration_url && data.external_registration_url.trim()
          ? data.external_registration_url.trim()
          : undefined,
    };

    // If a featured image URL is given and URL mode is selected, include it
    if (imageInputType === 'url' && data.featured_image_url && data.featured_image_url.trim()) {
      payload.featured_image_url = data.featured_image_url.trim();
    } else if (imageInputType === 'url') {
      // Explicitly clear if URL mode but empty
      payload.featured_image_url = null;
    }

    try {
      let targetEventId: string;

      if (ficEvent && isEditing) {
        const updated = await updateEvent.mutateAsync({ eventId: ficEvent.id, eventData: payload });
        targetEventId = updated.id ?? ficEvent.id;
        toast({ title: 'FIC event updated' });
      } else {
        const created = await createEvent.mutateAsync(payload);
        targetEventId = created.id;
        toast({ title: 'FIC event created' });
      }

      // Handle file uploads when in upload mode
      if (imageInputType === 'upload' && pendingImages.length > 0 && targetEventId) {
        let firstImageUrl: string | null = null;
        for (let i = 0; i < pendingImages.length; i++) {
          const res = await uploadImage.mutateAsync({ eventId: targetEventId, file: pendingImages[i] });
          if (i === 0) firstImageUrl = res.image_url;
        }
        // If no featured image URL was set, use first uploaded image as featured
        if (!payload.featured_image_url && firstImageUrl) {
          await updateEvent.mutateAsync({ eventId: targetEventId, eventData: { featured_image_url: firstImageUrl } });
        }
      }
      setIsDialogOpen(false);
      setIsEditing(false);
      setPendingImages([]);
      queryClient.invalidateQueries({ queryKey: ['fic-event'] });
    } catch (e) {
      console.error('Failed to save FIC event', e);
      toast({ title: 'Error', description: 'Failed to save FIC event.', variant: 'destructive' });
    }
  };

  const regs = useAdminEventRegistrations(ficEvent?.id || '');
  const regItems: any[] = regs.data?.items || [];
  const stats = regs.data?.statistics;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold break-words">FIC Event</h2>
          <p className="text-muted-foreground">
            Manage the single flagship FIC event and view its registrations.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setIsEditing(false); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(!!ficEvent)}>
              {ficEvent ? (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit FIC Event
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create FIC Event
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>{ficEvent && isEditing ? 'Edit FIC Event' : 'Create FIC Event'}</DialogTitle>
            </DialogHeader>
            <EventForm
              onSubmit={handleSubmit(handleCreateOrUpdate, (err) => {
                const messages = Object.entries(err).map(([, v]) => (v as { message?: string })?.message).filter(Boolean);
                toast({ title: 'Please fix form errors', description: messages.length ? messages.join('. ') : 'Check the fields and try again.', variant: 'destructive' });
              })}
              onCancel={() => { setIsDialogOpen(false); setIsEditing(false); setPendingImages([]); }}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              isSubmitting={createEvent.isPending || updateEvent.isPending}
              showImageUpload
              pendingImages={pendingImages}
              onPendingImagesChange={setPendingImages}
              imageInputType={imageInputType}
              onImageInputTypeChange={setImageInputType}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : ficEvent ? (
        <>
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-left space-y-1">
                <CardTitle className="text-xl sm:text-2xl break-words">{ficEvent.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {format(new Date(ficEvent.event_date), 'PPP p')}
                  </span>
                  {ficEvent.location && (
                    <>
                      <span>•</span>
                      <span className="break-words">{ficEvent.location}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Category: {ficEvent.category || 'FIC'}</Badge>
                <Badge variant={ficEvent.status === 'published' ? 'default' : ficEvent.status === 'draft' ? 'secondary' : 'destructive'}>
                  {ficEvent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ficEvent.description && (
                <p className="text-sm text-muted-foreground max-w-3xl whitespace-pre-line">
                  {ficEvent.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[40px]"
                  onClick={() => { setIsEditing(true); setIsDialogOpen(true); }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit event
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="min-h-[40px]"
                  onClick={handleDeleteFICEvent}
                  disabled={deleteEvent.isPending}
                >
                  {deleteEvent.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete event
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-left">
                  <CardTitle>FIC Registrations</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {stats?.total_registered ?? regItems.length} · Attended: {stats?.total_attended ?? 0} · Pending approval: {stats?.total_pending ?? 0}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {regs.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : regItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No registrations yet for the FIC event.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground align-top">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Company</th>
                        <th className="py-2 pr-4">Registered</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Registration Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regItems.map((r: any) => {
                        const meta = (r.registration_metadata || {}) as any;
                        const networking =
                          meta.fic_networking_interest === true
                            ? 'Yes'
                            : meta.fic_networking_interest === false
                            ? 'No'
                            : '—';
                        const pitch =
                          meta.fic_pitch_interest === true
                            ? 'Yes'
                            : meta.fic_pitch_interest === false
                            ? 'No'
                            : '—';
                        return (
                          <tr key={r.id} className="border-b last:border-0 align-top">
                            <td className="py-2 pr-4 break-words">{r.member?.full_name ?? '—'}</td>
                            <td className="py-2 pr-4 break-words">{r.member?.email ?? '—'}</td>
                            <td className="py-2 pr-4 break-words">{r.member?.company_name ?? '—'}</td>
                            <td className="py-2 pr-4">
                              {r.registration_date ? format(new Date(r.registration_date), 'PP') : '—'}
                            </td>
                            <td className="py-2 pr-4">
                              <Badge variant={r.attendance_status === 'attended' ? 'default' : 'secondary'}>
                                {r.attendance_status === 'pending_approval'
                                  ? 'Pending approval'
                                  : r.attendance_status ?? '—'}
                              </Badge>
                            </td>
                            <td className="py-2 pr-4">
                              <div className="space-y-1 text-xs text-muted-foreground max-w-xl">
                                <div>
                                  <span className="font-semibold text-foreground">Networking:</span>{' '}
                                  {networking}
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground">Pitch:</span> {pitch}
                                </div>
                                {r.member?.about_yourself && (
                                  <div className="pt-1">
                                    <span className="font-semibold text-foreground">About:</span>{' '}
                                    <span className="whitespace-pre-line">
                                      {String(r.member.about_yourself).slice(0, 220)}
                                      {String(r.member.about_yourself).length > 220 ? '…' : ''}
                                    </span>
                                  </div>
                                )}
                                {r.member?.building_description && (
                                  <div className="pt-1">
                                    <span className="font-semibold text-foreground">Startup / Project:</span>{' '}
                                    <span className="whitespace-pre-line">
                                      {String(r.member.building_description).slice(0, 220)}
                                      {String(r.member.building_description).length > 220 ? '…' : ''}
                                    </span>
                                  </div>
                                )}
                                {r.member?.startup_support_needs && (
                                  <div className="pt-1">
                                    <span className="font-semibold text-foreground">Support needed:</span>{' '}
                                    <span className="whitespace-pre-line">
                                      {String(r.member.startup_support_needs).slice(0, 220)}
                                      {String(r.member.startup_support_needs).length > 220 ? '…' : ''}
                                    </span>
                                  </div>
                                )}
                                {r.member?.experiences_interests_skills && (
                                  <div className="pt-1">
                                    <span className="font-semibold text-foreground">Skills & experience:</span>{' '}
                                    <span className="whitespace-pre-line">
                                      {String(r.member.experiences_interests_skills).slice(0, 220)}
                                      {String(r.member.experiences_interests_skills).length > 220 ? '…' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No FIC event configured yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click &quot;Create FIC Event&quot; above to add your flagship FIC event. Once created and published,
              it will appear on the public FIC page and registrations will show here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

