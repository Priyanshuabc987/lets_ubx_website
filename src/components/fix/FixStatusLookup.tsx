"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { useFixRegistrationLookup } from '@/hooks/useFixRegistrations';

export function FixStatusLookup() {
  const [startupInput, setStartupInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [criteria, setCriteria] = useState<{ startup_name: string; phone: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  // Component-owned flag set on button click, cleared when a result arrives.
  // Avoids relying on hook's isLoading which React 18 batches away when cache is instant.
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  const { registration, isLoading, error: lookupError } = useFixRegistrationLookup(criteria?.startup_name, criteria?.phone, undefined, true);

  // math captcha — generate only on client to avoid SSR/CSR mismatch
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [expected, setExpected] = useState<number | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const isMathCorrect = expected !== null ? Number(mathAnswer) === expected : false;

  useEffect(() => {
    const aa = Math.floor(Math.random() * 5) + 1;
    const bb = Math.floor(Math.random() * 5) + 1;
    setA(aa);
    setB(bb);
    setExpected(aa + bb);
  }, []);

  // Resolve once the hook finishes loading AND we are actively searching.
  useEffect(() => {
    if (!isSearching || !criteria || isLoading) return;

    if (registration) {
      // Application found — navigate to status page
      router.push(
        `/fix/status?startup_name=${encodeURIComponent(criteria.startup_name)}&phone=${encodeURIComponent(criteria.phone)}`
      );
    } else if (lookupError) {
      // API error (like rate limit or server error)
      setIsSearching(false);
      // We don't setNotFound(true) here because it's a server error, not a missing record
    } else {
      // Lookup completed with no result
      setIsSearching(false);
      setNotFound(true);
    }
  }, [registration, isLoading, isSearching, criteria, router, lookupError]);

  const handleSearch = () => {
    setNotFound(false);
    setIsSearching(true);
    setCriteria({
      startup_name: startupInput.trim(),
      phone: phoneInput.trim(),
    });
  };

  const handleReset = () => {
    setStartupInput('');
    setPhoneInput('');
    setMathAnswer('');
    setCriteria(null);
    setNotFound(false);
    setIsSearching(false);
  };

  const isBusy = isSearching || isLoading;

  return (
    <Card className="overflow-hidden rounded-sm border-0 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <CardHeader className="bg-black px-6 py-4 text-white">
        <CardTitle className="text-[1.05rem] font-bold text-white">Check Your Application Status</CardTitle>
        <CardDescription className="text-white/90">
          No login needed. Enter your startup name and phone number to look up your application status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-6">

        {/* API Error Message */}
        {lookupError && !isLoading && (
          <div className="flex items-start gap-3 rounded-sm border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Error checking status</p>
              <p className="mt-0.5">{lookupError}</p>
            </div>
          </div>
        )}

        {/* Input fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fix-status-startup">
              Startup Name <span className="ml-1 text-red-400">*</span>
            </Label>
            <Input
              id="fix-status-startup"
              value={startupInput}
              onChange={(e) => { setStartupInput(e.target.value); setNotFound(false); }}
              placeholder="Startup or company name"
              disabled={isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fix-status-phone">
              Phone Number <span className="ml-1 text-red-400">*</span>
            </Label>
            <Input
              id="fix-status-phone"
              value={phoneInput}
              onChange={(e) => { setPhoneInput(e.target.value); setNotFound(false); }}
              placeholder="Your registered phone number"
              disabled={isBusy}
            />
          </div>
        </div>

        {/* Math captcha */}
        <div className="flex items-center gap-3">
          <Label className="shrink-0">Prove you're human</Label>
          <div className="flex items-center gap-2">
            <div className="rounded border border-border/60 bg-muted/10 px-3 py-2 text-sm whitespace-nowrap">
              {a !== null && b !== null ? `${a} + ${b} =` : '…'}
            </div>
            <Input
              id="fix-captcha-answer"
              className="w-24 border-black bg-background"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Answer"
              disabled={isBusy}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <Button
            id="fix-check-status-btn"
            type="button"
            onClick={handleSearch}
            disabled={!startupInput.trim() || !phoneInput.trim() || !isMathCorrect || isBusy}
            className="bg-black text-white hover:bg-black/90"
          >
            {isBusy
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <Search className="mr-2 h-4 w-4" />}
            {isBusy ? 'Checking…' : 'Check Status'}
          </Button>
          {(notFound || lookupError) && (
            <Button type="button" variant="ghost" onClick={handleReset}>
              Try Again
            </Button>
          )}
        </div>

        {/* Not-found message */}
        {notFound && !isBusy && !lookupError && (
          <div className="flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">No application found.</p>
              <p className="mt-0.5">
                We could not find an application matching that startup name and mobile number.
                Please ensure both are entered exactly as used during registration.
              </p>
              <p className="mt-2">
                Haven't applied yet?{' '}
                <a href="/fix/register" className="underline font-medium">Register for FIX</a>.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
