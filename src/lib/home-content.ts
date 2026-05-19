export const DEFAULT_HOME_TITLE = 'Startup Ecosystem Meetups & Events';
export const DEFAULT_HOME_DESCRIPTION =
  "Explore exclusive meetups and networking sessions. Let's UBX is your gateway to the heart of the Bengaluru startup ecosystem.";

export const DEFAULT_UBX_UNITE_TITLE = "Let's Unite";
export const DEFAULT_UBX_UNITE_DESCRIPTION =
  'Event listings and hosting for meetups, workshops, programs, and startup gatherings.';
export const DEFAULT_UBX_UNITE_CARDS = ['Events', 'Meetups', 'Seminars', 'Programs', 'Workshops'];

export const DEFAULT_UBX_BUILD_TITLE = "Let's Build";
export const DEFAULT_UBX_BUILD_DESCRIPTION =
  'A builder platform led by FIX for startup showcases, founder feedback, and growth opportunities.';
export const DEFAULT_UBX_BUILD_CARDS = ['Ideas', 'Projects', 'Startups', 'Incubations', 'Investments'];

export const DEFAULT_UBX_XPLORE_TITLE = "Let's Xplore";
export const DEFAULT_UBX_XPLORE_DESCRIPTION =
  'Ask Us, opportunity listings, and hosting support for colleges, companies, and communities.';
export const DEFAULT_UBX_XPLORE_CARDS = ['Companies', 'Ecosystems', 'Connections', 'Communities', 'Collaborations'];

export const DEFAULT_SOCIAL_TITLE = 'Follow Our Journey';
export const DEFAULT_SOCIAL_SUBTITLE = "Stay updated with the latest from Let's UBX on social media.";
export const DEFAULT_LINKEDIN_LABEL = 'LinkedIn Updates';
export const DEFAULT_INSTAGRAM_LABEL = 'Instagram Highlights';
export const DEFAULT_YOUTUBE_LABEL = 'YouTube Podcasts';

export const DEFAULT_FIX_TITLE = "Founders & Investors Xplore (FIX) by Let's UBX - Pitch Your Startup";
export const DEFAULT_FIX_DESCRIPTION = "FIX also features a live startup pitch session, where selected founders will get the chance to present their startups directly to investors and enablers of the ecosystem.\n\nFounders will get live feedback, valuable insights, and potential funding opportunities for their startup. Along with that, they can explore the startup ecosystem and communities through Let's UBX for their startup journey.";
export const DEFAULT_FIX_APPLY_LABEL = 'Apply Now';
export const DEFAULT_FIX_CONTACT_LABEL = 'Contact Us';

export const DEFAULT_FOOTER_DESCRIPTION = 'Dynamic ecosystem of nexus communities for founders, investors, mentors, experts, enablers, operators, professionals, freelancers, learners & students';

export type HomeSettings = {
  title: string;
  description: string;
  // UBX Section
  ubxUniteTitle: string;
  ubxUniteDescription: string;
  ubxUniteCards: string[];
  ubxBuildTitle: string;
  ubxBuildDescription: string;
  ubxBuildCards: string[];
  ubxXploreTitle: string;
  ubxXploreDescription: string;
  ubxXploreCards: string[];
  // Social Feed
  socialTitle: string;
  socialSubtitle: string;
  linkedinLabel: string;
  instagramLabel: string;
  youtubeLabel: string;
  // FIX Section
  fixTitle: string;
  fixDescription: string;
  fixApplyLabel: string;
  fixContactLabel: string;
  // Footer
  footerDescription: string;
  footerContactText: string;
  footerContactPhone: string;
  // Events Page
  eventsTitle: string;
  eventsDescription: string;
  // Gallery Page
  galleryTitle: string;
  galleryDescription: string;
  // Ask Us Page
  askUsTitle: string;
  askUsDescription: string;
  askUsCardTitle: string;
  askUsCardDescription: string;
  askUsButtonLabel: string;
};

export const DEFAULT_FOOTER_CONTACT_TEXT = 'Have important questions? Contact us at';
export const DEFAULT_FOOTER_CONTACT_PHONE = '+91 74063 45305';

export const DEFAULT_EVENTS_TITLE = "Bengaluru's Startup Meetups & Events";
export const DEFAULT_EVENTS_DESCRIPTION = "Let’s Unite | Let's Build | Let’s Xplore - Dynamic Ecosystem of Nexus Communities";

export const DEFAULT_GALLERY_TITLE = 'Community Moments';
export const DEFAULT_GALLERY_DESCRIPTION = 'Capturing the energy of innovation. See what happens when the ecosystem unites.';

export const DEFAULT_ASK_US_TITLE = 'Ask Us';
export const DEFAULT_ASK_US_DESCRIPTION = 'For any requirement or help from the community, please fill this form.';
export const DEFAULT_ASK_US_CARD_TITLE = 'Submit Enquiry';
export const DEFAULT_ASK_US_CARD_DESCRIPTION = "We're here to help you navigate the ecosystem. Click the button below to submit your Enquiry via our form.";
export const DEFAULT_ASK_US_BUTTON_LABEL = 'Submit Now';
