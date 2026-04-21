import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, QrCode, Calendar, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { MemberBadge } from '@/components/members/MemberBadge';
import { motion } from 'framer-motion';
import { motion as motionTokens } from '@/lib/design-tokens';
import { registrationsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  qrCode?: string | null;
  qrCodeImageUrl?: string | null;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  registrationDate: string;
  memberRole?: string;  // Community role for role-based badge display
  onDownload?: () => void;
  registrationId?: string;
  onRegenerateSuccess?: () => void;
}

export function QRCodeDisplay({
  qrCode,
  qrCodeImageUrl,
  eventTitle,
  eventDate,
  eventLocation,
  registrationDate,
  memberRole,
  onDownload,
  registrationId,
  onRegenerateSuccess
}: QRCodeDisplayProps) {
  const { toast } = useToast();
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!registrationId || !onRegenerateSuccess) return;
    setRegenerating(true);
    try {
      const res = await registrationsAPI.regenerateQR(registrationId);
      const _data = await res.json();
      toast({ title: 'QR code regenerated' });
      onRegenerateSuccess();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Please try again';
      toast({ title: 'Could not regenerate QR', description: msg, variant: 'destructive' });
    } finally {
      setRegenerating(false);
    }
  };

  const isPending = !qrCode;
  const showRegenerate = Boolean(registrationId && onRegenerateSuccess && !isPending);

  // Get role badge text
  const getRoleBadgeText = (role?: string) => {
    if (!role) return null;
    if (role === "Student") return "Student Track";
    if (role === "Investor") return "Investor";
    if (role === "Startup Founder") return "Founder";
    return role;
  };

  const roleBadgeText = getRoleBadgeText(memberRole);
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

  const eventDateInfo = formatDate(eventDate);
  const registrationDateInfo = formatDate(registrationDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: motionTokens.normal / 1000, 
        ease: motionTokens.easing.easeOut
      }}
    >
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="flex items-center justify-center gap-2 text-base sm:text-lg">
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            Your Event QR Code
          </CardTitle>
          <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
            <MemberBadge type="participant" />
            {roleBadgeText && (
              <Badge variant="outline" className="text-xs">
                {roleBadgeText}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
        {/* Event Details */}
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-sm sm:text-base break-words">{eventTitle}</h3>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="break-words">{eventDateInfo.full}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span>🕒 {eventDateInfo.time}</span>
            </div>
            {eventLocation && (
              <div className="flex items-center justify-center gap-1 flex-wrap">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="break-words">{eventLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* QR Code or Pending */}
        <div className="bg-white border-2 border-dashed border-muted-foreground/20 rounded-lg p-3 sm:p-4">
          {isPending ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <p className="text-xs sm:text-sm">Your registration is pending approval. You will receive your QR code by email once approved.</p>
            </div>
          ) : qrCodeImageUrl ? (
            <div className="text-center space-y-3">
              <ImageWithFallback
                src={qrCodeImageUrl}
                alt="Event Registration QR Code"
                className="mx-auto w-40 h-40 sm:w-48 sm:h-48 border rounded object-cover"
              />
              <div className="space-y-2 flex flex-col items-center gap-2">
                {onDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    className="w-full min-h-[44px]"
                  >
                    <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                    Download QR Code
                  </Button>
                )}
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
              </div>
            </div>
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
                  {regenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  {regenerating ? 'Regenerating…' : 'Regenerate QR Code'}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Registration Info */}
        <div className="space-y-2 text-xs text-muted-foreground">
          {!isPending && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span>Registration Code:</span>
              <Badge variant="outline" className="font-mono text-xs break-all sm:break-normal">
                {qrCode ?? ''}
              </Badge>
            </div>
          )}
          {isPending && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span>Status:</span>
              <span className="break-words">Pending approval</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span>Registered on:</span>
            <span className="break-words">{registrationDateInfo.full}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-blue-900 text-xs sm:text-sm mb-2">Check-in Instructions:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Show this QR code at event check-in</li>
            <li>• Keep this code safe and accessible</li>
            <li>• One code per person for this event</li>
          </ul>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
