/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  THIS IS THE ONLY FILE YOU NEED TO EDIT.                                  │
 * │                                                                           │
 * │  Replace the values below with your own and you have your portfolio —     │
 * │  no component, style, or layout code needs to change. Every piece of      │
 * │  on-screen text lives here.                                               │
 * │                                                                           │
 * │  No secrets belong in this file: it is bundled into the public app and    │
 * │  the repository is open source.                                           │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  /** Public URL (repo, live site, store listing). Optional. */
  url?: string;
  /** Icon name — see src/portfolio/utils/icons.ts for the available names. */
  icon?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
  icon?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

/** Eyebrow + title shown at the top of a section. */
export interface SectionHeading {
  eyebrow: string;
  title: string;
}

export interface Portfolio {
  // ── Identity ────────────────────────────────────────────────────────────
  name: string;
  title: string;
  location: string;
  tagline: string;
  about: string;
  email: string;
  /** Optional avatar image URL. Falls back to initials when omitted. */
  avatarUrl?: string;

  // ── Hero ─────────────────────────────────────────────────────────────────
  /** Status pill above the avatar. Leave empty ('') to hide it. */
  availability: string;
  /** Labels for the two hero buttons (also reused by the sticky header). */
  actions: {
    contact: string;
    work: string;
  };
  /** The stat tiles in the hero. */
  highlights: {label: string; value: string}[];

  // ── Content ────────────────────────────────────────────────────────────-
  skills: SkillGroup[];
  projects: Project[];
  experience: Experience[];
  socials: SocialLink[];

  // ── Section headings ───────────────────────────────────────────────────-
  sections: {
    about: SectionHeading;
    skills: SectionHeading;
    projects: SectionHeading;
    experience: SectionHeading;
    contact: SectionHeading;
  };

  // ── Contact card copy ────────────────────────────────────────────────────
  contactCard: {
    heading: string;
    subheading: string;
    buttonLabel: string;
  };

  // ── Footer ────────────────────────────────────────────────────────────--
  footer: {
    /** Each string renders on its own line. */
    lines: string[];
    /** Tappable link, e.g. your repo or website. */
    linkLabel: string;
    linkUrl: string;
  };
}

export const portfolio: Portfolio = {
  name: 'Shiv Shankar Tiwari',
  title: 'Founder & Mobile / Full-Stack Engineer',
  location: 'India',
  tagline:
    'Building polished mobile apps and the CI/CD pipelines that ship them.',

  about:
    "I'm an engineer and founder passionate about React Native, developer tooling, and " +
    'release automation. I believe in shipping reliable apps end-to-end — from clean, ' +
    'accessible UIs to fully automated build-and-submit pipelines. ' +
    'This portfolio app itself demonstrates my approach: built with React Native and ' +
    'released to both app stores through an EAS + GitHub Actions CI/CD pipeline.',

  email: 'shiv@cuepilot.ai',

  availability: 'Available for select work',

  actions: {
    contact: 'Get in touch',
    work: 'View work',
  },

  // Hero stats. Keep these honest — edit the numbers to match your real story.
  highlights: [
    {label: 'Years Building', value: '5+'},
    {label: 'Apps Shipped', value: '10+'},
    {label: 'Open Source', value: '20+'},
  ],

  skills: [
    {
      title: 'Mobile Development',
      icon: 'phone',
      items: [
        'React Native',
        'TypeScript',
        'iOS (Swift)',
        'Android (Kotlin)',
        'Expo / EAS',
        'App Store Deployment',
      ],
    },
    {
      title: 'Web & Backend',
      icon: 'code',
      items: [
        'React.js',
        'Next.js',
        'Node.js',
        'Python',
        'PostgreSQL',
        'MongoDB',
        'REST & GraphQL APIs',
      ],
    },
    {
      title: 'DevOps & Cloud',
      icon: 'cloud',
      items: [
        'GitHub Actions',
        'CI/CD Pipelines',
        'AWS',
        'Docker',
        'Fastlane',
        'EAS Build & Submit',
      ],
    },
    {
      title: 'Tools & Practices',
      icon: 'tools',
      items: [
        'Git & GitHub',
        'Agile/Scrum',
        'Code Review',
        'Testing (Jest, Detox)',
        'Figma',
        'Technical Writing',
      ],
    },
  ],

  experience: [
    {
      role: 'Founder & Lead Engineer',
      company: 'CuePilot',
      period: '2023 - Present',
      description:
        'Building AI-powered productivity tools for creators and professionals.',
      highlights: [
        'Architected and shipped mobile apps to iOS and Android stores',
        'Built automated CI/CD pipelines reducing deployment time by 80%',
        'Led product development from concept to launch',
      ],
    },
    {
      role: 'Senior Mobile Engineer',
      // TODO: replace with your real employer name.
      company: 'Consumer Apps',
      period: '2020 - 2023',
      description:
        'Led React Native development for consumer-facing products used at scale.',
      highlights: [
        'Owned the mobile codebase across iOS and Android',
        'Cut cold-start and screen-load times through targeted profiling',
        'Mentored engineers and set the team’s code-review standards',
      ],
    },
    {
      role: 'Full-Stack Developer',
      company: 'Freelance & Consulting',
      period: '2018 - 2020',
      description:
        'Delivered web and mobile products end-to-end for startups and founders.',
      highlights: [
        'Shipped custom React and React Native apps from scratch',
        'Designed APIs, data models, and deployment workflows',
        'Turned one-off projects into long-term client relationships',
      ],
    },
  ],

  projects: [
    {
      name: 'CuePilot',
      description:
        'AI-powered teleprompter and presentation assistant. Helps creators deliver perfect takes with intelligent script management and real-time guidance.',
      tags: ['AI', 'React Native', 'Product'],
      url: 'https://cuepilot.ai',
      icon: 'rocket',
    },
    {
      name: 'IgniteKit',
      description:
        'Open-source React Native CI/CD starter kit. Features multi-environment builds, EAS integration, OTA updates, and automated App Store delivery. This portfolio runs on it!',
      tags: ['React Native', 'CI/CD', 'Open Source'],
      url: 'https://github.com/pythonsst/ReactNative-CICD',
      icon: 'flame',
    },
    {
      name: 'Portfolio App',
      description:
        'This very app! A showcase of modern React Native development with automated deployment to both app stores via GitHub Actions.',
      tags: ['React Native', 'TypeScript', 'Demo'],
      url: 'https://github.com/pythonsst/ReactNative-CICD',
      icon: 'star',
    },
  ],

  socials: [
    {label: 'GitHub', url: 'https://github.com/pythonsst', icon: 'github'},
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/shivshankartiwari',
      icon: 'linkedin',
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/shiv_tiwari_dev',
      icon: 'twitter',
    },
    {label: 'Website', url: 'https://cuepilot.ai', icon: 'globe'},
    {label: 'Email', url: 'mailto:shiv@cuepilot.ai', icon: 'mail'},
  ],

  sections: {
    about: {eyebrow: 'Who I am', title: 'About'},
    skills: {eyebrow: 'What I bring', title: 'Skills & Expertise'},
    projects: {eyebrow: 'Selected work', title: 'Featured Projects'},
    experience: {eyebrow: "Where I've been", title: 'Experience'},
    contact: {eyebrow: 'Say hello', title: "Let's Connect"},
  },

  contactCard: {
    heading: 'Have a project in mind?',
    subheading:
      "I'm always open to discussing new products, creative ideas, or " +
      'opportunities to be part of your vision.',
    buttonLabel: 'Send me an email',
  },

  footer: {
    lines: [
      '\u{1F4F1} Built with React Native',
      '\u{1F680} Deployed via EAS + GitHub Actions',
    ],
    linkLabel: '\u{2B50} Star on GitHub',
    linkUrl: 'https://github.com/pythonsst/ReactNative-CICD',
  },
};
