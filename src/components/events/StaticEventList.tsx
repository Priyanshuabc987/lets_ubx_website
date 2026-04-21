
import { Event } from "@/hooks/useEvents";
import { EventCard } from "./EventCard";

interface StaticEventListProps {
  events: Event[];
}

/**
 * A simple, static component to display a grid of events.
 * It does not fetch data or have any side effects.
 */
export function StaticEventList({ events }: StaticEventListProps) {
  return (
    // Add max-w-7xl (or similar) to prevent the cards from stretching too wide
    <div className="max-w-6xl"> 
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

