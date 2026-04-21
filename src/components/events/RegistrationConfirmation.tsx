import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, QrCode, Calendar, MapPin, Download, X, Loader2, RefreshCw, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '@/lib/images';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { MemberBadge } from '@/components/members/MemberBadge';
import { motion as motionTokens } from '@/lib/design-tokens';
import { registrationsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface RegistrationConfirmationProps {
  event: {
    id: string;
    title: string;
    event_date: string;
    location?: string;
  };
  registrationData: {
    id?: string;
    qr_code?: string | null;
    qr_code_image_url?: string | null;
    member_role?: string;
    attendance_status?: string;
  };
  onClose?: () => void;
  calendarUrl?: string;
  onRegenerateSuccess?: (newUrl: string) => void;
}

export function RegistrationConfirmation({
  event,
  registrationData,
  onClose,
  calendarUrl,
  onRegenerateSuccess
}: RegistrationConfirmationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRegenerate = async () => {
    if (!registrationData.id || !onRegenerateSuccess) return;
    setRegenerating(true);
    try {
      const res = await registrationsAPI.regenerateQR(registrationData.id);
      const data = await res.json();
      const url = data?.qr_code_image_url;
      if (url) onRegenerateSuccess(url);
      toast({ title: 'QR code regenerated' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Please try again';
      toast({ title: 'Could not regenerate QR', description: msg, variant: 'destructive' });
    } finally {
      setRegenerating(false);
    }
  };

  const isPending = registrationData.attendance_status === 'pending_approval' || !registrationData.qr_code;
  const showRegenerate = Boolean(registrationData.id && onRegenerateSuccess && !isPending);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const dateInfo = formatDate(event.event_date);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionTokens.normal / 1000, ease: motionTokens.easing.easeInOut as any }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: motionTokens.normal / 1000, ease: motionTokens.easing.easeOut as any }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-background rounded-xl sm:rounded-2xl shadow-2xl"
        >
          <Card className="border-0 shadow-none">
            <CardContent className="p-4 sm:p-6 md:p-8">
              {onClose && (
                <div className="flex justify-end mb-3 sm:mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full min-w-[44px] min-h-[44px]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              )}

              {showConfetti && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="text-6xl">🎉</div>
                </motion.div>
              )}

              <div className="flex justify-center mb-4 sm:mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1 
                  }}
                >
                  {isPending ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-amber-600 dark:text-amber-400" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="text-center space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-tight break-words px-2">
                  {isPending ? "Your registration is pending approval" : "You're Officially Part of This CEDAT Event"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  {isPending ? (
                    <>Your registration request for <strong className="break-words">{event.title}</strong> has been submitted and is being reviewed.</>
                  ) : (
                    <>Your registration for <strong className="break-words">{event.title}</strong> has been confirmed.</>
                  )}
                </p>
                {!isPending && (
                  <div className="flex justify-center">
                    <MemberBadge type="participant" />
                  </div>
                )}
              </div>

              <Card className="mb-4 sm:mb-6 bg-muted/50">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                      <span className="break-words">{dateInfo.full}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <span>🕒 {dateInfo.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="break-words">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isPending ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <p className="text-center text-sm sm:text-base text-muted-foreground">
                    You will receive your QR code by email once your registration is approved.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-muted-foreground/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                      <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Your Event QR Code
                    </div>

                    {registrationData.qr_code_image_url ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: motionTokens.normal / 1000 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <ImageWithFallback
                          src={registrationData.qr_code_image_url}
                          alt="Event Registration QR Code"
                          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-muted rounded-lg shadow-lg object-cover"
                        />
                        {showRegenerate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="text-muted-foreground"
                          >
                            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            {regenerating ? 'Regenerating…' : 'QR not loading? Regenerate'}
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-muted-foreground space-y-3">
                        <QrCode className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                        <p className="text-xs sm:text-sm">QR Code loading...</p>
                        {showRegenerate && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegenerate}
                            disabled={regenerating}
                          >
                            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            {regenerating ? 'Regenerating…' : 'Regenerate QR Code'}
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="pt-1 sm:pt-2">
                      <Badge variant="outline" className="font-mono text-[10px] sm:text-xs break-all">
                        {registrationData.qr_code ?? ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {calendarUrl && (
                  <Button
                    size="lg"
                    className="w-full min-h-[44px]"
                    asChild
                  >
                    <a href={calendarUrl} download>
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      Add to Calendar
                    </a>
                  </Button>
                )}

                {registrationData.qr_code_image_url && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-h-[44px]"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = getImageUrl(registrationData.qr_code_image_url!);
                      link.download = `cedat-qr-${event.title.replace(/\s+/g, '-').toLowerCase()}.png`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                    Download QR Code
                  </Button>
                )}

                <div className="pt-2 sm:pt-4">
                  {user?.profile_slug ? (
                    <Link href={`/member/${user.profile_slug}`}>
                      <Button variant="ghost" className="w-full min-h-[44px]">
                        View Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/">
                      <Button variant="ghost" className="w-full min-h-[44px]">
                        Go to Home
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                    What&apos;s Next?
                  </h4>
                  {isPending ? (
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      You will receive an email with your QR code once your registration is approved.
                    </p>
                  ) : (
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Bring this QR code to check in at the event</li>
                      <li>• A confirmation email has been sent to your registered email</li>
                      <li>• You can access your QR code anytime from your dashboard</li>
                      <li>• Add this event to your calendar to never miss it</li>
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
