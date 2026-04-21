import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  community_role: z.string().min(1, 'Please select who you are'),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').refine(
    (url) => url.includes('linkedin.com'),
    'Please enter a valid LinkedIn URL'
  ),
  about_yourself: z.string().min(1, 'Please write about yourself'),
  building_description: z.string().min(1, 'Please share about your startup'),
  startup_support_needs: z.string().min(1, 'Please describe the support needed'),
  experiences_interests_skills: z.string().min(1, 'Please share your skills'),
  terms_accepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const communityRoles = [
  { value: 'Founder', label: 'Founder' },
  { value: 'Enabler', label: 'Enabler' },
  { value: 'Mentor', label: 'Mentor' },
  { value: 'Learner', label: 'Learner' },
  { value: 'Investor', label: 'Investor' },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, register, isRegisterLoading, registerError, isAuthenticated } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const termsAccepted = watch('terms_accepted') ?? false;

  useEffect(() => {
    if (isAuthenticated && user?.profile_slug) {
      const intendedRedirect = sessionStorage.getItem('intended_redirect');
      if (intendedRedirect) {
        sessionStorage.removeItem('intended_redirect');
        sessionStorage.removeItem('intended_event');
        router.push(intendedRedirect);
        return;
      }
      const intendedEvent = sessionStorage.getItem('intended_event');
      if (intendedEvent) {
        sessionStorage.removeItem('intended_event');
        router.push(`/events/${intendedEvent}`);
      } else {
        router.push(`/member/${user.profile_slug}`);
      }
    }
  }, [isAuthenticated, user?.profile_slug, router]);

  if (isAuthenticated && user?.profile_slug) {
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch (error) {
      // Error handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-display font-bold text-center break-words">
            Join CEDAT Community
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Become a free CEDAT member
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm">1. Name *</Label>
                  <Input id="full_name" {...registerField('full_name')} className={errors.full_name ? 'border-destructive' : ''} />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">2. Phone *</Label>
                  <Input id="phone" type="tel" {...registerField('phone')} className={errors.phone ? 'border-destructive' : ''} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">3. Mail ID *</Label>
                  <Input id="email" type="email" {...registerField('email')} className={errors.email ? 'border-destructive' : ''} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">4. Password *</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} {...registerField('password')} className={errors.password ? 'border-destructive' : ''} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="community_role" className="text-sm">5. Who Are You? *</Label>
                <Select value={watch('community_role')} onValueChange={(value) => setValue('community_role', value)}>
                  <SelectTrigger className={errors.community_role ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select who you are" />
                  </SelectTrigger>
                  <SelectContent>
                    {communityRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.community_role && <p className="text-xs text-destructive">{errors.community_role.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="text-sm">6. LinkedIn Profile? *</Label>
                <Input id="linkedin_url" {...registerField('linkedin_url')} className={errors.linkedin_url ? 'border-destructive' : ''} />
                {errors.linkedin_url && <p className="text-xs text-destructive">{errors.linkedin_url.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_yourself" className="text-sm">7. About Yourself *</Label>
                <Textarea id="about_yourself" {...registerField('about_yourself')} rows={4} className={errors.about_yourself ? 'border-destructive' : ''} />
                {errors.about_yourself && <p className="text-xs text-destructive">{errors.about_yourself.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_description" className="text-sm">8. What are you building? *</Label>
                <Textarea id="building_description" {...registerField('building_description')} rows={4} className={errors.building_description ? 'border-destructive' : ''} />
                {errors.building_description && <p className="text-xs text-destructive">{errors.building_description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_support_needs" className="text-sm">9. Support needed? *</Label>
                <Textarea id="startup_support_needs" {...registerField('startup_support_needs')} rows={4} className={errors.startup_support_needs ? 'border-destructive' : ''} />
                {errors.startup_support_needs && <p className="text-xs text-destructive">{errors.startup_support_needs.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="experiences_interests_skills" className="text-sm">10. Skills & Experience *</Label>
                <Textarea id="experiences_interests_skills" {...registerField('experiences_interests_skills')} rows={4} className={errors.experiences_interests_skills ? 'border-destructive' : ''} />
                {errors.experiences_interests_skills && <p className="text-xs text-destructive">{errors.experiences_interests_skills.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms_accepted" checked={termsAccepted || false} onCheckedChange={(checked) => setValue('terms_accepted', checked === true)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms_accepted" className="text-sm font-normal">
                    I agree to the <Link href="/terms" className="text-accent hover:underline">Terms</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy</Link>
                  </Label>
                  {errors.terms_accepted && <p className="text-xs text-destructive">{errors.terms_accepted.message}</p>}
                </div>
              </div>
            </div>

            {registerError && (
              <Alert variant="destructive">
                <AlertDescription>{(registerError as any).message || 'Registration failed.'}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full min-h-[44px]" disabled={isRegisterLoading} size="lg">
              {isRegisterLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Become a CEDAT Member'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-accent hover:underline">Sign In</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
