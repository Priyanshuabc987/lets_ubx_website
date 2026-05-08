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

export type FixQuestionType = 'text' | 'textarea' | 'select' | 'url';

export interface FixQuestion {
  id: string;
  label: string;
  type: FixQuestionType;
  required: boolean;
  options?: string[]; // for select
  placeholder?: string;
  description?: string;
}

export type FixContentSettings = {
  registration_link?: string;
  title: string;
  about: string;
  sidebar_title: string;
  sidebar_points: string[];
  // New registration form settings
  registration_title?: string;
  registration_description?: string;
  registration_questions?: FixQuestion[];
};

export const DEFAULT_FIX_REG_TITLE = 'Founders & Investors Xplore (FIX) By CEDAT';
export const DEFAULT_FIX_REG_DESCRIPTION = 'CEDAT - Dynamic Ecosystem of Nexus Communities. Only shortlisted startups will be onboarded to CEDAT. A registration fee of Rs5000 applies only to those shortlisted & confirmed startups';

export const DEFAULT_FIX_QUESTIONS: FixQuestion[] = [
  { id: 'name', label: '1. Name', type: 'text', required: true },
  { id: 'email', label: '2. Mail ID', type: 'text', required: true },
  { id: 'phone', label: '3. Phone Number', type: 'text', required: true },
  { id: 'founder_linkedin', label: "4. Founder's Linkedin", type: 'url', required: false },
  { id: 'startup_name', label: '5. Name of the startup or company', type: 'text', required: true },
  {
    id: 'startup_stage',
    label: '6. Select the stage of your startup from the options below',
    type: 'select',
    required: true,
    options: ['Idea Stage', 'Early Stage', 'MVP Stage', 'Growth Stage', 'Revenue Stage']
  },
  { id: 'startup_summary', label: '7. Kindly share about your startup (Max 300 words)', type: 'textarea', required: true },
  { id: 'support_needed', label: '8. What kind of support or resources do you need for your startup (Max 300 Words)', type: 'textarea', required: true },
  { id: 'additional_info', label: '9. Is there anything else you would like us to know about your experiences, interests & skills (Max 300 Words)', type: 'textarea', required: true },
  {
    id: 'pitch_deck_link',
    label: '10. Upload a Google Drive link that includes your pitch deck and any other documents to be shared.',
    type: 'url',
    required: true,
    description: 'Please ensure the access is given to "Anyone with the link can view"'
  },
];
