"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Clock3, XCircle, RefreshCw, Search } from 'lucide-react';
import { useFixRegistrationLookup } from '@/hooks/useFixRegistrations';

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
        <div className="mx-auto max-w-3xl space-y-4">
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking your application…
                </div>
            )}

            {!s && !isLoading && (
                <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    No application details provided.
                    <div className="mt-2">
                        <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/fix/check')}>
                            <Search className="mr-1 h-3 w-3" /> Check application status
                        </Button>
                    </div>
                </div>
            )}

            {s && !registration && !isLoading && (
                <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    No application found for the provided startup and phone number. Please check your details.
                    <div className="mt-2">
                        <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/fix/check')}>
                            <Search className="mr-1 h-3 w-3" /> Try checking again
                        </Button>
                    </div>
                </div>
            )}

            {registration && statusMeta && StatusIcon && (
                <div className="space-y-4">
                    {/* If this is an optimistic cached submission (id === null) show a thank-you message */}
                    {registration.id === null && registration.status === 'pending' && (
                        <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                            <p className="font-semibold">Thank you — your application was received.</p>
                            <p className="text-sm">We've recorded your submission and it's now pending review.</p>
                        </div>
                    )}

                    <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-4">
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
                                {/* Only show safe public fields: name, startup_name, status */}
                                <div className="mt-3 text-sm">
                                    <div><span className="font-semibold">Name:</span> {registration.name}</div>
                                    <div><span className="font-semibold">Startup:</span> {registration.startup_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-sm border border-border/60 bg-white px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium">Prove you're human to refresh</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="rounded border border-border/60 bg-muted/10 px-3 py-2 text-sm">
                                        {captchaA} + {captchaB} =
                                    </div>
                                    <input
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="input border border-black bg-background rounded px-3 py-2 w-20"
                                        placeholder="?"
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-2">
                                <Button onClick={handleRefresh} disabled={!isCaptchaCorrect} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh Status
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                            <p>To get the latest status of your application, fill the answer and click refresh.</p>
                            <p className="mt-1 font-medium text-red-500">This is required to secure your application.</p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            id="fix-check-another-btn"
                            variant="default"
                            className="bg-black"
                            onClick={() => router.push('/fix/check')}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Check Another Application
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
