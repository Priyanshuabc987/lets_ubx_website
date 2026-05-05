"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, Clock3, XCircle } from 'lucide-react';
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
        <div className="mx-auto max-w-3xl">
            {!registration && !isLoading && (
                <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    No cached application found for the provided startup and phone. Use the checker to look up a
                    submission.
                    <div className="mt-2">
                        <Button variant="link" onClick={() => router.push('/fix/check')}>Check application</Button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking your application...
                </div>
            )}

            {registration && statusMeta && StatusIcon && (
                <div className="space-y-4">
                    <div className="rounded-sm border border-border/60 bg-muted/30 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60">
                                <StatusIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground">{statusMeta.title}</p>
                                    <Badge>{registration.status}</Badge>
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

                    <div className="rounded-sm border border-border/60 bg-white px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium">Prove you're human</label>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="rounded border border-border/60 bg-muted/10 px-3 py-2">
                                        {captchaA} + {captchaB} =
                                    </div>
                                    <input
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="input border border-black bg-background rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-2">
                                <Button onClick={handleRefresh} disabled={!isCaptchaCorrect}>
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Small message at the bottom */}
                        <div className="mt-4 text-xs text-muted-foreground">
                            <p>To get the latest status of your application, fill the answer and click refresh.</p>
                            <p className="mt-1 font-medium text-red-500">This is required to secure your application.</p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            variant="default"
                            className="bg-black"
                            onClick={() => router.push('/fix/check')}
                        >
                            Check another status
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
