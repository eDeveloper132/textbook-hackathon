import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/intro">
            Start Learning 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Learn ROS2, Gazebo, Isaac Sim, and VLA models">
      <HomepageHeader />
      <main>
        <div className="container" style={{padding: '2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            <div className="card">
              <div className="card__header"><h3>🤖 ROS2 Foundations</h3></div>
              <div className="card__body"><p>Master the robotics middleware powering modern robots.</p></div>
            </div>
            <div className="card">
              <div className="card__header"><h3>🎮 Simulation</h3></div>
              <div className="card__body"><p>Build and test robots in Gazebo and Unity.</p></div>
            </div>
            <div className="card">
              <div className="card__header"><h3>💚 NVIDIA Isaac</h3></div>
              <div className="card__body"><p>Leverage photorealistic simulation and synthetic data.</p></div>
            </div>
            <div className="card">
              <div className="card__header"><h3>🧠 VLA Models</h3></div>
              <div className="card__body"><p>Deploy Vision-Language-Action models on robots.</p></div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
