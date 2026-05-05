
"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFixSettings, useUpdateFixSettings } from '@/hooks/useFixSettings';
import { FixRegistrationStatus, useFixRegistrations, useUpdateFixRegistrationStatus, useUpdateFixRegistration } from '@/hooks/useFixRegistrations';
import { useAdminFixRegistrations } from '@/hooks/useAdminFixRegistrations';
import {
  DEFAULT_FIX_ABOUT_TEXT,
  DEFAULT_FIX_SIDEBAR_POINTS,
  DEFAULT_FIX_SIDEBAR_TITLE,
  DEFAULT_FIX_TITLE,
} from '@/lib/fix-content';
import { Textarea } from '@/components/ui/textarea';

const fixSettingsSchema = z.object({
  registration_link: z.string().trim().optional().refine((value) => !value || /^https?:\/\/.+/i.test(value), {
    message: 'Invalid URL format',
  }),
  title: z.string().trim().min(1, 'Title is required'),
  about: z.string().trim().min(1, 'About section is required'),
  sidebar_title: z.string().trim().min(1, 'Right-side title is required'),
  sidebar_points: z.string().trim().min(1, 'At least one bullet point is required'),
});

type FixSettingsFormData = z.infer<typeof fixSettingsSchema>;

const statusOptions: FixRegistrationStatus[] = ['pending', 'approved', 'rejected'];

const statusBadgeVariant = (status: FixRegistrationStatus) => {
  if (status === 'approved') return 'default';
  if (status === 'rejected') return 'destructive';
  return 'secondary';
};

interface FixManagementProps {
  mode?: 'content' | 'applications';
}

export function FixManagement({ mode = 'content' }: FixManagementProps) {
  const { toast } = useToast();
  const { data: fixSettings, isLoading: isLoadingSettings } = useFixSettings();
  const updateFixSettings = useUpdateFixSettings();
  const updateFixRegistrationStatus = useUpdateFixRegistrationStatus();
  const [statusFilter, setStatusFilter] = useState<FixRegistrationStatus | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  // monthFilter stores month as two-digit string '01'..'12' or 'all'
  const [monthFilter, setMonthFilter] = useState<string | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<number>(2026);
  const DEFAULT_YEAR = 2026;
  // appliedFilters are the filters currently applied to the list (updated when Search pressed)
  const [appliedFilters, setAppliedFilters] = useState<{
    status: FixRegistrationStatus | 'all';
    stage: string | 'all';
    month: string | 'all';
    year: number;
  }>({ status: 'all', stage: 'all', month: 'all', year: DEFAULT_YEAR });
  const { data: fixRegistrationsPublic, isLoading: isLoadingPublic } = useFixRegistrations(statusFilter, stageFilter);
  const { data: fixRegistrationsAdmin, isLoading: isLoadingAdmin } = useAdminFixRegistrations();
  const showContentSection = mode === 'content';
  const showApplicationsSection = mode === 'applications';
  const isLoadingRegistrations = showApplicationsSection ? isLoadingAdmin : isLoadingPublic;
  const fixRegistrations = showApplicationsSection ? (fixRegistrationsAdmin || []) : (fixRegistrationsPublic || []);

  // fixed preferred stages plus any dynamic stages discovered from data
  const preferredStages = ['Idea Stage', 'Early Stage', 'MVP Stage', 'Growth Stage', 'Revenue Stage'];
  const dynamicStages: string[] = (fixRegistrations || []).reduce((acc: string[], r: any) => {
    const s = r.startup_stage;
    if (s && !acc.includes(s) && !preferredStages.includes(s)) acc.push(s);
    return acc;
  }, [] as string[]);
  const stages = [...preferredStages, ...dynamicStages];
  const updateFixRegistration = useUpdateFixRegistration();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FixSettingsFormData>({
    resolver: zodResolver(fixSettingsSchema),
  });
  const lastSyncedValueRef = useRef<string>('');

  useEffect(() => {
    const nextFormValues = {
      registration_link: fixSettings.registration_link || '',
      title: fixSettings.title || DEFAULT_FIX_TITLE,
      about: fixSettings.about || DEFAULT_FIX_ABOUT_TEXT,
      sidebar_title: fixSettings.sidebar_title || DEFAULT_FIX_SIDEBAR_TITLE,
      sidebar_points: (fixSettings.sidebar_points || DEFAULT_FIX_SIDEBAR_POINTS).join('\n'),
    };
    const serialized = JSON.stringify(nextFormValues);

    if (serialized === lastSyncedValueRef.current || isDirty) return;

    reset(nextFormValues);
    lastSyncedValueRef.current = serialized;
  }, [fixSettings, isDirty, reset]);

  const onSubmit = async (data: FixSettingsFormData) => {
    try {
      const nextFormValues = {
        registration_link: data.registration_link,
        title: data.title,
        about: data.about,
        sidebar_title: data.sidebar_title,
        sidebar_points: data.sidebar_points.split('\n').map((item) => item.trim()).filter(Boolean),
      };

      await updateFixSettings.mutateAsync(nextFormValues);

      const syncedFormValues = {
        registration_link: nextFormValues.registration_link || '',
        title: nextFormValues.title || DEFAULT_FIX_TITLE,
        about: nextFormValues.about || DEFAULT_FIX_ABOUT_TEXT,
        sidebar_title: nextFormValues.sidebar_title || DEFAULT_FIX_SIDEBAR_TITLE,
        sidebar_points: nextFormValues.sidebar_points.join('\n'),
      };

      reset(syncedFormValues);
      lastSyncedValueRef.current = JSON.stringify(syncedFormValues);

      toast({
        title: 'Success',
        description: 'FIX page content updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update FIX settings:', error);
      toast({ title: 'Error', description: 'Failed to update FIX settings.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (registrationId: string, status: FixRegistrationStatus) => {
    try {
      await updateFixRegistrationStatus.mutateAsync({ registrationId, status });
      toast({ title: 'Status updated', description: `Application marked as ${status}.` });
    } catch (error) {
      console.error('Failed to update FIX registration status:', error);
      toast({ title: 'Error', description: 'Failed to update application status.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {showContentSection && (
        <>
          {/* <Card>
            <CardHeader>
              <CardTitle>Current FIX Content</CardTitle>
              <CardDescription>
                Review the current registration link and the public FIX page content stored in `settings/fix_settings`.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading current link...</span>
                </div>
              ) : fixSettings?.registration_link ? (
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={fixSettings.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline truncate"
                  >
                    {fixSettings.registration_link}
                  </Link>
                  <Button asChild variant="secondary" size="icon" className="flex-shrink-0">
                    <Link href={fixSettings.registration_link} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">Open link</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No external registration link is set. The internal FIX form is currently active on the public page.</p>
              )}
              <div className="mt-6 space-y-2 rounded-xl border border-border/60 p-4">
                <p className="text-sm font-semibold text-foreground">{fixSettings.title}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{fixSettings.about}</p>
                <p className="text-sm font-semibold text-foreground pt-2">{fixSettings.sidebar_title}</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {fixSettings.sidebar_points?.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>FIX Page Content</CardTitle>
              <CardDescription>
                Manage the left-side title/about section and the right-side title and bullet points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registration_link">External Registration Link</Label>
                  <Input
                    id="registration_link"
                    type="url"
                    {...register('registration_link')}
                    placeholder="Leave empty to use internal FIX form"
                  />
                  {errors.registration_link && <p className="text-sm text-destructive">{errors.registration_link.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fix_title">Left Section Title</Label>
                  <Input
                    id="fix_title"
                    type="text"
                    {...register('title')}
                    placeholder={DEFAULT_FIX_TITLE}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fix_about">About Section</Label>
                  <Textarea
                    id="fix_about"
                    rows={8}
                    {...register('about')}
                    placeholder={DEFAULT_FIX_ABOUT_TEXT}
                  />
                  <p className="text-xs text-muted-foreground">Use a blank line between paragraphs.</p>
                  {errors.about && <p className="text-sm text-destructive">{errors.about.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fix_sidebar_title">Right Section Title</Label>
                  <Input
                    id="fix_sidebar_title"
                    type="text"
                    {...register('sidebar_title')}
                    placeholder={DEFAULT_FIX_SIDEBAR_TITLE}
                  />
                  {errors.sidebar_title && <p className="text-sm text-destructive">{errors.sidebar_title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fix_sidebar_points">Right Section Bullet Points</Label>
                  <Textarea
                    id="fix_sidebar_points"
                    rows={6}
                    {...register('sidebar_points')}
                    placeholder={DEFAULT_FIX_SIDEBAR_POINTS.join('\n')}
                  />
                  <p className="text-xs text-muted-foreground">Add one bullet point per line.</p>
                  {errors.sidebar_points && <p className="text-sm text-destructive">{errors.sidebar_points.message}</p>}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateFixSettings.isPending}>
                    {updateFixSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save FIX Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {showApplicationsSection && (
        <Card>
          <CardHeader>
            <CardTitle>FIX Applications</CardTitle>
            <CardDescription>Review internal FIX submissions and mark them as pending, approved, or rejected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">


            <div className="flex gap-4 items-end">
              <div className="w-44">
                <Label htmlFor="fix-status-filter" className="mb-2 block">Show Applications</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FixRegistrationStatus | 'all')}>
                  <SelectTrigger id="fix-status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Label htmlFor="fix-stage-filter" className="mb-2 block">Base Startup Stage</Label>
                <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as string | 'all')}>
                  <SelectTrigger id="fix-stage-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {stages.map((stage: string) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <Label htmlFor="fix-month-filter" className="mb-2 block">Month</Label>
                <Select value={monthFilter} onValueChange={(value) => setMonthFilter(value as string | 'all')}>
                  <SelectTrigger id="fix-month-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                    <SelectItem value="05">May</SelectItem>
                    <SelectItem value="06">June</SelectItem>
                    <SelectItem value="07">July</SelectItem>
                    <SelectItem value="08">August</SelectItem>
                    <SelectItem value="09">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-28">
                <Label htmlFor="fix-year-filter" className="mb-2 block">Year</Label>
                <Select value={String(yearFilter)} onValueChange={(value) => setYearFilter(Number(value))}>
                  <SelectTrigger id="fix-year-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="2029">2029</SelectItem>
                    <SelectItem value="2030">2030</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Reset filters to defaults and apply immediately
                    setStatusFilter('all');
                    setStageFilter('all');
                    setMonthFilter('all');
                    setYearFilter(DEFAULT_YEAR);
                    setAppliedFilters({ status: 'all', stage: 'all', month: 'all', year: DEFAULT_YEAR });
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setAppliedFilters({ status: statusFilter, stage: stageFilter, month: monthFilter, year: yearFilter })}
                  disabled={!(statusFilter !== 'all' || stageFilter !== 'all' || monthFilter !== 'all' || yearFilter !== DEFAULT_YEAR)}
                >
                  Search
                </Button>
              </div>
            </div>

            {isLoadingRegistrations ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading FIX applications...</span>
              </div>
            ) : !fixRegistrations || fixRegistrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No FIX applications found for the selected filter.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Startup</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(fixRegistrations || [])
                    .filter((registration: any) => {
                      const sf = appliedFilters.status;
                      const stf = appliedFilters.stage;
                      const mf = appliedFilters.month;
                      const yf = appliedFilters.year;
                      if (sf !== 'all' && registration.status !== sf) return false;
                      if (stf !== 'all' && registration.startup_stage !== stf) return false;
                      // month filter
                      if (mf && mf !== 'all') {
                        const m = Number(mf);
                        let created: Date | null = null;
                        if (registration.allocated_date && registration.allocated_date.seconds) {
                          created = new Date(registration.allocated_date.seconds * 1000);
                        } else if (registration.allocated_date instanceof Date) {
                          created = registration.allocated_date as Date;
                        } else if (typeof registration.allocated_date === 'string' && registration.allocated_date) {
                          created = new Date(registration.allocated_date);
                        } else if (registration.allocated_date && typeof (registration.allocated_date as any).toDate === 'function') {
                          created = (registration.allocated_date as any).toDate();
                        } else if (registration.createdAt && registration.createdAt.seconds) {
                          created = new Date(registration.createdAt.seconds * 1000);
                        } else if (registration.createdAt instanceof Date) {
                          created = registration.createdAt as Date;
                        } else if (registration.created_at && registration.created_at.seconds) {
                          created = new Date(registration.created_at.seconds * 1000);
                        }
                        if (!created) return false;
                        if (created.getFullYear() !== yf || created.getMonth() + 1 !== m) return false;
                      }
                      // year filter when month is 'all'
                      if ((mf === 'all' || !mf) && yf) {
                        let created: Date | null = null;
                        if (registration.allocated_date && registration.allocated_date.seconds) {
                          created = new Date(registration.allocated_date.seconds * 1000);
                        } else if (registration.allocated_date instanceof Date) {
                          created = registration.allocated_date as Date;
                        } else if (typeof registration.allocated_date === 'string' && registration.allocated_date) {
                          created = new Date(registration.allocated_date);
                        } else if (registration.allocated_date && typeof (registration.allocated_date as any).toDate === 'function') {
                          created = (registration.allocated_date as any).toDate();
                        } else if (registration.createdAt && registration.createdAt.seconds) {
                          created = new Date(registration.createdAt.seconds * 1000);
                        } else if (registration.createdAt instanceof Date) {
                          created = registration.createdAt as Date;
                        } else if (registration.created_at && registration.created_at.seconds) {
                          created = new Date(registration.created_at.seconds * 1000);
                        }
                        if (created && created.getFullYear() !== yf) return false;
                      }
                      return true;
                    })
                    .map((registration: any) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.startup_name}</TableCell>
                        <TableCell className="break-words">{registration.email}</TableCell>
                        <TableCell className="break-words">{registration.phone ?? '—'}</TableCell>
                        <TableCell className="break-words">{registration.startup_stage ?? '—'}</TableCell>
                        <TableCell className="break-words">{registration.allocated_date ? new Date(registration.allocated_date.seconds ? registration.allocated_date.seconds * 1000 : registration.allocated_date).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={statusBadgeVariant(registration.status)}>
                              {registration.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="w-[72px]">
                          {registration.pitch_deck_link ? (
                            <a href={registration.pitch_deck_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 text-primary hover:bg-muted rounded">
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="sr-only">Open link</span>
                            </a>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-center mb-4">
                                  <span className="font-normal">FIX Application:</span> {registration.name}
                                </DialogTitle>
                              </DialogHeader>

                              <RegistrationDialogContent registration={registration} />

                              {registration.pitch_deck_link && (
                                <div className="mb-2">
                                  <a href={registration.pitch_deck_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline break-all">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span className="truncate">{registration.pitch_deck_link}</span>
                                  </a>
                                </div>
                              )}

                              <div className="space-y-4 text-sm">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div><span className="font-semibold">Mail ID:</span> {registration.email}</div>
                                  <div><span className="font-semibold">Phone Number:</span> {registration.phone}</div>
                                  <div><span className="font-semibold">Startup:</span> {registration.startup_name}</div>
                                  <div><span className="font-semibold">Startup Stage:</span> {registration.startup_stage}</div>
                                </div>
                                {registration.founder_linkedin && (
                                  <div>
                                    <span className="font-semibold">Founder's LinkedIn:</span>{' '}
                                    <Link href={registration.founder_linkedin} target="_blank" className="text-primary hover:underline">
                                      Open LinkedIn <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
                                    </Link>
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold">Startup Summary</p>
                                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{registration.startup_summary}</p>
                                </div>
                                <div>
                                  <p className="font-semibold">Support Needed</p>
                                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{registration.support_needed}</p>
                                </div>
                                <div>
                                  <p className="font-semibold">Additional Information</p>
                                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{registration.additional_info}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RegistrationDialogContent({ registration }: { registration: any }) {
  const updateFixRegistration = useUpdateFixRegistration();
  const { toast } = useToast();
  const [status, setStatus] = useState<FixRegistrationStatus>(registration.status);
  const initialDate = registration.allocated_date ? new Date(registration.allocated_date.seconds ? registration.allocated_date.seconds * 1000 : registration.allocated_date).toISOString().slice(0, 10) : '';
  const [date, setDate] = useState<string>(initialDate);
  const [dirty, setDirty] = useState(false);

  const onStatusChange = (v: string) => {
    setStatus(v as FixRegistrationStatus);
    setDirty(true);
  };

  const onDateChange = (v: string) => {
    setDate(v);
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      const fields: any = {
        status,
        allocated_date: date ? new Date(date) : null,
        // send identifying public fields so public doc can be created/updated
        name: registration.name,
        startup_name: registration.startup_name,
        phone: registration.phone,
      };

      await updateFixRegistration.mutateAsync({ registrationId: registration.id, fields });
      toast({ title: 'Saved', description: 'Status and date saved.' });
      setDirty(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-semibold">{registration.name}</div>
          <div className="text-sm text-muted-foreground">{registration.startup_name}</div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
          <Button onClick={handleSave} disabled={!dirty || updateFixRegistration.isPending}>Save</Button>
        </div>
      </div>
    </div>
  );
}
