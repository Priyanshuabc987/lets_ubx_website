
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFixSettings, useUpdateFixSettings } from '@/hooks/useFixSettings';

const fixSettingsSchema = z.object({
  registration_link: z.string().url('Invalid URL format').min(1, 'Registration link is required'),
});

type FixSettingsFormData = z.infer<typeof fixSettingsSchema>;

export function FixManagement() {
  const { toast } = useToast();
  const { data: fixSettings, isLoading: isLoadingSettings } = useFixSettings();
  const updateFixSettings = useUpdateFixSettings();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FixSettingsFormData>({
    resolver: zodResolver(fixSettingsSchema),
  });

  useEffect(() => {
    if (fixSettings?.registration_link) {
      setValue('registration_link', fixSettings.registration_link);
    }
  }, [fixSettings, setValue]);

  const onSubmit = async (data: FixSettingsFormData) => {
    try {
      await updateFixSettings.mutateAsync(data);
      toast({ title: 'Success', description: 'FIX registration link updated successfully.' });
    } catch (error) {
      console.error('Failed to update FIX settings:', error);
      toast({ title: 'Error', description: 'Failed to update the link.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Registration Link</CardTitle>
          <CardDescription>This is the link that is currently live on the FIX page.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSettings ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading current link...</span>
            </div>
          ) : fixSettings?.registration_link ? (
            <div className="flex items-center justify-between gap-4">
              <Link
                href={fixSettings.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline truncate"
              >
                {fixSettings.registration_link}
              </Link>
              <Button asChild variant="secondary" size="icon" className="flex-shrink-0">
                <Link href={fixSettings.registration_link} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="sr-only">Open link</span>
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No registration link has been set yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Link</CardTitle>
          <CardDescription>Change the registration link for the FIX page here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration_link">New Registration Link</Label>
              <Input
                id="registration_link"
                type="url"
                {...register('registration_link')}
                placeholder="https://example.com/new-link"
              />
              {errors.registration_link && <p className="text-sm text-destructive">{errors.registration_link.message}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={updateFixSettings.isPending}>
                {updateFixSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Update Link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
