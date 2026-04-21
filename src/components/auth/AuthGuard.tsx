import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAdmin = false, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, always redirect to the login page.
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If admin is required and the authenticated user is not an admin,
      // redirect them to the login page as well. This allows them to sign in
      // with a different, administrative account.
      if (requireAdmin && user && !user.roles.includes('admin')) {
        router.push(redirectTo); // Change this from '/' to redirectTo
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If the logic above is running, these checks prevent rendering the children
  // before the redirect effect has a chance to run.
  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user && !user.roles.includes('admin')) {
    return null;
  }

  return <>{children}</>;
}
