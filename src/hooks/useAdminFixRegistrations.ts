import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/firebase';

export function useAdminFixRegistrations() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['admin', 'fix_registrations'],
    queryFn: async () => {
      const token = user ? await user.getIdToken() : null;
      const res = await fetch('/api/admin/fix/list', {
        credentials: 'same-origin',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch admin registrations');
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30s
  });
}
