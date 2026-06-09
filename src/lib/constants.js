/**
 * Application-wide constants
 */

export const APP_NAME = 'AMIE';
export const APP_TAGLINE = 'AI Mock Interview Ecosystem';

/** Sidebar navigation items */
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Resume Analysis',
    path: '/resume-analysis',
    icon: 'FileText',
  },
  {
    label: 'Interview',
    path: '/interview/setup',
    icon: 'Mic',
    children: [
      { label: 'Setup', path: '/interview/setup' },
      { label: 'Session', path: '/interview/session' },
      { label: 'Results', path: '/interview/result' },
    ],
  },
  {
    label: 'Practice Plan',
    path: '/practice-plan',
    icon: 'Target',
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: 'User',
  },
];

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/** Interview difficulty levels */
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'hard', label: 'Hard', color: 'danger' },
];

/** Interview roles / categories */
export const INTERVIEW_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'System Design',
];

/** Chart.js default colors */
export const CHART_COLORS = {
  primary: 'rgba(99, 102, 241, 1)',
  primaryFaded: 'rgba(99, 102, 241, 0.2)',
  accent: 'rgba(236, 72, 153, 1)',
  accentFaded: 'rgba(236, 72, 153, 0.2)',
  success: 'rgba(34, 197, 94, 1)',
  successFaded: 'rgba(34, 197, 94, 0.2)',
  warning: 'rgba(234, 179, 8, 1)',
  warningFaded: 'rgba(234, 179, 8, 0.2)',
  danger: 'rgba(239, 68, 68, 1)',
  dangerFaded: 'rgba(239, 68, 68, 0.2)',
};
