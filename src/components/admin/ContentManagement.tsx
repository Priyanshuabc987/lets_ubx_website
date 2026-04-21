import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdminEventsHeading, useAdminEventsSubheading, useUpdateEventsHeading, useUpdateEventsSubheading } from '@/hooks/useContentSettings';

export function ContentManagement() {
  const { toast } = useToast();
  const { data: headingData, isLoading: isHeadingLoading } = useAdminEventsHeading(true);
  const { data: subheadingData, isLoading: isSubheadingLoading } = useAdminEventsSubheading(true);
  const updateHeadingMutation = useUpdateEventsHeading();
  const updateSubheadingMutation = useUpdateEventsSubheading();
  const [headingValue, setHeadingValue] = useState('');
  const [subheadingValue, setSubheadingValue] = useState('');

  useEffect(() => {
    if (typeof headingData === 'string') {
      setHeadingValue(headingData);
    }
    if (typeof subheadingData === 'string') {
      setSubheadingValue(subheadingData);
    }
  }, [headingData, subheadingData]);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 break-words">Page Content</h1>
        <p className="text-sm sm:text-base text-muted-foreground break-words">
          Update page-specific text from admin. Changes here affect only the Events page heading and subheading.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Events Page Heading &amp; Subheading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="events-heading">
              Events Page Heading
            </label>
            <Textarea
              id="events-heading"
              value={headingValue}
              onChange={(e) => setHeadingValue(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Startup Ecosystem Meetups & Events"
              disabled={isHeadingLoading || updateHeadingMutation.isPending}
            />
            <div className="text-xs text-muted-foreground">{headingValue.length}/300</div>
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  const trimmed = headingValue.trim();
                  if (!trimmed) {
                    toast({ title: 'Heading is required', variant: 'destructive' });
                    return;
                  }
                  try {
                    await updateHeadingMutation.mutateAsync(trimmed);
                    toast({ title: 'Events heading updated' });
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : 'Update failed';
                    toast({ title: 'Update failed', description: msg, variant: 'destructive' });
                  }
                }}
                disabled={isHeadingLoading || updateHeadingMutation.isPending}
              >
                {updateHeadingMutation.isPending ? 'Saving...' : 'Save Heading'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setHeadingValue(headingData || 'Startup Ecosystem Meetups & Events')}
                disabled={isHeadingLoading || updateHeadingMutation.isPending}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border/60">
            <label className="text-sm font-medium text-foreground" htmlFor="events-subheading">
              Events Page Subheading
            </label>
            <Textarea
              id="events-subheading"
              value={subheadingValue}
              onChange={(e) => setSubheadingValue(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Dynamic Ecosystem of Nexus Communities"
              disabled={isSubheadingLoading || updateSubheadingMutation.isPending}
            />
            <div className="text-xs text-muted-foreground">{subheadingValue.length}/300</div>

            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  const trimmed = subheadingValue.trim();
                  if (!trimmed) {
                    toast({ title: 'Subheading is required', variant: 'destructive' });
                    return;
                  }
                  try {
                    await updateSubheadingMutation.mutateAsync(trimmed);
                    toast({ title: 'Events subheading updated' });
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : 'Update failed';
                    toast({ title: 'Update failed', description: msg, variant: 'destructive' });
                  }
                }}
                disabled={isSubheadingLoading || updateSubheadingMutation.isPending}
              >
                {updateSubheadingMutation.isPending ? 'Saving...' : 'Save Subheading'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSubheadingValue(subheadingData || 'Dynamic Ecosystem of Nexus Communities')}
                disabled={isSubheadingLoading || updateSubheadingMutation.isPending}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
