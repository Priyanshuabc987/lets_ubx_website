
"use client";

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useState, useEffect } from 'react';
// 1. IMPORT new utility functions
import { getEventStatus, formatTime } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

// This hook remains for client-side rendering
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true) }, []);
  return hydrated;
};

export function EventCard({ event }: EventCardProps) {
  const isHydrated = useHydrated();

  // 2. USE the new, centralized utility functions
  const eventStatus = isHydrated 
    ? getEventStatus(event.event_date, event.start_time, event.end_time) 
    : { text: 'Loading...', variant: 'outline' as const }; // Use 'as const' for type safety
  
  const startTimeFormatted = formatTime(event.start_time);
  const endTimeFormatted = formatTime(event.end_time);

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

  return (
    <div className="h-full">
      <Link href={event.slug ? `/events/${event.slug}`: '#'} className={`block h-full ${!event.slug ? 'pointer-events-none' : ''}`}>
        <Card className="group relative bg-card rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col min-h-0">
          <div className="aspect-square bg-muted relative overflow-hidden">
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

            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
              {/* 3. FIX: The variant is now type-safe and correct */}
              <Badge variant={eventStatus.variant} className="text-[10px] sm:text-xs whitespace-nowrap w-fit shadow-md border-none">
                {eventStatus.text}
              </Badge>
            </div>

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-background/90 backdrop-blur text-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
              {dateInfo.month} {dateInfo.day}
            </div>
          </div>

          <div className="p-4 sm:p-6 flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-x-1 md:gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{dateInfo.full}</span>
              </span>
              <span className="hidden sm:inline text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                {/* 4. FIX: Time is now correctly formatted to AM/PM */}
                <span className="truncate">
                  {isHydrated ? `${startTimeFormatted}` : <span>&nbsp;</span>}
                </span>
              </span>
              {event.location && (
                <>
                  <span className="hidden sm:inline text-muted-foreground/50">•</span>
                  <span className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.na5 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                </>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-display font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>

            {event.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {event.description}
              </p>
            )}

            <div className="mt-auto pt-4 text-right">
               <p 
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all 
                  ${!canRegister 
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-70' 
                    : 'bg-black border-slate-200 text-white group-hover:bg-primary group-hover:border-primary group-hover:underline'                  
                  }`}
              >
                {!canRegister ? (
                  <>Registration Closed <span className="ml-1">✕</span></>
                ) : (
                  <>Register Now <span className="ml-1">→</span></>
                )}
              </p>
            </div>

          </div>
        </Card>
      </Link>
    </div>
  );
}
