export const DEFAULT_FIX_TITLE = 'Founders & Investors Xplore (FIX)';
export const DEFAULT_FIX_ABOUT = [
  'Founders & Investors Xplore (FIX) by CEDAT is an exclusive event that brings together founders, investors, mentors, startup ecosystem enablers & leaders.',
  'FIX also features a live startup pitch session, where selected founders will get the chance to present their startups directly to investors and enablers of the ecosystem.',
  'Founders will get live feedback, valuable insights and potential funding opportunities for their startup. Along with that, they can explore the startup ecosystem and communities through CEDAT for their startup journey.',
  'We will share a link to submit your pitch deck. Only shortlisted startups will be invited to present their pitch deck on the event day.',
  'Other registered founders & participants can attend the event as visitors, network with mentors, enablers, investors and gain valuable insights.',
];
export const DEFAULT_FIX_ABOUT_TEXT = DEFAULT_FIX_ABOUT.join('\n\n');
export const DEFAULT_FIX_SIDEBAR_TITLE = 'Why Join FIX?';
export const DEFAULT_FIX_SIDEBAR_POINTS = [
  'Learn from industry experts & mentors',
  'Build with founders, investors & enablers',
  'Explore partnerships, investments & grants',
  'Access to startup demos, meetups & events',
  'Unite with communities of startup ecosystem',
];

export type FixContentSettings = {
  registration_link?: string;
  title: string;
  about: string;
  sidebar_title: string;
  sidebar_points: string[];
};
