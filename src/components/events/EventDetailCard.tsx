
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/hooks/useEvents";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { getEventStatus, formatTime } from '@/lib/utils';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

interface EventDetailCardProps {
  event: Event;
  className?: string;
}

const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true) }, []);
  return hydrated;
};

export function EventDetailCard({ event, className }: EventDetailCardProps) {
  const isHydrated = useHydrated();
  const [shareUrl, setShareUrl] = useState('');
  const isPaidEvent = event.is_paid === true;

  const eventStatus = isHydrated ? getEventStatus(event.event_date, event.start_time, event.end_time) : { text: 'Loading...', variant: 'outline' as const };
  const startTimeFormatted = isHydrated ? formatTime(event.start_time) : '...';
  const endTimeFormatted = isHydrated ? formatTime(event.end_time) : '...';
  const fullDate = new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    if (isHydrated) {
      const eventLocation = event.location?.trim() ? event.location : 'TBA';
      const entryType = isPaidEvent ? 'Paid Entry' : 'Free Entry';
      const shareText = encodeURIComponent(
        `Check out this event on Cedat:\n\n*${event.title}*\n${entryType}\n\n🕒 Time: ${startTimeFormatted} - ${endTimeFormatted}\n📅 Date: ${fullDate}\n📍 Location: ${eventLocation}\n\nFind out more and register:\n${window.location.href}`
      );
      setShareUrl(`https://api.whatsapp.com/send?text=${shareText}`);
    }
  }, [isHydrated, event.title, event.location, fullDate, isPaidEvent, startTimeFormatted, endTimeFormatted]);

  const canRegister = eventStatus.text !== 'Concluded' && !!event.external_registration_url;

  const registrationButton = (
    <Button asChild size="lg" className="w-full min-h-[48px] text-base font-extrabold tracking-[0.02em] shadow-md" disabled={!canRegister}>
      <a href={canRegister ? event.external_registration_url : undefined} target="_blank" rel="noopener noreferrer">
        {canRegister ? (
          <>
            Register Now <ExternalLink className="w-4 h-4 ml-2" />
          </>
        ) : 'Registration Closed'}
      </a>
    </Button>
  );

  return (
    <Card className={`relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-card to-muted/30 shadow-2xl shadow-primary/10 ${className}`}>
      <div className="absolute right-4 top-4 z-10">
        <Image
          src={isPaidEvent ? '/fix/paid.png' : '/fix/free.png'}
          alt={isPaidEvent ? 'Paid Entry' : 'Free Entry'}
          width={92}
          height={56}
          className="h-auto w-[92px] object-contain"
          priority
        />
      </div>

      <CardHeader className="border-b border-border/50 p-5 bg-gradient-to-b from-primary/10 to-transparent">
        <CardTitle>Event Details</CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-3 rounded-xl border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Time</p>
              <p className="text-sm font-semibold text-foreground">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-border/40">
            <Calendar className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Date</p>
              <p className="text-sm font-semibold text-foreground break-words">{fullDate}</p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3 pt-3 border-t border-border/50">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground/90 break-words">{event.location}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
            {registrationButton}
            {isHydrated && canRegister && (
                <Button
                  asChild
                  className="w-full border border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
                >
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="mr-2 h-4 w-4" />
                        Share on WhatsApp
                    </a>
                </Button>
            )}
        </div>
        
        {canRegister && <p className='text-xs text-muted-foreground text-center'>You will be redirected to an external site.</p>}
      </CardContent>
    </Card>
  );
}
