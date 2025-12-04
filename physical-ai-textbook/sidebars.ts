import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'why-physical-ai',
    'learning-outcomes',
    'assessments',
    {
      type: 'category',
      label: 'Module 1: ROS2 Foundations',
      items: [
        'module-1-ros2/intro',
        'module-1-ros2/week-01-architecture',
        'module-1-ros2/week-02-topics-services',
        'module-1-ros2/week-03-launch-params',
        'module-1-ros2/week-04-tf2-urdf',
        'module-1-ros2/week-05-navigation',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Simulation',
      items: [
        'module-2-simulation/week-06-gazebo',
        'module-2-simulation/week-07-unity',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac',
      items: [
        'module-3-isaac/week-08-isaac-basics',
        'module-3-isaac/week-09-isaac-ros',
        'module-3-isaac/week-10-synthetic-data',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'module-4-vla/week-11-vla-architecture',
        'module-4-vla/week-12-finetuning',
        'module-4-vla/week-13-deployment',
        'module-4-vla/capstone',
      ],
    },
  ],
};

export default sidebars;
