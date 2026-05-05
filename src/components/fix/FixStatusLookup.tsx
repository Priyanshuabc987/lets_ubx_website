"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { FixRegistrationStatus, useFixRegistrationLookup } from '@/hooks/useFixRegistrations';

const statusCopy: Record<FixRegistrationStatus, { title: string; description: string; icon: typeof Clock3 }> = {
  pending: {
    title: 'Pending Review',
    description: 'Your FIX application has been received and is currently under review.',
    icon: Clock3,
  },
  approved: {
    title: 'Approved',
    description: 'Your FIX application has been approved. The team will contact you with the next steps.',
    icon: CheckCircle2,
  },
  rejected: {
    title: 'Rejected',
    description: 'Your FIX application is not moving forward at this stage.',
    icon: XCircle,
  },
};

const badgeVariant = (status: FixRegistrationStatus) => {
  if (status === 'approved') return 'default';
  if (status === 'rejected') return 'destructive';
  return 'secondary';
};

export function FixStatusLookup() {
  const [startupInput, setStartupInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [criteria, setCriteria] = useState<{ startup_name: string; phone: string } | null>(null);

  const { registration, isLoading, refresh } = useFixRegistrationLookup(criteria?.startup_name, criteria?.phone);

  const handleSearch = () => {
    setCriteria({
      startup_name: startupInput.trim(),
      phone: phoneInput.trim(),
    });
  };

  const searchParams = useSearchParams();
  const router = useRouter();

  // Auto-run lookup when URL params present
  useEffect(() => {
    const s = searchParams?.get('startup_name') || searchParams?.get('startup');
    const p = searchParams?.get('phone');
    if (s) {
      setStartupInput(s);
      if (p) setPhoneInput(p);
      // trigger lookup (use cache-first behavior)
      setCriteria({ startup_name: s.trim(), phone: (p || '').trim() });
    }
  }, [searchParams]);

  // math challenge: generate only on client to avoid SSR/CSR mismatch
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [expected, setExpected] = useState<number | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const isMathCorrect = expected !== null ? Number(mathAnswer) === expected : false;

  useEffect(() => {
    // generate challenge only in browser
    const aa = Math.floor(Math.random() * 5) + 1;
    const bb = Math.floor(Math.random() * 5) + 1;
    setA(aa);
    setB(bb);
    setExpected(aa + bb);
  }, []);

  const currentStatus = registration?.status;
  const statusMeta = currentStatus ? statusCopy[currentStatus as FixRegistrationStatus] : null;
  const StatusIcon = statusMeta?.icon;

  return (
    <Card className="overflow-hidden rounded-sm border-0 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <CardHeader className="bg-black px-6 py-4 text-white">
        <CardTitle className="text-[1.05rem] font-bold text-white">Check Your Application Status</CardTitle>
        <CardDescription className="text-white/90">
          No login needed. Enter your phone number to look up your application status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-6">
        {/* Show lookup form only when there's no cached/returned registration */}
        {!registration && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fix-status-startup">Startup Name <span className="ml-1 text-red-400">*</span></Label>
              <Input
                id="fix-status-startup"
                value={startupInput}
                onChange={(event) => setStartupInput(event.target.value)}
                placeholder="Startup or company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fix-status-phone">Phone Number <span className="ml-1 text-red-400">*</span></Label>
              <Input
                id="fix-status-phone"
                value={phoneInput}
                onChange={(event) => setPhoneInput(event.target.value)}
                placeholder="Your phone number"
              />
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <Label>Prove you're human</Label>
            <div className="flex items-center gap-2">
              <div className="rounded border border-border/60 bg-muted/10 px-3 py-2 whitespace-nowrap">
                {a !== null && b !== null ? `${a} + ${b} =` : '...'}
              </div>
              <Input
                className="border-black bg-background"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Answer"
              />
            </div>

          </div>
        </div>

        <div className="flex items-center gap-3">
          {!registration ? (
            <>
              <Button
                type="button"
                onClick={handleSearch}
                disabled={!startupInput.trim() || !phoneInput.trim() || !isMathCorrect}
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF]"
              >
                <Search className="mr-2 h-4 w-4" />
                Check Status
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  if (!startupInput.trim()) return;
                  await refresh?.();
                }}
                variant="ghost"
                className="ml-2"
              >
                Refresh
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={async () => {
                  await refresh?.();
                }}
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF]"
              >
                Refresh
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="ml-2"
                onClick={() => {
                  // clear inputs and criteria to allow checking another status
                  setStartupInput('');
                  setPhoneInput('');
                  setCriteria(null);
                  // clear URL params
                  router.push('/fix/check');
                }}
              >
                Check another status
              </Button>
            </>
          )}
        </div>


        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your application...
          </div>
        )}

        {criteria && !isLoading && !registration && (
          <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            No FIX application was found with that startup name and phone number combination.
            <div className="mt-2 text-sm">
              You can try again or <a href="/fix/register" className="underline">register for FIX</a>.
            </div>
          </div>
        )}

        {registration && statusMeta && StatusIcon && (
          <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-4">
            {/* If this is an optimistic cached submission (id === null) show a thank-you message */}
            {registration.id === null && registration.status === 'pending' && (
              <div className="mb-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                <p className="font-semibold">Thank you — your application was received.</p>
                <p className="text-sm">We've recorded your submission and it's now pending review.</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60">
                <StatusIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{statusMeta.title}</p>
                  <Badge variant={badgeVariant(registration.status)}>{registration.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{statusMeta.description}</p>
                <div className="mt-3 text-sm">
                  <div><span className="font-semibold">Name:</span> {registration.name}</div>
                  <div><span className="font-semibold">Startup:</span> {registration.startup_name}</div>
                  {/* <div><span className="font-semibold">Date Allotted:</span> {registration.allocated_date ? new Date(registration.allocated_date.seconds ? registration.allocated_date.seconds * 1000 : registration.allocated_date).toLocaleDateString() : '—'}</div> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
