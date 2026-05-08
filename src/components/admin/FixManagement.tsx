
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
import { Loader2, ArrowUpRight, ExternalLink, Linkedin, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFixSettings, useUpdateFixSettings } from '@/hooks/useFixSettings';
import { FixRegistrationStatus, useFixRegistrations, useUpdateFixRegistrationStatus, useUpdateFixRegistration } from '@/hooks/useFixRegistrations';
import { useAdminFixRegistrations } from '@/hooks/useAdminFixRegistrations';
import {
  DEFAULT_FIX_ABOUT_TEXT,
  DEFAULT_FIX_SIDEBAR_POINTS,
  DEFAULT_FIX_SIDEBAR_TITLE,
  DEFAULT_FIX_TITLE,
  DEFAULT_FIX_REG_TITLE,
  DEFAULT_FIX_REG_DESCRIPTION,
  DEFAULT_FIX_QUESTIONS,
  FixQuestion,
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
  registration_title: z.string().trim().min(1, 'Registration title is required'),
  registration_description: z.string().trim().min(1, 'Registration description is required'),
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

  // Local state for managing dynamic questions list
  const [questions, setQuestions] = useState<FixQuestion[]>([]);

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
      registration_title: fixSettings.registration_title || DEFAULT_FIX_REG_TITLE,
      registration_description: fixSettings.registration_description || DEFAULT_FIX_REG_DESCRIPTION,
    };
    const serialized = JSON.stringify({ ...nextFormValues, questions: fixSettings.registration_questions });

    if (serialized === lastSyncedValueRef.current || isDirty) return;

    reset(nextFormValues);
    setQuestions(fixSettings.registration_questions || DEFAULT_FIX_QUESTIONS);
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
        registration_title: data.registration_title,
        registration_description: data.registration_description,
        registration_questions: questions,
      };

      await updateFixSettings.mutateAsync(nextFormValues);

      const syncedFormValues = {
        registration_link: nextFormValues.registration_link || '',
        title: nextFormValues.title || DEFAULT_FIX_TITLE,
        about: nextFormValues.about || DEFAULT_FIX_ABOUT_TEXT,
        sidebar_title: nextFormValues.sidebar_title || DEFAULT_FIX_SIDEBAR_TITLE,
        sidebar_points: nextFormValues.sidebar_points.join('\n'),
        registration_title: nextFormValues.registration_title || DEFAULT_FIX_REG_TITLE,
        registration_description: nextFormValues.registration_description || DEFAULT_FIX_REG_DESCRIPTION,
      };

      reset(syncedFormValues);
      lastSyncedValueRef.current = JSON.stringify({ ...syncedFormValues, questions: nextFormValues.registration_questions });

      toast({
        title: 'Success',
        description: 'FIX settings updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update FIX settings:', error);
      toast({ title: 'Error', description: 'Failed to update FIX settings.', variant: 'destructive' });
    }
  };

  const handleAddQuestion = () => {
    const newId = `custom_${Date.now()}`;
    setQuestions([...questions, { id: newId, label: 'New Question', type: 'text', required: false }]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, fields: Partial<FixQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...fields } : q));
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
    <div className="space-y-6 pt-4">
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
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <CardTitle>FIX Page Content</CardTitle>
              </div>
              <CardDescription className="ml-4">
                Manage the left-side title/about section and the right-side title and bullet points.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">General Content</h3>
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
                      {errors.about && <p className="text-sm text-destructive">{errors.about.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sidebar Content</h3>
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
                  </div>
                </div>

                <div className="border-t-4 border-zinc-900/10 pt-8 mt-4 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="text-lg font-bold">Registration Form Settings</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-4 -mt-4">Configure the internal registration form title, description, and questions.</p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="registration_title">Form Header Title</Label>
                      <Input
                        id="registration_title"
                        {...register('registration_title')}
                        placeholder={DEFAULT_FIX_REG_TITLE}
                      />
                      {errors.registration_title && <p className="text-sm text-destructive">{errors.registration_title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration_description">Form Header Description</Label>
                      <Textarea
                        id="registration_description"
                        rows={3}
                        {...register('registration_description')}
                        placeholder={DEFAULT_FIX_REG_DESCRIPTION}
                      />
                      {errors.registration_description && <p className="text-sm text-destructive">{errors.registration_description.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <Label className="text-base font-bold">Form Questions</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>

                    <div className="hidden sm:grid grid-cols-12 gap-4 px-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="col-span-5">Label</div>
                      <div className="col-span-3">Type</div>
                      <div className="col-span-2 text-center">Required</div>
                      <div className="col-span-2 text-right pr-2">Action</div>
                    </div>

                    <div className="space-y-3">
                      {questions.map((q, index) => (
                        <div key={q.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-zinc-50/50 group transition-all hover:border-zinc-300">
                          <div className="flex items-start gap-3">
                            <div className="mt-2 text-zinc-400">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-1 grid gap-4 sm:grid-cols-12 items-start">
                              <div className="sm:col-span-5 space-y-1">
                                <Label className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground">Label</Label>
                                <Input
                                  value={q.label}
                                  onChange={(e) => handleUpdateQuestion(q.id, { label: e.target.value })}
                                  className="h-10 bg-white"
                                  placeholder="Question text"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <Label className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground">Type</Label>
                                <Select
                                  value={q.type}
                                  onValueChange={(v: any) => handleUpdateQuestion(q.id, { type: v })}
                                >
                                  <SelectTrigger className="h-10 bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text Input</SelectItem>
                                    <SelectItem value="textarea">Textarea</SelectItem>
                                    <SelectItem value="select">Dropdown</SelectItem>
                                    <SelectItem value="url">URL/Link</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <Label className="sm:hidden text-[10px] uppercase tracking-widest text-muted-foreground">Required</Label>
                                <div className="flex items-center justify-center h-10">
                                  <Button
                                    type="button"
                                    variant={q.required ? 'default' : 'outline'}
                                    size="icon"
                                    className={`h-8 w-8 rounded-lg transition-all ${q.required ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-400 bg-white'}`}
                                    onClick={() => handleUpdateQuestion(q.id, { required: !q.required })}
                                  >
                                    <Check className={`h-4 w-4 transition-transform ${q.required ? 'scale-110' : 'scale-90 opacity-20'}`} />
                                  </Button>
                                </div>
                              </div>
                              <div className="sm:col-span-2 flex items-center justify-end h-10">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive group-hover:bg-red-50 transition-colors"
                                  onClick={() => handleRemoveQuestion(q.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {q.type === 'select' && (
                            <div className="ml-7 space-y-1 pt-1">
                              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Dropdown Options (comma separated)</Label>
                              <Input
                                value={q.options?.join(', ') || ''}
                                onChange={(e) => handleUpdateQuestion(q.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                className="h-10 bg-white"
                                placeholder="e.g. Option 1, Option 2, Option 3"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {questions.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">
                        No questions added. Click "Add Question" to start building your form.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit" size="lg" disabled={updateFixSettings.isPending}>
                    {updateFixSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save All FIX Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {showApplicationsSection && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>FIX Applications</CardTitle>
            <CardDescription>Review internal FIX submissions and mark them as pending, approved, or rejected.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">


            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-full sm:w-44">
                <Label htmlFor="fix-status-filter" className="mb-2 block">Status</Label>
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
              <div className="w-full sm:w-40">
                <Label htmlFor="fix-stage-filter" className="mb-2 block">Startup Stage</Label>
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

              <div className="w-[calc(50%-0.5rem)] sm:w-32">
                <Label htmlFor="fix-month-filter" className="mb-2 block">Month</Label>
                <Select value={monthFilter} onValueChange={(value) => setMonthFilter(value as string | 'all')}>
                  <SelectTrigger id="fix-month-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="01">Jan</SelectItem>
                    <SelectItem value="02">Feb</SelectItem>
                    <SelectItem value="03">Mar</SelectItem>
                    <SelectItem value="04">Apr</SelectItem>
                    <SelectItem value="05">May</SelectItem>
                    <SelectItem value="06">Jun</SelectItem>
                    <SelectItem value="07">Jul</SelectItem>
                    <SelectItem value="08">Aug</SelectItem>
                    <SelectItem value="09">Sep</SelectItem>
                    <SelectItem value="10">Oct</SelectItem>
                    <SelectItem value="11">Nov</SelectItem>
                    <SelectItem value="12">Dec</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[calc(50%-0.5rem)] sm:w-28">
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
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
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
                  className="flex-1 sm:flex-none"
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
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Startup</TableHead>
                    <TableHead className="text-center">Email ID</TableHead>
                    <TableHead className="text-center">LinkedIn</TableHead>
                    <TableHead className="text-center">Contact</TableHead>
                    <TableHead className="text-center">Stage</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Link</TableHead>
                    <TableHead className="text-center">Details</TableHead>
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
                        <TableCell className="font-medium text-center">{registration.name}</TableCell>
                        <TableCell className="text-center">{registration.startup_name}</TableCell>
                        <TableCell className="break-words text-center">{registration.email}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {registration.founder_linkedin ? (
                              <a
                                href={registration.founder_linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            ) : (
                              <Linkedin className="h-4 w-4 text-muted-foreground/30" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="break-words text-center">{registration.phone ?? '—'}</TableCell>
                        <TableCell className="break-words text-center">{registration.startup_stage ?? '—'}</TableCell>
                        <TableCell className="break-words text-center">{registration.allocated_date ? new Date(registration.allocated_date.seconds ? registration.allocated_date.seconds * 1000 : registration.allocated_date).toLocaleDateString() : '—'}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Badge variant={statusBadgeVariant(registration.status)}>
                              {registration.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {registration.pitch_deck_link ? (
                            <div className="flex justify-center">
                              <a href={registration.pitch_deck_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 text-primary hover:bg-muted rounded">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">Open link</span>
                              </a>
                            </div>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                              <DialogHeader>
                                <DialogTitle className="text-center mb-4 text-lg sm:text-xl">
                                  <span className="font-normal text-muted-foreground">Application:</span> {registration.name}
                                </DialogTitle>
                              </DialogHeader>

                              <RegistrationDialogContent registration={registration} />

                              {registration.pitch_deck_link && (
                                <div className="mb-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                  <p className="text-[12px] font-black uppercase tracking-widest text-black mb-1">Pitch Deck / Website</p>
                                  <a href={registration.pitch_deck_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline break-all text-sm font-medium">
                                    <ArrowUpRight className="h-4 w-4 shrink-0" />
                                    <span>{registration.pitch_deck_link}</span>
                                  </a>
                                </div>
                              )}
                              <div className="space-y-6 text-sm">
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black block">Mail ID</span>
                                    <div className="break-all font-medium">{registration.email}</div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black block">Phone Number</span>
                                    <div className="break-all font-medium">{registration.phone}</div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black block">Startup Name</span>
                                    <div className="font-black italic uppercase">{registration.startup_name}</div>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black block">Current Stage</span>
                                    <div className="font-medium">{registration.startup_stage}</div>
                                  </div>
                                </div>

                                {registration.founder_linkedin && (
                                  <div className="space-y-1 pt-2 border-t border-zinc-50">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black block">Founder's LinkedIn</span>
                                    <Link href={registration.founder_linkedin} target="_blank" className="text-primary hover:underline font-medium inline-flex items-center gap-1 break-all">
                                      {registration.founder_linkedin} <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </div>
                                )}

                                <div className="space-y-4 pt-4 border-t border-zinc-100">
                                  <div className="bg-zinc-50/50 p-4 rounded-xl space-y-1">
                                    <p className="text-[12px] font-black uppercase tracking-widest text-black">Startup Summary</p>
                                    <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">{registration.startup_summary}</p>
                                  </div>

                                  <div className="bg-zinc-50/50 p-4 rounded-xl space-y-1">
                                    <p className="text-[12px] font-black uppercase tracking-widest text-black">Support Needed</p>
                                    <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">{registration.support_needed}</p>
                                  </div>

                                  {registration.additional_info && (
                                    <div className="bg-zinc-50/50 p-4 rounded-xl space-y-1">
                                      <p className="text-[12px] font-black uppercase tracking-widest text-black">Additional Information</p>
                                      <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">{registration.additional_info}</p>
                                    </div>
                                  )}
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
    <div className="mb-6 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl text-emerald-950 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-[12px] font-black uppercase tracking-widest text-emerald-700/60">Update Status & Allocation</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-emerald-100 h-10 text-emerald-900 font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-auto bg-white border-emerald-100 h-10 text-sm font-bold text-emerald-900"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!dirty || updateFixRegistration.isPending}
          className="sm:mt-5 bg-emerald-600 text-white hover:bg-emerald-700 h-10 font-bold px-6 shadow-lg shadow-emerald-600/20"
        >
          {updateFixRegistration.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Application'}
        </Button>
      </div>
    </div>
  );
}


