"use client";

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useState, useEffect } from 'react';
import { getEventStatus, formatTime } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true) }, []);
  return hydrated;
};

export function EventCard({ event }: EventCardProps) {
  const isHydrated = useHydrated();
  const isPaidEvent = event.is_paid === true;

  const eventStatus = isHydrated
    ? getEventStatus(event.event_date, event.start_time, event.end_time)
    : { text: 'Loading...', variant: 'outline' as const };

  const startTimeFormatted = formatTime(event.start_time);

  const dateInfo = {
    day: new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric' }),
    month: new Date(event.event_date).toLocaleDateString('en-US', { month: 'long' }),
    full: new Date(event.event_date).toLocaleDateString('en-US', {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    })
  };

  const canRegister = eventStatus.text !== 'Concluded';

  // ✅ Share logic
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isHydrated && event.slug) {
      const eventLink = `${window.location.origin}/events/${event.slug}`;
      const shareText = encodeURIComponent(
        `Check out this event:\n\n*${event.title}*\n📅 ${dateInfo.full}\n🕒 ${startTimeFormatted}\n\n${eventLink}`
      );
      setShareUrl(`https://api.whatsapp.com/send?text=${shareText}`);
    }
  }, [isHydrated, event.slug, event.title, dateInfo.full, startTimeFormatted]);

  return (
    <div className="h-full">
      <Link href={event.slug ? `/events/${event.slug}` : '#'} className={`${!event.slug ? 'pointer-events-none' : ''}`}>
        <Card className="group relative bg-card rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col min-h-0">

          {/* 🔗 CLICKABLE CONTENT */}

          {/* TOP + IMAGE */}
          <div className="bg-muted relative overflow-hidden">

            {/* ✅ TOP INFO BAR */}
            <div className="relative px-3 sm:px-4 py-2 bg-black text-white flex items-center justify-between">

              {/* Left - Status */}
              <span className="text-[10px] sm:text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                {eventStatus.text}
              </span>

              {/* Center - Paid / Free IMAGE */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <ImageWithFallback
                  src={isPaidEvent ? '/fix/paid.png' : '/fix/free.png'}
                  alt={isPaidEvent ? 'Paid Entry' : 'Free Entry'}
                  width={70}
                  height={20}
                  className="object-contain"
                />
              </div>

              {/* Right - Date */}
              <span className="text-[10px] sm:text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                {dateInfo.month} {dateInfo.day}
              </span>
            </div>

            {/* ✅ IMAGE */}
            <div className="aspect-square relative overflow-hidden">
              {event.featured_image_url ? (
                <ImageWithFallback
                  src={event.featured_image_url}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

          </div>

          {/* TEXT CONTENT */}
          <div className="p-4 sm:p-6 flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-x-1 md:gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dateInfo.full}
              </span>
              <span>|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {isHydrated ? startTimeFormatted : ''}
              </span>
              {event.location && (
                <>
                  <span>|</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold line-clamp-2">
              {event.title}
            </h3>

            {event.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {event.description}
              </p>
            )}
          </div>


          {/* 🔥 BUTTONS (OUTSIDE LINK) */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex gap-2 w-full">

              {/* Share */}
              {isHydrated && canRegister && (
                <button
                  type="button"
                  onClick={() => shareUrl && window.open(shareUrl, '_blank', 'noopener,noreferrer')}
                  className="flex-1"
                  aria-label="Share on WhatsApp"
                  disabled={!shareUrl}
                >
                  <span className={`w-full h-11 rounded-full text-white text-sm font-semibold inline-flex items-center justify-center transition ${shareUrl ? 'bg-primary hover:bg-green-600' : 'bg-primary/50 cursor-not-allowed'}`}>
                    Share on WhatsApp
                  </span>
                </button>
              )}

              {/* Register */}
              <button
                disabled={!canRegister}
                className={`flex-1 h-11 rounded-full text-sm font-bold border-2 transition-all 
                ${!canRegister
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-black border-slate-200 text-white hover:bg-primary'
                  }`}
              >
                {!canRegister ? 'Registration Closed' : 'Register Now'}
              </button>

            </div>
          </div>

        </Card>
      </Link>
    </div>
  );
}