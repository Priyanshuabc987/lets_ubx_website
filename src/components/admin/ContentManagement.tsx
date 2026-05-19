import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  useHomeContentSettings,
  useUpdateHomeContentSettings,
} from '@/hooks/useContentSettings';
import {
  DEFAULT_HOME_DESCRIPTION,
  DEFAULT_HOME_TITLE,
  DEFAULT_UBX_UNITE_TITLE,
  DEFAULT_UBX_UNITE_DESCRIPTION,
  DEFAULT_UBX_UNITE_CARDS,
  DEFAULT_UBX_BUILD_TITLE,
  DEFAULT_UBX_BUILD_DESCRIPTION,
  DEFAULT_UBX_BUILD_CARDS,
  DEFAULT_UBX_XPLORE_TITLE,
  DEFAULT_UBX_XPLORE_DESCRIPTION,
  DEFAULT_UBX_XPLORE_CARDS,
  DEFAULT_SOCIAL_TITLE,
  DEFAULT_SOCIAL_SUBTITLE,
  DEFAULT_LINKEDIN_LABEL,
  DEFAULT_INSTAGRAM_LABEL,
  DEFAULT_YOUTUBE_LABEL,
  DEFAULT_FIX_TITLE,
  DEFAULT_FIX_DESCRIPTION,
  DEFAULT_FIX_APPLY_LABEL,
  DEFAULT_FIX_CONTACT_LABEL,
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_FOOTER_CONTACT_TEXT,
  DEFAULT_FOOTER_CONTACT_PHONE,
  DEFAULT_EVENTS_TITLE,
  DEFAULT_EVENTS_DESCRIPTION,
  DEFAULT_GALLERY_TITLE,
  DEFAULT_GALLERY_DESCRIPTION,
  DEFAULT_ASK_US_TITLE,
  DEFAULT_ASK_US_DESCRIPTION,
  DEFAULT_ASK_US_CARD_TITLE,
  DEFAULT_ASK_US_CARD_DESCRIPTION,
  DEFAULT_ASK_US_BUTTON_LABEL,
  HomeSettings,
} from '@/lib/home-content';

function cardsToTextareaValue(cards: string[]) {
  return cards.join('\n');
}

function textareaValueToCards(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function ContentManagement() {
  const { toast } = useToast();
  const { data: homeContent, isLoading } = useHomeContentSettings();
  const updateHomeContentMutation = useUpdateHomeContentSettings();
  
  const [formData, setFormData] = useState<HomeSettings>({
    title: '',
    description: '',
    ubxUniteTitle: '',
    ubxUniteDescription: '',
    ubxUniteCards: [],
    ubxBuildTitle: '',
    ubxBuildDescription: '',
    ubxBuildCards: [],
    ubxXploreTitle: '',
    ubxXploreDescription: '',
    ubxXploreCards: [],
    socialTitle: '',
    socialSubtitle: '',
    linkedinLabel: '',
    instagramLabel: '',
    youtubeLabel: '',
    fixTitle: '',
    fixDescription: '',
    fixApplyLabel: '',
    fixContactLabel: '',
    footerDescription: '',
    footerContactText: '',
    footerContactPhone: '',
    eventsTitle: '',
    eventsDescription: '',
    galleryTitle: '',
    galleryDescription: '',
    askUsTitle: '',
    askUsDescription: '',
    askUsCardTitle: '',
    askUsCardDescription: '',
    askUsButtonLabel: '',
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once we are definitely not loading and we haven't initialized yet
    if (!isLoading && !hasInitialized) {
      setFormData({
        title: homeContent?.title || '',
        description: homeContent?.description || '',
        ubxUniteTitle: homeContent?.ubxUniteTitle || DEFAULT_UBX_UNITE_TITLE,
        ubxUniteDescription: homeContent?.ubxUniteDescription || DEFAULT_UBX_UNITE_DESCRIPTION,
        ubxUniteCards: homeContent?.ubxUniteCards || DEFAULT_UBX_UNITE_CARDS,
        ubxBuildTitle: homeContent?.ubxBuildTitle || DEFAULT_UBX_BUILD_TITLE,
        ubxBuildDescription: homeContent?.ubxBuildDescription || DEFAULT_UBX_BUILD_DESCRIPTION,
        ubxBuildCards: homeContent?.ubxBuildCards || DEFAULT_UBX_BUILD_CARDS,
        ubxXploreTitle: homeContent?.ubxXploreTitle || DEFAULT_UBX_XPLORE_TITLE,
        ubxXploreDescription: homeContent?.ubxXploreDescription || DEFAULT_UBX_XPLORE_DESCRIPTION,
        ubxXploreCards: homeContent?.ubxXploreCards || DEFAULT_UBX_XPLORE_CARDS,
        socialTitle: homeContent?.socialTitle || '',
        socialSubtitle: homeContent?.socialSubtitle || '',
        linkedinLabel: homeContent?.linkedinLabel || '',
        instagramLabel: homeContent?.instagramLabel || '',
        youtubeLabel: homeContent?.youtubeLabel || '',
        fixTitle: homeContent?.fixTitle || '',
        fixDescription: homeContent?.fixDescription || '',
        fixApplyLabel: homeContent?.fixApplyLabel || '',
        fixContactLabel: homeContent?.fixContactLabel || '',
        footerDescription: homeContent?.footerDescription || '',
        footerContactText: homeContent?.footerContactText || '',
        footerContactPhone: homeContent?.footerContactPhone || '',
        eventsTitle: homeContent?.eventsTitle || '',
        eventsDescription: homeContent?.eventsDescription || '',
        galleryTitle: homeContent?.galleryTitle || '',
        galleryDescription: homeContent?.galleryDescription || '',
        askUsTitle: homeContent?.askUsTitle || '',
        askUsDescription: homeContent?.askUsDescription || '',
        askUsCardTitle: homeContent?.askUsCardTitle || '',
        askUsCardDescription: homeContent?.askUsCardDescription || '',
        askUsButtonLabel: homeContent?.askUsButtonLabel || '',
      });
      setHasInitialized(true);
    }
  }, [isLoading, homeContent, hasInitialized]);

  const handleInputChange = (field: keyof HomeSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardsChange = (
    field: 'ubxUniteCards' | 'ubxBuildCards' | 'ubxXploreCards',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: textareaValueToCards(value) }));
  };

  const handleSave = async () => {
    try {
      await updateHomeContentMutation.mutateAsync(formData);
      toast({ title: 'Home page content updated' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      toast({ title: 'Update failed', description: msg, variant: 'destructive' });
    }
  };

  const handleReset = () => {
    setFormData({
      title: homeContent?.title || '',
      description: homeContent?.description || '',
      ubxUniteTitle: homeContent?.ubxUniteTitle || DEFAULT_UBX_UNITE_TITLE,
      ubxUniteDescription: homeContent?.ubxUniteDescription || DEFAULT_UBX_UNITE_DESCRIPTION,
      ubxUniteCards: homeContent?.ubxUniteCards || DEFAULT_UBX_UNITE_CARDS,
      ubxBuildTitle: homeContent?.ubxBuildTitle || DEFAULT_UBX_BUILD_TITLE,
      ubxBuildDescription: homeContent?.ubxBuildDescription || DEFAULT_UBX_BUILD_DESCRIPTION,
      ubxBuildCards: homeContent?.ubxBuildCards || DEFAULT_UBX_BUILD_CARDS,
      ubxXploreTitle: homeContent?.ubxXploreTitle || DEFAULT_UBX_XPLORE_TITLE,
      ubxXploreDescription: homeContent?.ubxXploreDescription || DEFAULT_UBX_XPLORE_DESCRIPTION,
      ubxXploreCards: homeContent?.ubxXploreCards || DEFAULT_UBX_XPLORE_CARDS,
      socialTitle: homeContent?.socialTitle || '',
      socialSubtitle: homeContent?.socialSubtitle || '',
      linkedinLabel: homeContent?.linkedinLabel || '',
      instagramLabel: homeContent?.instagramLabel || '',
      youtubeLabel: homeContent?.youtubeLabel || '',
      fixTitle: homeContent?.fixTitle || '',
      fixDescription: homeContent?.fixDescription || '',
      fixApplyLabel: homeContent?.fixApplyLabel || '',
      fixContactLabel: homeContent?.fixContactLabel || '',
      footerDescription: homeContent?.footerDescription || '',
      footerContactText: homeContent?.footerContactText || '',
      footerContactPhone: homeContent?.footerContactPhone || '',
      eventsTitle: homeContent?.eventsTitle || '',
      eventsDescription: homeContent?.eventsDescription || '',
      galleryTitle: homeContent?.galleryTitle || '',
      galleryDescription: homeContent?.galleryDescription || '',
      askUsTitle: homeContent?.askUsTitle || '',
      askUsDescription: homeContent?.askUsDescription || '',
      askUsCardTitle: homeContent?.askUsCardTitle || '',
      askUsCardDescription: homeContent?.askUsCardDescription || '',
      askUsButtonLabel: homeContent?.askUsButtonLabel || '',
    });
  };

  if (isLoading && !hasInitialized) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 px-1 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-20 py-2 md:py-4 mb-4 md:mb-6 border-b md:border-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="text-left space-y-0.5">
          <h1 className="text-xl sm:text-3xl font-display font-bold tracking-tight">Page Content</h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Customize all text content across your platform.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
           <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset} 
            disabled={updateHomeContentMutation.isPending}
            className="flex-1 md:flex-none h-9 sm:h-10"
          >
            Reset
          </Button>
          <Button 
            size="sm"
            onClick={handleSave} 
            disabled={updateHomeContentMutation.isPending}
            className="flex-1 md:flex-none h-9 sm:h-10"
          >
            {updateHomeContentMutation.isPending ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* HOME PAGE MAIN CONTENT */}
      <div className="space-y-4 px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Home Page
        </h2>
        <div className="grid gap-6">
          {/* EVENTS SECTION */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg">Events Section (Home)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={formData.title} 
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder={DEFAULT_HOME_TITLE}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder={DEFAULT_HOME_DESCRIPTION}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg">Unite / Build / Xplore Section (Home)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-8">
              <div className="grid gap-8 xl:grid-cols-3">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-primary">Let&apos;s Unite</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.ubxUniteTitle}
                      onChange={e => handleInputChange('ubxUniteTitle', e.target.value)}
                      placeholder={DEFAULT_UBX_UNITE_TITLE}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.ubxUniteDescription}
                      onChange={e => handleInputChange('ubxUniteDescription', e.target.value)}
                      placeholder={DEFAULT_UBX_UNITE_DESCRIPTION}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">5 Card Labels (one per line)</label>
                    <Textarea
                      value={cardsToTextareaValue(formData.ubxUniteCards)}
                      onChange={e => handleCardsChange('ubxUniteCards', e.target.value)}
                      placeholder={cardsToTextareaValue(DEFAULT_UBX_UNITE_CARDS)}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-primary">Let&apos;s Build</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.ubxBuildTitle}
                      onChange={e => handleInputChange('ubxBuildTitle', e.target.value)}
                      placeholder={DEFAULT_UBX_BUILD_TITLE}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.ubxBuildDescription}
                      onChange={e => handleInputChange('ubxBuildDescription', e.target.value)}
                      placeholder={DEFAULT_UBX_BUILD_DESCRIPTION}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">5 Card Labels (one per line)</label>
                    <Textarea
                      value={cardsToTextareaValue(formData.ubxBuildCards)}
                      onChange={e => handleCardsChange('ubxBuildCards', e.target.value)}
                      placeholder={cardsToTextareaValue(DEFAULT_UBX_BUILD_CARDS)}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-primary">Let&apos;s Xplore</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.ubxXploreTitle}
                      onChange={e => handleInputChange('ubxXploreTitle', e.target.value)}
                      placeholder={DEFAULT_UBX_XPLORE_TITLE}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.ubxXploreDescription}
                      onChange={e => handleInputChange('ubxXploreDescription', e.target.value)}
                      placeholder={DEFAULT_UBX_XPLORE_DESCRIPTION}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">5 Card Labels (one per line)</label>
                    <Textarea
                      value={cardsToTextareaValue(formData.ubxXploreCards)}
                      onChange={e => handleCardsChange('ubxXploreCards', e.target.value)}
                      placeholder={cardsToTextareaValue(DEFAULT_UBX_XPLORE_CARDS)}
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOCIAL FEED SECTION */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg">Social Feed Section (Home)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section Title</label>
                  <Input 
                    value={formData.socialTitle} 
                    onChange={e => handleInputChange('socialTitle', e.target.value)}
                    placeholder={DEFAULT_SOCIAL_TITLE}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section Subtitle</label>
                  <Input 
                    value={formData.socialSubtitle} 
                    onChange={e => handleInputChange('socialSubtitle', e.target.value)}
                    placeholder={DEFAULT_SOCIAL_SUBTITLE}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                 <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Label</label>
                  <Input 
                    value={formData.linkedinLabel} 
                    onChange={e => handleInputChange('linkedinLabel', e.target.value)}
                    placeholder={DEFAULT_LINKEDIN_LABEL}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram Label</label>
                  <Input 
                    value={formData.instagramLabel} 
                    onChange={e => handleInputChange('instagramLabel', e.target.value)}
                    placeholder={DEFAULT_INSTAGRAM_LABEL}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube Label</label>
                  <Input 
                    value={formData.youtubeLabel} 
                    onChange={e => handleInputChange('youtubeLabel', e.target.value)}
                    placeholder={DEFAULT_YOUTUBE_LABEL}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FIX SECTION */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg">FIX Program Section (Home)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Use ' - ' for accent styling)</label>
                <Input 
                  value={formData.fixTitle} 
                  onChange={e => handleInputChange('fixTitle', e.target.value)}
                  placeholder={DEFAULT_FIX_TITLE}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Newlines preserved)</label>
                <Textarea 
                  value={formData.fixDescription} 
                  onChange={e => handleInputChange('fixDescription', e.target.value)}
                  placeholder={DEFAULT_FIX_DESCRIPTION}
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Apply Button Label</label>
                  <Input 
                    value={formData.fixApplyLabel} 
                    onChange={e => handleInputChange('fixApplyLabel', e.target.value)}
                    placeholder={DEFAULT_FIX_APPLY_LABEL}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Button Label</label>
                  <Input 
                    value={formData.fixContactLabel} 
                    onChange={e => handleInputChange('fixContactLabel', e.target.value)}
                    placeholder={DEFAULT_FIX_CONTACT_LABEL}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6 sm:my-10 bg-primary/10 h-px" />

      {/* EVENTS PAGE MAIN CONTENT */}
      <div className="space-y-4 px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Events Page
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events Page (Main)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input 
                value={formData.eventsTitle} 
                onChange={e => handleInputChange('eventsTitle', e.target.value)}
                placeholder={DEFAULT_EVENTS_TITLE}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Description</label>
              <Textarea 
                value={formData.eventsDescription} 
                onChange={e => handleInputChange('eventsDescription', e.target.value)}
                placeholder={DEFAULT_EVENTS_DESCRIPTION}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-10 bg-primary/10 h-px" />

      {/* GALLERY PAGE CONTENT */}
      <div className="space-y-4 px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Gallery Page
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gallery Page Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input 
                value={formData.galleryTitle} 
                onChange={e => handleInputChange('galleryTitle', e.target.value)}
                placeholder={DEFAULT_GALLERY_TITLE}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Description</label>
              <Textarea 
                value={formData.galleryDescription} 
                onChange={e => handleInputChange('galleryDescription', e.target.value)}
                placeholder={DEFAULT_GALLERY_DESCRIPTION}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-10 bg-primary/10 h-px" />

      {/* ASK US PAGE CONTENT */}
      <div className="space-y-4 px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Ask Us Page
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ask Us Page Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input 
                  value={formData.askUsTitle} 
                  onChange={e => handleInputChange('askUsTitle', e.target.value)}
                  placeholder={DEFAULT_ASK_US_TITLE}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Description</label>
                <Input 
                  value={formData.askUsDescription} 
                  onChange={e => handleInputChange('askUsDescription', e.target.value)}
                  placeholder={DEFAULT_ASK_US_DESCRIPTION}
                />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold">Enquiry Card Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Title</label>
                  <Input 
                    value={formData.askUsCardTitle} 
                    onChange={e => handleInputChange('askUsCardTitle', e.target.value)}
                    placeholder={DEFAULT_ASK_US_CARD_TITLE}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Label</label>
                  <Input 
                    value={formData.askUsButtonLabel} 
                    onChange={e => handleInputChange('askUsButtonLabel', e.target.value)}
                    placeholder={DEFAULT_ASK_US_BUTTON_LABEL}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Description</label>
                <Textarea 
                  value={formData.askUsCardDescription} 
                  onChange={e => handleInputChange('askUsCardDescription', e.target.value)}
                  placeholder={DEFAULT_ASK_US_CARD_DESCRIPTION}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-10 bg-primary/10 h-px" />

      {/* FOOTER CONTENT */}
      <div className="space-y-4 px-1 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Footer
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Footer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Footer Description</label>
              <Textarea 
                value={formData.footerDescription} 
                onChange={e => handleInputChange('footerDescription', e.target.value)}
                placeholder={DEFAULT_FOOTER_DESCRIPTION}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Label</label>
                <Input 
                  value={formData.footerContactText} 
                  onChange={e => handleInputChange('footerContactText', e.target.value)}
                  placeholder={DEFAULT_FOOTER_CONTACT_TEXT}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Input 
                  value={formData.footerContactPhone} 
                  onChange={e => handleInputChange('footerContactPhone', e.target.value)}
                  placeholder={DEFAULT_FOOTER_CONTACT_PHONE}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
