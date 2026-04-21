import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useAdminRegistrationDetails } from '@/hooks/useAdmin';
import { useAdminMember, useAdminAllRegistrations } from '@/hooks/useAdmin';
import { getImageUrl } from '@/lib/images';
import { getCommunityRoleCardStyles } from '@/lib/communityRoleStyles';
import { format } from 'date-fns';

export interface RegistrationMemberDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'registration' | 'member';
  registrationId?: string;
  memberId?: string;
}

export function RegistrationMemberDetailSheet({
  open,
  onOpenChange,
  mode,
  registrationId,
  memberId,
}: RegistrationMemberDetailSheetProps) {
  const { data: regDetails, isLoading: regLoading } = useAdminRegistrationDetails(
    mode === 'registration' ? registrationId : undefined
  );
  const { data: member, isLoading: memberLoading } = useAdminMember(
    mode === 'member' ? memberId : undefined
  );
  const { data: regsData } = useAdminAllRegistrations({
    member_id: mode === 'member' ? memberId : undefined,
    page_size: 100,
    enabled: mode === 'member' && !!memberId,
  });

  const regs = regsData?.items ?? [];
  const isLoading =
    (mode === 'registration' && regLoading) || (mode === 'member' && memberLoading);

  const m = mode === 'registration' ? regDetails?.member : member;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === 'registration' ? 'Registration & Member Details' : 'Member Profile'}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : mode === 'registration' ? (
          <div className="mt-6 space-y-6">
            {/* Registration block */}
            {regDetails && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Registration
                </h3>
                <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Event:</span> {regDetails.event_title ?? '—'}</p>
                  <p><span className="text-muted-foreground">Event date:</span> {regDetails.event_date ? format(new Date(regDetails.event_date), 'PPP p') : '—'}</p>
                  <p><span className="text-muted-foreground">Registered:</span> {regDetails.registration_date ? format(new Date(regDetails.registration_date), 'PPP') : '—'}</p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <Badge variant={regDetails.attendance_status === 'attended' ? 'default' : 'secondary'}>
                      {regDetails.attendance_status === 'pending_approval' ? 'Pending approval' : regDetails.attendance_status}
                    </Badge>
                  </p>
                  <p><span className="text-muted-foreground">QR code:</span> {regDetails.qr_code ? regDetails.qr_code : 'Not generated yet'}</p>
                  {regDetails.checked_in_at && (
                    <p><span className="text-muted-foreground">Checked in:</span> {format(new Date(regDetails.checked_in_at), 'pp')}</p>
                  )}
                  {regDetails.member_role && (
                    <p><span className="text-muted-foreground">Role at registration:</span> {regDetails.member_role}</p>
                  )}
                </div>
              </section>
            )}

            {/* Member block */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Member
              </h3>
              {m ? <MemberBlock member={m} /> : <p className="text-sm text-muted-foreground">Member not found.</p>}
            </section>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Member block */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Member
              </h3>
              {m ? <MemberBlock member={m} /> : <p className="text-sm text-muted-foreground">Member not found.</p>}
            </section>

            {/* Registrations list */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Registrations
              </h3>
              {regs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No registrations.</p>
              ) : (
                <div className="space-y-2">
                  {regs.map((r: { id: string; event_title?: string; event_date?: string; attendance_status?: string }) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div>
                        <p className="font-medium">{r.event_title ?? '—'}</p>
                        <p className="text-muted-foreground">
                          {r.event_date ? format(new Date(r.event_date), 'PPP') : '—'} · {' '}
                          <Badge variant="secondary" className="text-xs">
                            {r.attendance_status === 'pending_approval' ? 'Pending approval' : (r.attendance_status ?? '—')}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MemberBlock({ member }: { member: Record<string, unknown> }) {
  const photo = member.profile_photo_url as string | undefined;
  const fullName = (member.full_name as string) ?? '—';
  const email = (member.email as string) ?? '—';
  const company = (member.company_name as string) ?? '—';
  const designation = (member.designation as string) ?? '—';
  const communityRole = (member.community_role as string) ?? '—';
  const functionalRole = (member.functional_role as string) ?? '—';
  const phone = member.phone as string | undefined;
  const linkedin = (member.linkedin_url as string) || undefined;
  const about = (member.about_company as string) || undefined;
  const building = (member.building_description as string) || undefined;
  const exp = (member.experiences_interests_skills as string) || undefined;
  const support = (member.startup_support_needs as string) || undefined;
  const roleStyles = getCommunityRoleCardStyles(communityRole !== '—' ? communityRole : undefined);

  return (
    <div className={`rounded-lg border-2 p-4 space-y-4 ${roleStyles.card}`}>
      <div className="flex gap-4">
        {photo ? (
          <img src={getImageUrl(photo)} alt={fullName} className={`w-16 h-16 rounded-full object-cover border-2 ${roleStyles.avatarBorder}`} />
        ) : (
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${roleStyles.avatarBg} flex items-center justify-center text-lg font-semibold text-white border-2 ${roleStyles.avatarBorder}`}>
            {fullName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{fullName}</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
          <p className="text-sm truncate">{company}{designation ? ` · ${designation}` : ''}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge className={`text-xs ${roleStyles.badge} border ${roleStyles.badgeBorder}`}>{communityRole}</Badge>
            <Badge variant="outline" className="text-xs">{functionalRole}</Badge>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {phone && <p><span className="text-muted-foreground">Phone:</span> {phone}</p>}
        {linkedin && (
          <p>
            <span className="text-muted-foreground">LinkedIn:</span>{' '}
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate block">
              {linkedin}
            </a>
          </p>
        )}
        {about && <p><span className="text-muted-foreground">About company:</span> {about}</p>}
        {building && <p><span className="text-muted-foreground">Building:</span> {building}</p>}
        {exp && <p><span className="text-muted-foreground">Experience / interests:</span> {exp}</p>}
        {support && <p><span className="text-muted-foreground">Startup support:</span> {support}</p>}
      </div>
    </div>
  );
}
