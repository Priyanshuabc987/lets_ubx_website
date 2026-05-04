import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useHomeContentSettings,
  useUpdateHomeContentSettings,
} from '@/hooks/useContentSettings';
import {
  DEFAULT_HOME_DESCRIPTION,
  DEFAULT_HOME_TITLE,
} from '@/lib/home-content';

export function ContentManagement() {
  const { toast } = useToast();
  const { data: homeContent, isLoading } = useHomeContentSettings();
  const updateHomeContentMutation = useUpdateHomeContentSettings();
  const [headingValue, setHeadingValue] = useState('');
  const [subheadingValue, setSubheadingValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;
    setHeadingValue(homeContent.title);
    setSubheadingValue(homeContent.description);
    setHasInitialized(true);
  }, [hasInitialized, homeContent.description, homeContent.title]);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 break-words">Page Content</h1>
        <p className="text-sm sm:text-base text-muted-foreground break-words">
          Update the home page events section title and description. These values are saved in the `settings/home` document.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home Page Events Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="home-title">
              Section Title
            </label>
            <Textarea
              id="home-title"
              value={headingValue}
              onChange={(e) => setHeadingValue(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder={DEFAULT_HOME_TITLE}
              disabled={isLoading || updateHomeContentMutation.isPending}
            />
            <div className="text-xs text-muted-foreground">{headingValue.length}/300</div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border/60">
            <label className="text-sm font-medium text-foreground" htmlFor="home-description">
              Section Description
            </label>
            <Textarea
              id="home-description"
              value={subheadingValue}
              onChange={(e) => setSubheadingValue(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder={DEFAULT_HOME_DESCRIPTION}
              disabled={isLoading || updateHomeContentMutation.isPending}
            />
            <div className="text-xs text-muted-foreground">{subheadingValue.length}/300</div>

            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  const trimmedTitle = headingValue.trim();
                  const trimmedDescription = subheadingValue.trim();

                  if (!trimmedTitle) {
                    toast({ title: 'Title is required', variant: 'destructive' });
                    return;
                  }

                  if (!trimmedDescription) {
                    toast({ title: 'Description is required', variant: 'destructive' });
                    return;
                  }

                  try {
                    await updateHomeContentMutation.mutateAsync({
                      title: trimmedTitle,
                      description: trimmedDescription,
                    });
                    toast({ title: 'Home page content updated' });
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : 'Update failed';
                    toast({ title: 'Update failed', description: msg, variant: 'destructive' });
                  }
                }}
                disabled={isLoading || updateHomeContentMutation.isPending}
              >
                {updateHomeContentMutation.isPending ? 'Saving...' : 'Save Content'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setHeadingValue(homeContent.title || DEFAULT_HOME_TITLE);
                  setSubheadingValue(homeContent.description || DEFAULT_HOME_DESCRIPTION);
                }}
                disabled={isLoading || updateHomeContentMutation.isPending}
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
