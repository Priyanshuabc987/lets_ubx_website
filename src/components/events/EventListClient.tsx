
"use client";

import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import { useEvents, Event } from '@/hooks/useEvents';
import { parseISO } from 'date-fns';

interface EventListClientProps {
  initialEvents: Event[];
  statusFilter: string;
}

// This component handles the client-side display and interaction for the event list.
export function EventListClient({ initialEvents, statusFilter }: EventListClientProps) {
  
  const { 
    events, 
    loadMore, 
    hasMore, 
    isLoading, 
    isLoadingMore, 
    error 
  } = useEvents({
    status_filter: statusFilter,
    initialData: initialEvents,
    pageSize: 6,
    // Prevent automatic re-fetching by making server data permanently fresh
    staleTime: Infinity,
  });

  const sortedEvents = [...events].sort((a, b) => {
    // Basic guard against invalid dates
    if (!a.event_date || !b.event_date) return 0;
    try {
      return parseISO(a.event_date).getTime() - parseISO(b.event_date).getTime();
    } catch (e) {
      return 0;
    }
  });
  
  if (isLoading && sortedEvents.length === 0) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-center py-12"><p className="text-destructive">Failed to load events.</p></div>;
  }

  if (sortedEvents.length === 0) {
    return <div className="text-center py-12"><p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p></div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 items-stretch">
        {sortedEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => loadMore()} disabled={isLoadingMore} className="min-h-[44px] px-8 rounded-full">
            {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
