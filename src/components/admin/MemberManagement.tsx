import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RegistrationMemberDetailSheet } from '@/components/admin/RegistrationMemberDetailSheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Search, Filter } from 'lucide-react';
import { useAdminMembers } from '@/hooks/useAdmin';
import { API_BASE_URL } from '@/lib/queryClient';
import { format } from 'date-fns';

const communityRoles = [
  'Investor',
  'Startup Founder',
  'Institution',
  'Government',
  'Ecosystem Enabler',
  'Aspiring Entrepreneur',
  'Student',
];

const functionalRoles = [
  'Tech',
  'Marketing',
  'Sales',
  'Operations',
  'Product',
  'Strategy',
  'Legal',
  'Finance',
  'Research',
  'Other',
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created' },
  { value: 'full_name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'company_name', label: 'Company' },
] as const;

const ALL_VALUE = '__all__';

export function MemberManagement() {
  const [communityRoleFilter, setCommunityRoleFilter] = useState<string>(ALL_VALUE);
  const [functionalRoleFilter, setFunctionalRoleFilter] = useState<string>(ALL_VALUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMemberId, setDetailMemberId] = useState<string | undefined>(undefined);

  const { data: membersData, isLoading } = useAdminMembers({
    community_role: communityRoleFilter !== ALL_VALUE ? communityRoleFilter : undefined,
    functional_role: functionalRoleFilter !== ALL_VALUE ? functionalRoleFilter : undefined,
    search: searchQuery.trim() || undefined,
    sort_by: sortBy,
    order: sortOrder,
    page,
    page_size: pageSize,
  });

  const items = membersData?.items ?? [];

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const p = new URLSearchParams();
      p.set('export_csv', 'true');
      if (communityRoleFilter && communityRoleFilter !== ALL_VALUE) p.set('community_role', communityRoleFilter);
      if (functionalRoleFilter && functionalRoleFilter !== ALL_VALUE) p.set('functional_role', functionalRoleFilter);
      if (searchQuery.trim()) p.set('search', searchQuery.trim());
      p.set('sort_by', sortBy);
      p.set('order', sortOrder);
      const response = await fetch(`${API_BASE_URL}/api/admin/members?${p}`, { headers });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cedat_members.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Investor': 'bg-green-100 text-green-800',
      'Startup Founder': 'bg-blue-100 text-blue-800',
      'Institution': 'bg-purple-100 text-purple-800',
      'Government': 'bg-red-100 text-red-800',
      'Ecosystem Enabler': 'bg-orange-100 text-orange-800',
      'Aspiring Entrepreneur': 'bg-pink-100 text-pink-800',
      'Student': 'bg-indigo-100 text-indigo-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getFunctionalRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Tech': 'bg-cyan-100 text-cyan-800',
      'Marketing': 'bg-yellow-100 text-yellow-800',
      'Sales': 'bg-emerald-100 text-emerald-800',
      'Operations': 'bg-slate-100 text-slate-800',
      'Product': 'bg-violet-100 text-violet-800',
      'Strategy': 'bg-rose-100 text-rose-800',
      'Legal': 'bg-amber-100 text-amber-800',
      'Finance': 'bg-lime-100 text-lime-800',
      'Research': 'bg-teal-100 text-teal-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">View and manage CEDAT community members</p>
        </div>

        <Button onClick={handleExportCsv}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="community-role">Community Role</Label>
              <Select value={communityRoleFilter} onValueChange={(v) => { setCommunityRoleFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All roles</SelectItem>
                  {communityRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="functional-role">Functional Role</Label>
              <Select value={functionalRoleFilter} onValueChange={(v) => { setFunctionalRoleFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All roles</SelectItem>
                  {functionalRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order</Label>
              <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            CEDAT Members ({membersData?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No members found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Community Role</TableHead>
                      <TableHead>Functional Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((member) => (
                      <TableRow
                        key={member.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setDetailMemberId(member.id); setDetailOpen(true); }}
                      >
                        <TableCell className="font-medium break-words">{member.full_name}</TableCell>
                        <TableCell className="break-words">{member.email}</TableCell>
                        <TableCell className="break-words">{member.company_name}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(member.community_role)}>
                            {member.community_role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getFunctionalRoleColor(member.functional_role)}>
                            {member.functional_role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(member.created_at), 'PP')}
                        </TableCell>
                        <TableCell>
                          {member.is_admin ? (
                            <Badge variant="default">Admin</Badge>
                          ) : (
                            <Badge variant="secondary">Member</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {membersData && membersData.total > pageSize && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {items.length} of {membersData.total} members
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page * pageSize >= membersData.total}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrationMemberDetailSheet
        open={detailOpen}
        onOpenChange={(o) => { setDetailOpen(o); if (!o) setDetailMemberId(undefined); }}
        mode="member"
        memberId={detailMemberId}
      />
    </div>
  );
}
