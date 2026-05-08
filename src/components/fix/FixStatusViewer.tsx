"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, Clock3, XCircle, RefreshCw, Search, Plus } from 'lucide-react';
import { useFixRegistrationLookup } from '@/hooks/useFixRegistrations';
import { FixContactSupport } from './FixContactSupport';

const statusCopy: Record<string, { title: string; description: string; icon: any }> = {
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

const badgeVariant = (status: string) => {
    if (status === 'approved') return 'default' as const;
    if (status === 'rejected') return 'destructive' as const;
    return 'secondary' as const;
};

export default function FixStatusViewer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const s = searchParams?.get('startup_name') || searchParams?.get('startup');
    const p = searchParams?.get('phone') || '';

    const [captchaA, setCaptchaA] = useState<number | null>(null);
    const [captchaB, setCaptchaB] = useState<number | null>(null);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [expected, setExpected] = useState<number | null>(null);

    const { registration, isLoading, refresh } = useFixRegistrationLookup(s || undefined, p || undefined);

    useEffect(() => {
        // generate a simple math captcha
        const aa = Math.floor(Math.random() * 5) + 1;
        const bb = Math.floor(Math.random() * 5) + 1;
        setCaptchaA(aa);
        setCaptchaB(bb);
        setExpected(aa + bb);
        setCaptchaAnswer('');
    }, []);

    const isCaptchaCorrect = expected !== null ? Number(captchaAnswer) === expected : false;

    const handleRefresh = async () => {
        if (!s) return;
        await refresh?.();
        // rotate captcha
        const aa = Math.floor(Math.random() * 5) + 1;
        const bb = Math.floor(Math.random() * 5) + 1;
        setCaptchaA(aa);
        setCaptchaB(bb);
        setExpected(aa + bb);
        setCaptchaAnswer('');
    };

    const currentStatus = registration?.status;
    const statusMeta = currentStatus ? statusCopy[currentStatus] : null;
    const StatusIcon = statusMeta?.icon;

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {isLoading && !registration && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-pulse">
                    <Loader2 className="h-12 w-12 text-zinc-300 animate-spin" />
                    <p className="text-zinc-500 font-medium">Fetching your application status...</p>
                </div>
            )}

            {!s && !isLoading && (
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-zinc-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">No Details Provided</h2>
                        <p className="text-muted-foreground mt-2">We need your startup name and phone to show the status.</p>
                    </div>
                    <Button onClick={() => router.push('/fix/check')} className="bg-black text-white px-8 h-12 rounded-xl font-bold">
                        Go to Status Checker
                    </Button>
                </Card>
            )}

            {s && !registration && !isLoading && (
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-red-900">Application Not Found</h2>
                        <p className="text-red-800/60 mt-2 max-w-sm mx-auto">
                            We couldn't find an application for "{s}". Please ensure you're using the registered details.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Button variant="outline" onClick={() => router.push('/fix/check')} className="h-12 rounded-xl font-bold px-8">
                            Try Again
                        </Button>
                        <Button onClick={() => router.push('/fix/register')} className="bg-black text-white h-12 rounded-xl font-bold px-8">
                            Register for FIX
                        </Button>
                    </div>
                </Card>
            )}

            {registration && statusMeta && StatusIcon && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Optimistic Message */}
                    {registration.id === null && registration.status === 'pending' && (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-emerald-900 flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-sm">Submission Received!</p>
                                <p className="text-xs text-emerald-800/70 mt-0.5">Your application is recorded locally and is currently being processed.</p>
                            </div>
                        </div>
                    )}

                    {/* Main Status Card */}
                    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                        <div className={`p-6 md:p-8 text-center space-y-4 ${
                            registration.status === 'approved' ? 'bg-emerald-50/30' : 
                            registration.status === 'rejected' ? 'bg-red-50/30' : 'bg-zinc-50/50'
                        }`}>
                            <div className={`mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-inner ${
                                registration.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                                registration.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-white text-zinc-400'
                            }`}>
                                <StatusIcon className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            
                            <div className="space-y-1">
                                <Badge variant={badgeVariant(registration.status)} className="h-6 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1">
                                    {registration.status}
                                </Badge>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 italic">
                                    {statusMeta.title}
                                </h1>
                                <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed">
                                    {statusMeta.description}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 md:p-8 border-t border-zinc-100 bg-white">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center group">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Applicant</p>
                                    <p className="text-sm font-black text-zinc-900 italic uppercase">{registration.name}</p>
                                </div>
                                <div className="h-px bg-zinc-50 w-full" />
                                <div className="flex justify-between items-center group">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Startup</p>
                                    <p className="text-sm font-black text-zinc-900 italic uppercase">{registration.startup_name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-50 p-6 border-t border-zinc-100">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="space-y-0.5 text-center md:text-left">
                                    <p className="text-sm font-bold text-zinc-900">Need an update?</p>
                                    <p className="text-xs text-zinc-500">Solve to refresh status.</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <div className="bg-white border border-zinc-200 rounded-lg px-3 py-1.5 font-mono font-bold text-sm shadow-sm">
                                        {captchaA} + {captchaB} =
                                    </div>
                                    <input
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="w-16 h-9 border border-zinc-200 rounded-lg px-2 text-center text-base font-bold focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                        placeholder="?"
                                    />
                                    <Button 
                                        onClick={handleRefresh} 
                                        disabled={!isCaptchaCorrect || isLoading} 
                                        className="h-9 rounded-lg bg-black text-white px-4 text-sm font-bold shadow-lg shadow-black/5"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                        <Button
                            variant="default"
                            className="bg-primary text-white font-bold h-11 px-6 rounded-xl w-full sm:w-auto"
                            onClick={() => router.push('/fix/check')}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Check Another Status
                        </Button>
                        <Button
                            variant="outline"
                            className="text-zinc-500 hover:text-black font-bold h-11 px-6 rounded-xl w-full sm:w-auto"
                            onClick={() => {
                                if (window.confirm('This will clear your current view. You can always check it again using your startup name and phone number. Continue to new application?')) {
                                    // Clear cache to bypass register redirect
                                    Object.keys(localStorage).forEach(k => {
                                        if (k.startsWith('fix_status_cache:')) localStorage.removeItem(k);
                                    });
                                    router.push('/fix/register');
                                }
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Submit Another Application
                        </Button>
                    </div>
                </div>
            )}

            <FixContactSupport registration={registration} context="status" />
        </div>
    );
}
