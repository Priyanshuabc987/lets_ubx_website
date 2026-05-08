"use client";

import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateFixRegistration } from '@/hooks/useFixRegistrations';
import { useFixSettings } from '@/hooks/useFixSettings';
import { useRouter } from 'next/navigation';

const maxWordCount = 300;

const countWords = (value: string) =>
  value
    ?.trim()
    .split(/\s+/)
    .filter(Boolean).length || 0;

function QuestionCard({
  title,
  description,
  required = false,
  children,
  error,
}: {
  title: string;
  description?: string;
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
        {description && <p className="text-xs text-white/60 mt-1 font-normal">{description}</p>}
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
  const router = useRouter();
  const createFixRegistration = useCreateFixRegistration();
  const { data: fixSettings, isLoading: isLoadingSettings } = useFixSettings();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isAnsweredBarDocked, setIsAnsweredBarDocked] = useState(false);
  const answeredBarAnchorRef = useRef<HTMLDivElement | null>(null);

  const questions = fixSettings?.registration_questions || [];

  // Redirect returning users
  useEffect(() => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fix_status_cache:')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.startup_name) {
              const phone = parsed.phone || '';
              router.push(`/fix/status?startup_name=${encodeURIComponent(parsed.startup_name)}&phone=${encodeURIComponent(phone)}`);
              return;
            }
          }
        }
      }
    } catch (e) {}
  }, [router]);

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fix_registration_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setFormData(parsed);
      }
    } catch (e) {}
  }, []);

  // Save draft
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      try {
        localStorage.setItem('fix_registration_draft', JSON.stringify(formData));
      } catch (e) {}
    }
  }, [formData]);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev: Record<string, string>) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    questions.forEach(q => {
      const val = formData[q.id]?.trim() || '';
      if (q.required && !val) {
        newErrors[q.id] = 'This field is required';
      } else if (q.type === 'url' && val && !/^https?:\/\/.+/i.test(val)) {
        newErrors[q.id] = 'Please enter a valid URL';
      } else if (q.type === 'textarea' && countWords(val) > maxWordCount) {
        newErrors[q.id] = `Maximum ${maxWordCount} words allowed`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields correctly.', variant: 'destructive' });
      return;
    }

    try {
      await createFixRegistration.mutateAsync(formData as any);
      
      // Save to local cache for status check
      try {
        const startupName = formData['startup_name'] || '';
        const phone = formData['phone'] || '';
        const name = formData['name'] || '';
        const normalizedName = startupName.trim().toLowerCase().replace(/\s+/g, ' ');
        const key = `fix_status_cache:${normalizedName}:${phone.trim()}`;
        const cached = {
          id: null,
          name,
          startup_name: startupName,
          startup_normalised: normalizedName,
          phone: phone.trim(),
          status: 'pending',
          allocated_date: null,
          savedAt: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cached));
        router.push(`/fix/status?startup_name=${encodeURIComponent(startupName)}&phone=${encodeURIComponent(phone)}`);
      } catch (e) {}

      setSubmitted(true);
      setFormData({});
      localStorage.removeItem('fix_registration_draft');
      toast({ title: 'Application submitted', description: 'Your FIX application has been received.' });
    } catch (error) {
      toast({ title: 'Submission failed', description: 'Please try again later.', variant: 'destructive' });
    }
  };

  const answeredCount = questions.filter(q => formData[q.id]?.trim().length > 0).length;

  useEffect(() => {
    const anchor = answeredBarAnchorRef.current;
    if (!anchor) return;
    // We use a larger rootMargin to trigger the docking earlier (when the bottom area is 200px from the viewport)
    const observer = new IntersectionObserver(([entry]) => setIsAnsweredBarDocked(entry.isIntersecting), { 
      threshold: 0,
      rootMargin: '0px 0px -50px 0px' 
    });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  if (isLoadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        <p className="text-zinc-500 font-medium animate-pulse">Preparing Registration Form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-5xl space-y-4 text-center text-black px-4">
        <h1 className="text-balance text-3xl font-black sm:text-5xl tracking-tight uppercase italic">
          {fixSettings?.registration_title || 'FIX Registration'}
        </h1>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed sm:text-base text-zinc-600 font-medium">
          {fixSettings?.registration_description}
        </p>
      </div>

      {submitted && (
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 text-emerald-900 shadow-sm animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-black text-lg uppercase italic">Success!</p>
            <p className="text-sm font-medium text-emerald-800/70">Your application has been received and is pending review.</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6 px-4">
        {questions.map((q, idx) => (
          <QuestionCard 
            key={q.id} 
            title={q.label} 
            description={q.description}
            required={q.required} 
            error={errors[q.id]}
          >
            {q.type === 'text' && (
              <Input 
                value={formData[q.id] || ''} 
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="h-14 rounded-none border-0 border-b border-zinc-200 px-4 text-lg shadow-none focus-visible:ring-0 focus-visible:border-black transition-all font-bold placeholder:font-normal"
                placeholder="Type your answer here..."
              />
            )}
            {q.type === 'url' && (
              <Input 
                type="url"
                value={formData[q.id] || ''} 
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="h-14 rounded-none border-0 border-b border-zinc-200 px-4 text-lg shadow-none focus-visible:ring-0 focus-visible:border-black transition-all font-bold placeholder:font-normal"
                placeholder="https://..."
              />
            )}
            {q.type === 'textarea' && (
              <div className="space-y-2">
                <Textarea 
                  value={formData[q.id] || ''} 
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  rows={4}
                  className="min-h-[120px] rounded-none border-0 border-b border-zinc-200 px-4 text-lg shadow-none focus-visible:ring-0 focus-visible:border-black transition-all font-bold resize-none placeholder:font-normal"
                  placeholder="Share the details..."
                />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">
                  {countWords(formData[q.id])} / {maxWordCount} words
                </p>
              </div>
            )}
            {q.type === 'select' && (
              <Select value={formData[q.id] || ''} onValueChange={(v) => handleInputChange(q.id, v)}>
                <SelectTrigger className="h-14 rounded-none border-0 border-b border-zinc-200 px-4 text-lg shadow-none focus:ring-0 focus:border-black font-bold">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options?.map(opt => (
                    <SelectItem key={opt} value={opt} className="font-medium">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </QuestionCard>
        ))}

        {/* This anchor determines when the bar should stop floating */}
        <div ref={answeredBarAnchorRef} className="h-4" />

        <div className="pt-8 text-center">
          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-full bg-black hover:bg-zinc-800 text-white px-10 font-black uppercase italic tracking-widest shadow-2xl shadow-black/20 group transition-all"
            disabled={createFixRegistration.isPending}
          >
            {createFixRegistration.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Submit Application
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>

      {/* Unified Progress Bar */}
      <div
        className={`z-30 px-4 transition-all duration-500 ease-in-out ${
          isAnsweredBarDocked 
            ? 'relative mt-0 mb-12 opacity-100 translate-y-0 flex justify-center' 
            : 'fixed bottom-8 left-1/2 -translate-x-1/2 opacity-100 translate-y-0'
        }`}
      >
        <div className={`rounded-full shadow-2xl flex items-center gap-4 border transition-all duration-500 ${
          isAnsweredBarDocked 
            ? 'bg-white border-zinc-100 px-6 py-2.5 text-zinc-900' 
            : 'bg-black/90 backdrop-blur-md px-8 py-3 text-white border-white/10'
        }`}>
          <div className="flex flex-col items-start leading-none">
            <span className={`text-[10px] mb-1 ${isAnsweredBarDocked ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Current Progress
            </span>
            <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
              {answeredCount} / {questions.length} Answered
            </span>
          </div>
          <div className={`w-12 h-1.5 rounded-full overflow-hidden ${isAnsweredBarDocked ? 'bg-zinc-100' : 'bg-zinc-700'}`}>
            <div 
              className={`h-full transition-all duration-500 ${isAnsweredBarDocked ? 'bg-black' : 'bg-white'}`} 
              style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
