
export function getCommunityRoleCardStyles(role?: string) {
  const defaults = {
    card: "border-border/40 bg-card",
    avatarBg: "from-primary/20 to-primary/10",
    avatarBorder: "border-border/40",
    badge: "bg-primary/10 text-primary",
    badgeBorder: "border-primary/20",
    ctaBorder: "border-primary/20",
    ctaText: "text-primary",
    ctaHover: "hover:bg-primary/5",
  };

  switch (role) {
    case 'Investor':
      return {
        ...defaults,
        card: "border-green-500/20 bg-green-50/10",
        badge: "bg-green-100 text-green-700",
        ctaText: "text-green-700",
      };
    case 'Startup Founder':
      return {
        ...defaults,
        card: "border-cyan-500/20 bg-cyan-50/10",
        badge: "bg-cyan-100 text-cyan-700",
        ctaText: "text-cyan-700",
      };
    default:
      return defaults;
  }
}
