import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging Digital Brains and Physical Bodies',
  favicon: 'img/favicon.ico',

  url: 'https://yourusername.github.io',
  baseUrl: '/textbook-hackathon/',

  organizationName: 'yourusername',
  projectName: 'physical-ai-textbook',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/eDeveloper132/textbook-hackathon/tree/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Physical AI Textbook',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Course',
        },
        {
          href: 'https://github.com/eDeveloper132/textbook-hackathon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            {label: 'Introduction', to: '/intro'},
            {label: 'Module 1: ROS2', to: '/module-1-ros2/intro'},
            {label: 'Module 2: Simulation', to: '/module-2-simulation/week-06-gazebo'},
            {label: 'Module 3: Isaac', to: '/module-3-isaac/week-08-isaac-basics'},
            {label: 'Module 4: VLA', to: '/module-4-vla/week-11-vla-architecture'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'ROS2 Docs', href: 'https://docs.ros.org/en/humble/'},
            {label: 'Gazebo', href: 'https://gazebosim.org/'},
            {label: 'NVIDIA Isaac', href: 'https://developer.nvidia.com/isaac-sim'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'yaml', 'markup'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,

  customFields: {
    backendUrl: process.env.REACT_APP_BACKEND_URL || 'https://physical-ai-textbook-api.onrender.com',
    // Hardcoded to true for hackathon demo
    featureAuth: true,
    featureQuiz: true,
    featurePersonalization: true,
    featureUrdu: true,
  },
};

export default config;
