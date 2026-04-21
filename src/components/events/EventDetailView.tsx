
"use client";

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { EventDetailCard } from './EventDetailCard'; // <-- Import the new component

interface EventDetailViewProps {
  event: Event;
  layout?: 'default' | 'centered';
  children?: ReactNode;
}

// Helper to linkify text content
function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">{part}</a>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function EventDetailView({ event, layout = 'default' }: EventDetailViewProps) {
  const featuredImageUrl = event.featured_image_url;

  if (layout === 'centered') {
    return (
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
        {/* Left Column */}
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col items-center text-center space-y-8 lg:items-start lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold break-words leading-tight">
              {event.title}
            </h1>
            <div className="relative aspect-[4/4] w-full max-w-lg mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-muted lg:mx-0">
              {featuredImageUrl ? (
                <ImageWithFallback src={featuredImageUrl} alt={event.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                  <Calendar className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* --- Mobile & Tablet Card --- */}
          {/* This instance is shown on small screens and hidden on large screens */}
          <div className="block lg:hidden">
             <EventDetailCard event={event} />
          </div>

          {/* About This Event Section */}
          {event.description && (
            <Card className="w-full text-left border-0 shadow-none bg-transparent">
              <CardHeader className='px-0'>
                <CardTitle className="text-2xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent className='px-0'>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{linkifyText(paragraph)}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* --- Desktop Card (Sticky) --- */}
        {/* This instance is hidden on small screens and shown as a sticky element on large screens */}
        <div className="hidden lg:block lg:sticky lg:top-24">
            <EventDetailCard event={event} />
        </div>
      </div>
    );
  }

  return <div>Default layout not implemented</div>;
}
