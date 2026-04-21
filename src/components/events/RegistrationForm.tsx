import { useState } from 'react';
import { getImageUrl } from '@/lib/images';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, CheckCircle, QrCode, X, RefreshCw, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { registrationsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface RegistrationFormProps {
  event: {
    id: string;
    title: string;
    event_date: string;
    location?: string;
    calculated_state?: string;
    external_registration_url?: string;
  };
  onRegister: () => void;
  onUnregister?: () => void;
  isRegistering: boolean;
  isUnregistering?: boolean;
  isRegistered: boolean;
  registrationData?: {
    id?: string;
    qr_code: string;
    qr_code_image_url?: string;
  };
  onRegenerateSuccess?: (newUrl: string) => void;
}

export function RegistrationForm({
  event,
  onRegister,
  onUnregister,
  isRegistering,
  isUnregistering = false,
  isRegistered,
  registrationData,
  onRegenerateSuccess
}: RegistrationFormProps) {
  const { toast } = useToast();
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!registrationData?.id || !onRegenerateSuccess) return;
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

  const showRegenerate = Boolean(registrationData?.id && onRegenerateSuccess);

  // Check if registration is allowed based on calculated state
  const canRegister = event.calculated_state === 'registration_open' && !isRegistered;
  const stateMessage = 
    event.calculated_state === 'registration_closed' ? 'Registration for this event has closed.' :
    event.calculated_state === 'ongoing' ? 'This event is currently ongoing.' :
    event.calculated_state === 'concluded' ? 'This event has concluded.' :
    event.calculated_state === 'cancelled' ? 'This event has been cancelled.' :
    event.calculated_state === 'draft' ? 'This event is not yet published.' :
    '';
  const [showQR, setShowQR] = useState(false);

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

  // Show "Already Registered" state when user is registered
  if (isRegistered) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
          </div>
          <CardTitle className="text-green-800 text-lg sm:text-xl">You're Registered!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="text-center space-y-2">
            <p className="text-sm sm:text-base text-green-700 break-words">
              You have successfully registered for <strong>{event.title}</strong>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-600">
              <span className="break-words">{dateInfo.full}</span>
              <span className="hidden sm:inline">•</span>
              <span>{dateInfo.time}</span>
              {event.location && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="break-words">{event.location}</span>
                </>
              )}
            </div>
          </div>

          {registrationData && (
            <>
              <div className="bg-white rounded-lg p-3 sm:p-4 border">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                    <QrCode className="h-4 w-4 flex-shrink-0" />
                    Your QR Code
                  </div>

                  {registrationData.qr_code_image_url ? (
                    <div className="space-y-2 sm:space-y-3">
                      <ImageWithFallback
                        src={registrationData.qr_code_image_url}
                        alt="Registration QR Code"
                        className="mx-auto w-28 h-28 sm:w-32 sm:h-32 border rounded object-cover"
                      />
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-[44px] w-full sm:w-auto"
                          onClick={() => window.open(getImageUrl(registrationData.qr_code_image_url), '_blank')}
                        >
                          Download QR Code
                        </Button>
                        {showRegenerate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[44px] text-muted-foreground"
                            onClick={handleRegenerate}
                            disabled={regenerating}
                          >
                            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            {regenerating ? 'Regenerating…' : 'Regenerate'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p>QR code will be sent to your email shortly.</p>
                      {showRegenerate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerate}
                          disabled={regenerating}
                        >
                          {regenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                          {regenerating ? 'Regenerating…' : 'Regenerate QR Code'}
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground break-all">
                    Code: {registrationData.qr_code}
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>• Bring this QR code to check in at the event</p>
                <p>• A confirmation email has been sent to your registered email</p>
                <p>• You can download your QR code anytime from your dashboard</p>
              </div>
            </>
          )}

          {/* Unregister Button - Only show if event hasn't started */}
          {onUnregister && event.calculated_state !== 'ongoing' && event.calculated_state !== 'concluded' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full min-h-[44px]"
                  disabled={isUnregistering}
                >
                  {isUnregistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Unregistering...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Unregister from Event
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unregister from Event?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your registration for <strong>{event.title}</strong>? 
                    You will lose access to your QR code and will need to register again if you change your mind.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onUnregister}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Unregister
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show message if registration is not available
  if (!canRegister && stateMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Registration Status
            <Badge variant="secondary">Free</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-foreground">{event.title}</h3>

          {/* Details: time, date, location */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">{dateInfo.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-border/60">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground break-words">{dateInfo.full}</p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3 pt-3 border-t border-border/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground ring-1 ring-border/40">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground break-words">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              {stateMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-black/5 ring-1 ring-black/[0.04] dark:ring-white/[0.06] dark:shadow-black/20">
      <div
        className="h-1.5 w-full bg-gradient-to-r from-accent via-primary to-accent/80"
        aria-hidden
      />
      <CardHeader className="relative space-y-0 border-b border-border/50 bg-gradient-to-b from-accent/[0.09] to-transparent px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" aria-hidden />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-sm ring-1 ring-accent/20">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
<CardTitle className="inline-block font-display text-lg font-semibold tracking-tight text-green-600 bg-green-100 px-2 py-0.5 rounded-md sm:text-xl">
  Free Entry
</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
        <h3 className="text-balance text-center font-display text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {event.title}
        </h3>

        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/40 via-background to-accent/[0.07] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:from-muted/25 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-sm ring-1 ring-accent/15">
                <Clock className="h-4 w-4" aria-hidden />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">Time</p>
                <p className="text-sm font-semibold text-foreground sm:text-base">{dateInfo.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-border/40 pt-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-sm ring-1 ring-accent/15">
                <Calendar className="h-4 w-4" aria-hidden />
              </div>
              <div className="flex flex-col items-start flex flex-col items-start min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">Date</p>
                <p className="text-sm font-semibold text-foreground sm:text-base break-words">{dateInfo.full}</p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3 border-t border-border/50 pt-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground ring-1 ring-border/40">
                  <MapPin className="h-4 w-4" aria-hidden />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">Location</p>
                  <p className="text-sm font-medium leading-relaxed text-foreground/90 break-words">
                    {event.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={onRegister}
          disabled={!canRegister || isRegistering}
          className="w-full min-h-[48px] rounded-xl text-base font-semibold shadow-md transition-shadow hover:shadow-lg"
          size="lg"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : canRegister ? (
            'REGISTER NOW'
          ) : (
            'Registration Not Available'
          )}
        </Button>

        {/* <p className="border-t border-border/40 pt-4 text-center text-xs leading-relaxed text-muted-foreground">
          By registering, you agree to receive event-related communications from CEDAT.
        </p> */}
      </CardContent>
    </Card>
  );
}
