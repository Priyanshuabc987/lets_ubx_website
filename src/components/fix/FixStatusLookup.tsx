"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { useFixRegistrationLookup } from '@/hooks/useFixRegistrations';
import { FixContactSupport } from './FixContactSupport';

export function FixStatusLookup() {
  const [startupInput, setStartupInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [criteria, setCriteria] = useState<{ startup_name: string; phone: string } | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Track if we are currently waiting for a specific search to complete
  const [isSearching, setIsSearching] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const router = useRouter();

  // skipCache is true for the check page to force a fresh DB lookup
  const { registration, isLoading, error: lookupError } = useFixRegistrationLookup(
    criteria?.startup_name,
    criteria?.phone,
    undefined,
    true
  );

  // math captcha — generate only on client to avoid SSR/CSR mismatch
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [expected, setExpected] = useState<number | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const isMathCorrect = expected !== null ? Number(mathAnswer) === expected : false;

  useEffect(() => {
    const generateCaptcha = () => {
      const aa = Math.floor(Math.random() * 5) + 1;
      const bb = Math.floor(Math.random() * 5) + 1;
      setA(aa);
      setB(bb);
      setExpected(aa + bb);
    };
    generateCaptcha();
  }, []);

  // Monitor loading state to manage the search lifecycle
  useEffect(() => {
    if (isLoading) {
      setSearchInitiated(true);
    }
  }, [isLoading]);

  // Evaluate results once loading finishes
  useEffect(() => {
    if (!isSearching || !criteria || isLoading || !searchInitiated) return;

    if (registration) {
      // Application found — navigate to status page
      router.push(
        `/fix/status?startup_name=${encodeURIComponent(criteria.startup_name)}&phone=${encodeURIComponent(criteria.phone)}`
      );
    } else if (lookupError) {
      setIsSearching(false);
      setSearchInitiated(false);
    } else {
      // Lookup completed with no result
      setIsSearching(false);
      setSearchInitiated(false);
      setNotFound(true);
    }
  }, [registration, isLoading, isSearching, criteria, router, lookupError, searchInitiated]);

  const handleSearch = () => {
    if (!isMathCorrect) return;
    setNotFound(false);
    setIsSearching(true);
    setSearchInitiated(false); // Reset this so we wait for the next loading cycle
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
    setSearchInitiated(false);
  };

  const isBusy = isSearching || isLoading;

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
        <div className="bg-black p-5 md:p-8 text-white">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 md:mb-2">Check Status</h2>
          <p className="text-white/70 text-xs md:text-base">
            Enter your registered details to track your application.
          </p>
        </div>

        <CardContent className="p-5 md:p-8 space-y-5 md:space-y-8">
          {/* API Error Message */}
          {lookupError && !isLoading && (
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Lookup Failed</p>
                <p className="mt-0.5 text-red-700/80">{lookupError}</p>
              </div>
            </div>
          )}

          {/* Input fields */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fix-status-startup" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Startup Name
              </Label>
              <Input
                id="fix-status-startup"
                value={startupInput}
                onChange={(e) => { setStartupInput(e.target.value); setNotFound(false); }}
                placeholder="e.g. Acme Corp"
                className="h-11 md:h-12 border-zinc-200 focus:border-black focus:ring-black rounded-xl text-sm md:text-base px-4 transition-all"
                disabled={isBusy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fix-status-phone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Phone Number
              </Label>
              <Input
                id="fix-status-phone"
                value={phoneInput}
                onChange={(e) => { setPhoneInput(e.target.value); setNotFound(false); }}
                placeholder="e.g. 9876543210"
                className="h-11 md:h-12 border-zinc-200 focus:border-black focus:ring-black rounded-xl text-sm md:text-base px-4 transition-all"
                disabled={isBusy}
              />
            </div>
          </div>

          {/* Math captcha */}
          <div className="bg-zinc-50 rounded-2xl p-4 md:p-6 border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
            <div className="space-y-0.5">
              <p className="font-bold text-xs md:text-sm uppercase tracking-wider">Security Check</p>
              <p className="text-[10px] md:text-xs text-muted-foreground italic font-medium">Please solve to proceed.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white border border-zinc-200 rounded-xl px-4 py-2 font-mono text-base md:text-lg shadow-sm">
                {a !== null && b !== null ? `${a} + ${b} =` : '…'}
              </div>
              <Input
                id="fix-captcha-answer"
                className="w-20 h-11 md:w-24 md:h-12 border-zinc-200 focus:border-black focus:ring-black rounded-xl text-center text-base md:text-lg font-bold"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="?"
                disabled={isBusy}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button
              id="fix-check-status-btn"
              type="button"
              onClick={handleSearch}
              disabled={!startupInput.trim() || !phoneInput.trim() || !isMathCorrect || isBusy}
              className="w-full sm:w-auto h-14 px-10 bg-black text-white hover:bg-zinc-800 rounded-xl text-lg font-bold shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
            >
              {isBusy ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <Search className="mr-3 h-5 w-5" />
              )}
              {isBusy ? 'Checking...' : 'Check Status'}
            </Button>

            {(notFound || lookupError) && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="text-zinc-500 hover:text-black font-medium"
              >
                Clear and Try Again
              </Button>
            )}
          </div>

          {/* Not-found message */}
          {notFound && !isBusy && !lookupError && (
            <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-6 text-sm text-red-900 animate-in fade-in slide-in-from-top-4 duration-300">
              <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-red-600" />
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-base">Application Not Found</p>
                  <p className="mt-1 text-red-800/80 leading-relaxed">
                    We couldn't find an application matching those details. Please double-check the startup name and phone number you used during registration.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link href="/fix/register" className="inline-flex items-center font-bold text-red-600 hover:underline">
                    Register for FIX now &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <FixContactSupport context="check" />
    </>
  );
}
