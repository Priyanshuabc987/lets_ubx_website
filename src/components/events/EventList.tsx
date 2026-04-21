
"use client";

import { useState } from 'react';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChevronDown } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { isPast, parseISO } from 'date-fns';

interface EventListProps {
  statusFilter?: string;
  showStatusFilter?: boolean;
  className?: string;
  limit?: number; // Used for initial load limit on home page, for example
}

export function EventList({ statusFilter, showStatusFilter = false, className = "", limit: initialLimit }: EventListProps) {
  const ALL_VALUE = '__all__';
  const [selectedStatus, setSelectedStatus] = useState(statusFilter || ALL_VALUE);

  const queryStatus = selectedStatus !== ALL_VALUE ? selectedStatus : undefined;

  
  
  const { 
    events, 
    loadMore, 
    hasMore, 
    isLoading, 
    isLoadingMore, 
    error 
  } = useEvents({ 
    status_filter: queryStatus,
    // If an initialLimit is provided, we use it for the first page.
    // The hook will then use the default PAGE_SIZE for subsequent pages.
    pageSize: initialLimit || undefined
  });


  // Client-side sorting for all loaded events
  const sortedEvents = [...events].sort((a, b) => {
    return parseISO(a.event_date).getTime() - parseISO(b.event_date).getTime();
  });
  
  
  // The component no longer needs to manage its own `limit` state for display, 
  // as the hook now handles fetching the correct number of items.

  if (isLoading && events.length === 0) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-center py-12"><p className="text-destructive">Failed to load events.</p></div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-12"><p className="text-muted-foreground">No events found.</p></div>;
  }

  return (
    <div className={className}>
      {showStatusFilter && (
        <div className="mb-4 sm:mb-6">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48 min-h-[44px] rounded-full"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All Events</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 items-stretch">
        {sortedEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>

      {/* Show button only if there are more items to load and no initial limit was set */}
      {hasMore && !initialLimit && (
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
