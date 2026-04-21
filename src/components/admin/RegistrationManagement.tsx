import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, QrCode, CheckCircle, X, Search, Download } from 'lucide-react';
import { useVerifyQRCode, useCheckInRegistration, useApproveRegistration, useAdminStats, useAdminAllRegistrations, useAdminEvents } from '@/hooks/useAdmin';
import { API_BASE_URL } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { RegistrationMemberDetailSheet } from '@/components/admin/RegistrationMemberDetailSheet';
import { format } from 'date-fns';

const REG_SORT_OPTIONS = [
  { value: 'registration_date', label: 'Registration date' },
  { value: 'event_title', label: 'Event' },
  { value: 'attendance_status', label: 'Status' },
  { value: 'member_name', label: 'Member name' },
] as const;

const ALL_VALUE = '__all__';

export function RegistrationManagement() {
  const { toast } = useToast();
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [verifiedRegistration, setVerifiedRegistration] = useState<any>(null);

  // All Registrations state
  const [eventIdFilter, setEventIdFilter] = useState<string>(ALL_VALUE);
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<string>(ALL_VALUE);
  const [searchReg, setSearchReg] = useState('');
  const [sortByReg, setSortByReg] = useState<string>('registration_date');
  const [sortOrderReg, setSortOrderReg] = useState<string>('desc');
  const [pageReg, setPageReg] = useState(1);
  const regPageSize = 50;
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRegistrationId, setDetailRegistrationId] = useState<string | undefined>(undefined);

  const verifyQRCode = useVerifyQRCode();
  const checkInRegistration = useCheckInRegistration();
  const approveRegistration = useApproveRegistration();
  const { data: stats } = useAdminStats();
  const { data: eventsData } = useAdminEvents({ page_size: 300 });
  const { data: regData, isLoading: regLoading } = useAdminAllRegistrations({
    event_id: eventIdFilter !== ALL_VALUE ? eventIdFilter : undefined,
    attendance_status: attendanceStatusFilter !== ALL_VALUE ? attendanceStatusFilter : undefined,
    search: searchReg.trim() || undefined,
    sort_by: sortByReg,
    order: sortOrderReg,
    page: pageReg,
    page_size: regPageSize,
  });

  const regItems = regData?.items ?? [];
  const regTotal = regData?.total ?? 0;

  const handleExportRegistrationsCsv = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const p = new URLSearchParams();
      p.set('export_csv', 'true');
      if (eventIdFilter && eventIdFilter !== ALL_VALUE) p.set('event_id', eventIdFilter);
      if (attendanceStatusFilter && attendanceStatusFilter !== ALL_VALUE) p.set('attendance_status', attendanceStatusFilter);
      if (searchReg.trim()) p.set('search', searchReg.trim());
      p.set('sort_by', sortByReg);
      p.set('order', sortOrderReg);
      const response = await fetch(`${API_BASE_URL}/api/admin/registrations?${p}`, { headers });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cedat_registrations.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export registrations CSV:', error);
    }
  };

  const handleVerifyQR = async () => {
    if (!qrCodeInput.trim()) return;

    try {
      const result = await verifyQRCode.mutateAsync(qrCodeInput.trim());
      setVerifiedRegistration(result);
    } catch (error) {
      console.error('QR verification failed:', error);
      setVerifiedRegistration(null);
    }
  };

  const handleCheckIn = async () => {
    if (!verifiedRegistration) return;

    try {
      await checkInRegistration.mutateAsync(verifiedRegistration.registration.id);
      setVerifiedRegistration({
        ...verifiedRegistration,
        registration: {
          ...verifiedRegistration.registration,
          attendance_status: 'attended',
          checked_in_at: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const clearVerification = () => {
    setQrCodeInput('');
    setVerifiedRegistration(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold break-words">Registration Management</h2>
        <p className="text-muted-foreground">Verify QR codes and manage event check-ins</p>
      </div>

      {/* All Registrations */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-left">
              <CardTitle>All Registrations</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">View and export all event registrations. Total: {regTotal}</p>
            </div>
            <Button onClick={handleExportRegistrationsCsv} variant="outline" size="sm" className="min-h-[44px] w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={eventIdFilter} onValueChange={(v) => { setEventIdFilter(v); setPageReg(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All events</SelectItem>
                  {eventsData?.items?.map((e: { id: string; title: string }) => (
                    <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Attendance status</Label>
              <Select value={attendanceStatusFilter} onValueChange={(v) => { setAttendanceStatusFilter(v); setPageReg(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending_approval">Pending approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search (name, email, company)</Label>
              <Input
                placeholder="Search..."
                value={searchReg}
                onChange={(e) => { setSearchReg(e.target.value); setPageReg(1); }}
              />
            </div>
            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortByReg} onValueChange={(v) => { setSortByReg(v); setPageReg(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REG_SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Select value={sortOrderReg} onValueChange={(v) => { setSortOrderReg(v); setPageReg(1); }}>
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

          {regLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : regItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registrations found matching your criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checked-in At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regItems.map((r: { id: string; event_title?: string; member_name?: string; member_email?: string; member_company?: string; registration_date?: string; attendance_status?: string; checked_in_at?: string }) => (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setDetailRegistrationId(r.id); setDetailOpen(true); }}
                      >
                        <TableCell className="break-words">{r.event_title ?? '—'}</TableCell>
                        <TableCell className="break-words">{r.member_name ?? '—'}</TableCell>
                        <TableCell className="break-words">{r.member_email ?? '—'}</TableCell>
                        <TableCell className="break-words">{r.member_company ?? '—'}</TableCell>
                        <TableCell>{r.registration_date ? format(new Date(r.registration_date), 'PP') : '—'}</TableCell>
                        <TableCell>
                          <Badge variant={r.attendance_status === 'attended' ? 'default' : 'secondary'}>
                            {r.attendance_status === 'pending_approval' ? 'Pending approval' : (r.attendance_status ?? '—')}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.checked_in_at ? format(new Date(r.checked_in_at), 'pp') : '—'}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {r.attendance_status === 'pending_approval' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="min-h-[44px]"
                              onClick={async () => {
                                try {
                                  await approveRegistration.mutateAsync(r.id);
                                  toast({ title: 'Registration approved', description: 'QR code and confirmation email have been sent.' });
                                } catch {
                                  toast({ title: 'Error', description: 'Failed to approve registration.', variant: 'destructive' });
                                }
                              }}
                              disabled={approveRegistration.isPending}
                            >
                              {approveRegistration.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {regTotal > regPageSize && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pageReg - 1) * regPageSize + 1}–{Math.min(pageReg * regPageSize, regTotal)} of {regTotal}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={pageReg === 1} onClick={() => setPageReg((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={pageReg * regPageSize >= regTotal} onClick={() => setPageReg((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* QR Code Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="qr-code">Enter QR Code</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="qr-code"
                  placeholder="Scan or enter QR code..."
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyQR()}
                  className="flex-1"
                />
                <Button
                  onClick={handleVerifyQR}
                  disabled={verifyQRCode.isPending || !qrCodeInput.trim()}
                  className="min-h-[44px] w-full sm:w-auto"
                >
                  {verifyQRCode.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 flex-shrink-0" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {verifyQRCode.error && (
            <Alert variant="destructive">
              <AlertDescription>
                Invalid QR code. Please check and try again.
              </AlertDescription>
            </Alert>
          )}

          {verifiedRegistration && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Valid Registration</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-left">
                        <h4 className="font-medium mb-2">Event Details</h4>
                        <p className="text-sm break-words"><strong>Event:</strong> {verifiedRegistration.registration.event_title}</p>
                        <p className="text-sm"><strong>Date:</strong> {format(new Date(verifiedRegistration.registration.event_date), 'PPP')}</p>
                        <p className="text-sm"><strong>Status:</strong> {
                          <Badge variant={verifiedRegistration.registration.attendance_status === 'attended' ? 'default' : 'secondary'}>
                            {verifiedRegistration.registration.attendance_status}
                          </Badge>
                        }</p>
                      </div>

                      <div className="text-left">
                        <h4 className="font-medium mb-2">Attendee Details</h4>
                        <p className="text-sm break-words"><strong>Name:</strong> {verifiedRegistration.member.name}</p>
                        <p className="text-sm break-words"><strong>Email:</strong> {verifiedRegistration.member.email}</p>
                        <p className="text-sm break-words"><strong>Company:</strong> {verifiedRegistration.member.company}</p>
                      </div>
                    </div>

                    {verifiedRegistration.registration.attendance_status !== 'attended' && (
                      <Button
                        onClick={handleCheckIn}
                        disabled={checkInRegistration.isPending}
                        className="w-full md:w-auto min-h-[44px]"
                      >
                        {checkInRegistration.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
                            Checking In...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            Mark as Attended
                          </>
                        )}
                      </Button>
                    )}

                    {verifiedRegistration.registration.attendance_status === 'attended' && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Checked in at {format(new Date(verifiedRegistration.registration.checked_in_at), 'pp')}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearVerification}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {stats?.total_registrations || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Registrations</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.attended_registrations || 0}
              </div>
              <div className="text-sm text-muted-foreground">Checked In</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.total_events || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats?.attendance_rate || 0)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Attendance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RegistrationMemberDetailSheet
        open={detailOpen}
        onOpenChange={(o) => { setDetailOpen(o); if (!o) setDetailRegistrationId(undefined); }}
        mode="registration"
        registrationId={detailRegistrationId}
      />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">For Event Organizers:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use a QR code scanner app on your phone</li>
                <li>• Enter the scanned code in the field above</li>
                <li>• Verify attendee details before check-in</li>
                <li>• Click "Mark as Attended" to complete check-in</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">For Attendees:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Show your QR code from email or dashboard</li>
                <li>• QR codes are unique per event registration</li>
                <li>• Keep your QR code accessible during check-in</li>
                <li>• One QR code per person per event</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
