"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateFixRegistration } from '@/hooks/useFixRegistrations';

import { useRouter } from 'next/navigation';
const maxWordCount = 300;

const countWords = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const maxWords = (label: string) =>
  z.string().min(1, `${label} is required`).refine((value) => countWords(value) <= maxWordCount, {
    message: `${label} must be within ${maxWordCount} words`,
  });

const fixRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  founder_linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  startup_name: z.string().min(1, 'Startup or company name is required'),
  startup_stage: z.string().min(1, 'Startup stage is required'),
  startup_summary: maxWords('Startup summary'),
  support_needed: maxWords('Support or resources'),
  additional_info: maxWords('Additional information'),
  pitch_deck_link: z.string().url('Valid Google Drive link is required').min(1, 'Pitch deck link is required'),
});

type FixRegistrationFormData = z.infer<typeof fixRegistrationSchema>;

const startupStageOptions = [
  'Idea Stage',
  'Early Stage',
  'MVP Stage',
  'Growth Stage',
  'Revenue Stage',
];

function QuestionCard({
  title,
  required = false,
  children,
  error,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <div className="bg-black px-6 py-4 text-white">
        <Label className="text-[1.05rem] font-medium leading-snug text-white">
          {title}
          {required ? <span className="ml-1 text-red-400">*</span> : null}
        </Label>
      </div>
      <div className="space-y-4 px-6 py-6">
        {children}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

export function FixRegistrationForm() {
  const { toast } = useToast();
  const createFixRegistration = useCreateFixRegistration();
  const [submitted, setSubmitted] = useState(false);
  const [isAnsweredBarDocked, setIsAnsweredBarDocked] = useState(false);
  const answeredBarAnchorRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FixRegistrationFormData>({
    resolver: zodResolver(fixRegistrationSchema),
    defaultValues: {
      founder_linkedin: '',
      startup_stage: '',
    },
  });

  const values = watch();

  const answeredCount = useMemo(() => {
    const trackedValues = [
      values.name,
      values.email,
      values.phone,
      values.founder_linkedin,
      values.startup_name,
      values.startup_stage,
      values.startup_summary,
      values.support_needed,
      values.additional_info,
      values.pitch_deck_link,
    ];

    return trackedValues.filter((value) => typeof value === 'string' && value.trim().length > 0).length;
  }, [values]);

  const onSubmit = async (data: FixRegistrationFormData) => {
    try {
      await createFixRegistration.mutateAsync(data);
      // write optimistic local cache immediately so status page shows pending
      try {
        const key = `fix_status_cache:${data.startup_name}:${data.phone}`;
        const cached = {
          id: null,
          name: data.name || '',
          startup_name: data.startup_name || '',
          status: 'pending',
          allocated_date: null,
          savedAt: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cached));
      } catch (e) {}

      // navigate immediately to status page (user sees pending cached state)
      router.push(`/fix/status?startup_name=${encodeURIComponent(data.startup_name)}&phone=${encodeURIComponent(data.phone)}`);

      // fire submission in background
      createFixRegistration.mutate(data);

      setSubmitted(true);
      reset({
        name: '',
        email: '',
        phone: '',
        founder_linkedin: '',
        startup_name: '',
        startup_stage: '',
        startup_summary: '',
        support_needed: '',
        additional_info: '',
        pitch_deck_link: '',
      });
      try {
        localStorage.removeItem('fix_registration_draft');
      } catch (e) {
        // ignore
      }
      toast({
        title: 'Application submitted',
        description: 'Your FIX application has been received and is now pending review.',
      });
    } catch (error) {
      console.error('Failed to submit FIX registration:', error);
      toast({
        title: 'Submission failed',
        description: 'We could not submit your application right now. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const anchor = answeredBarAnchorRef.current;
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAnsweredBarDocked(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  // load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fix_registration_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach((key) => {
            // @ts-ignore
            if (parsed[key] !== undefined) setValue(key, parsed[key]);
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }, [setValue]);

  // save draft to localStorage when values change
  useEffect(() => {
    try {
      const draft = {
        name: values.name || '',
        email: values.email || '',
        phone: values.phone || '',
        founder_linkedin: values.founder_linkedin || '',
        startup_name: values.startup_name || '',
        startup_stage: values.startup_stage || '',
        startup_summary: values.startup_summary || '',
        support_needed: values.support_needed || '',
        additional_info: values.additional_info || '',
        pitch_deck_link: values.pitch_deck_link || '',
      };
      localStorage.setItem('fix_registration_draft', JSON.stringify(draft));
    } catch (e) {
      // ignore
    }
  }, [values]);

  return (
    <div className="space-y-5">
      <div className="mx-auto max-w-5xl space-y-3 text-center text-black">
        <h1 className="text-balance text-3xl font-medium sm:text-5xl">
          Founders & Investors Xplore (FIX) By CEDAT
        </h1>
        <p className="mx-auto max-w-4xl text-base leading-relaxed sm:text-[1.05rem]">
          CEDAT - Dynamic Ecosystem of Nexus Communities. Only shortlisted startups will be onboarded to
          CEDAT. A registration fee of Rs5000 applies only to those shortlisted & confirmed startups
        </p>
      </div>

      {submitted && (
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-md">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Application submitted successfully.</p>
            <p className="text-sm">Your FIX application has been received and is now pending review.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-4">
        <QuestionCard title="1. Name" required error={errors.name?.message}>
          <Input id="name" {...register('name')} className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
        </QuestionCard>

        <QuestionCard title="2. Mail ID" required error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
        </QuestionCard>

        <QuestionCard title="3. Phone Number" required error={errors.phone?.message}>
          <Input id="phone" {...register('phone')} className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
        </QuestionCard>

        <QuestionCard title="4. Founder's Linkedin" error={errors.founder_linkedin?.message}>
          <Input
            id="founder_linkedin"
            type="url"
            {...register('founder_linkedin')}
            placeholder="https://linkedin.com/in/..."
            className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0"
          />
        </QuestionCard>

        <QuestionCard title="5. Name of the startup or company" required error={errors.startup_name?.message}>
          <Input id="startup_name" {...register('startup_name')} className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
        </QuestionCard>

        <QuestionCard title="6. Select the stage of your startup from the options below" required error={errors.startup_stage?.message}>
          <Select value={watch('startup_stage')} onValueChange={(value) => setValue('startup_stage', value, { shouldDirty: true, shouldValidate: true })}>
            <SelectTrigger id="startup_stage" className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus:ring-0">
              <SelectValue placeholder="Choose startup stage" />
            </SelectTrigger>
            <SelectContent>
              {startupStageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QuestionCard>

        <QuestionCard title="7. Kindly share about your startup (Max 300 words)" required error={errors.startup_summary?.message}>
          <Textarea id="startup_summary" {...register('startup_summary')} rows={5} className="min-h-32 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
          <p className="text-xs text-zinc-500">{countWords(values.startup_summary || '')} / {maxWordCount} words</p>
        </QuestionCard>

        <QuestionCard title="8. What kind of support or resources do you need for your startup (Max 300 Words)" required error={errors.support_needed?.message}>
          <Textarea id="support_needed" {...register('support_needed')} rows={5} className="min-h-32 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
          <p className="text-xs text-zinc-500">{countWords(values.support_needed || '')} / {maxWordCount} words</p>
        </QuestionCard>

        <QuestionCard title="9. Is there anything else you would like us to know about your experiences, interests & skills (Max 300 Words)" required error={errors.additional_info?.message}>
          <Textarea id="additional_info" {...register('additional_info')} rows={5} className="min-h-32 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0" />
          <p className="text-xs text-zinc-500">{countWords(values.additional_info || '')} / {maxWordCount} words</p>
        </QuestionCard>

        <QuestionCard
          title="10. Upload a Google Drive link that includes your pitch deck and any other documents to be shared."
          required
          error={errors.pitch_deck_link?.message}
        >
          <p className="text-sm text-zinc-600">
            Please ensure the access is given to "Anyone with the link can view"
          </p>
          <Input
            id="pitch_deck_link"
            type="url"
            {...register('pitch_deck_link')}
            placeholder="https://drive.google.com/..."
            className="h-14 rounded-none border-0 border-b border-zinc-300 px-2 text-base shadow-none focus-visible:ring-0"
          />
        </QuestionCard>

        <div className="pt-2 text-center">
          <Button
            type="submit"
            size="lg"
            className="min-h-[52px] rounded-full bg-black px-8 font-bold text-white shadow-lg "
            disabled={createFixRegistration.isPending}
          >
            {createFixRegistration.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </div>

        <div ref={answeredBarAnchorRef} className="flex justify-center pt-4">
          <div className="rounded-xl bg-white px-6 py-2 text-sm font-medium text-zinc-900 shadow-xl">
            Answered <span className="font-bold">{answeredCount}</span> of 10
          </div>
        </div>
      </form>

      <div
        className={`pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 px-4 transition-opacity duration-200 ${
          isAnsweredBarDocked ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="rounded-xl bg-white px-6 py-2 text-sm font-medium text-zinc-900 shadow-xl">
          Answered <span className="font-bold">{answeredCount}</span> of 10
        </div>
      </div>
    </div>
  );
}
