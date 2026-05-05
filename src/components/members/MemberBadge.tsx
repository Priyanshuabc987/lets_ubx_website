import * as React from 'react';

export type BadgeType = 'member' | 'participant' | 'speaker' | 'partner';

interface MemberBadgeProps {
	type?: BadgeType;
	className?: string;
}

export function MemberBadge({ type = 'member', className }: MemberBadgeProps) {
	const labelMap: Record<BadgeType, string> = {
		member: 'CEDAT Community Member',
		participant: 'Event Participant',
		speaker: 'Speaker / Partner',
		partner: 'Institutional Partner',
	};

	return (
		<span className={className}>
			{labelMap[type]}
		</span>
	);
}

