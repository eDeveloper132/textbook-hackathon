# RoboSim Portfolio Constitution

## Core Principles

### I. Free Tools Only
All tools and services must be free-tier or open-source:
- **Documentation**: Docusaurus (static site generator)
- **Hosting**: GitHub Pages (free hosting)
- **Database**: Neon PostgreSQL (free tier) or Qdrant (free tier for vector search)
- **CI/CD**: GitHub Actions (free for public repos)
- No paid services, subscriptions, or premium tiers allowed

### II. Minimal Codebase (<500 LOC)
Total lines of code must stay under 500 LOC:
- Prioritize simplicity over features
- Use existing libraries/frameworks instead of custom code
- Each module should be <100 LOC
- Measure with `cloc` or equivalent; exclude config files

### III. ROS2/Gazebo/Isaac Focus
All simulation projects must target robotics simulation:
- **ROS2**: Primary robotics middleware
- **Gazebo**: Physics simulation environment
- **Isaac Sim**: NVIDIA's robotics simulation platform
- Portfolio showcases robotic simulation expertise

### IV. Test-Driven Development (NON-NEGOTIABLE)
TDD mandatory for all modules:
- Write tests FIRST, then implement
- Red → Green → Refactor cycle enforced
- Minimum 80% code coverage
- No merge without passing tests

### V. Modular Architecture (Bonus-Ready)
Design for extensibility and bonus features:
- Each feature is a standalone module
- Clear interfaces between modules
- Easy to add/remove features
- Plugin-style architecture where possible

### VI. Simplicity First
YAGNI (You Aren't Gonna Need It) principles:
- Start with MVP, add features incrementally
- No over-engineering or premature optimization
- Documentation over complex code
- If in doubt, leave it out

## Technology Stack

| Layer | Technology | Constraint |
|-------|------------|------------|
| Frontend | Docusaurus | Static only |
| Hosting | GitHub Pages | Free tier |
| Database | Neon/Qdrant | Free tier |
| CI/CD | GitHub Actions | Public repo |
| Simulations | ROS2, Gazebo, Isaac | Open-source |

## Development Workflow

1. **Feature Request** → Create spec document
2. **TDD** → Write failing tests first
3. **Implement** → Minimal code to pass tests
4. **Review** → LOC check (<500 total)
5. **Deploy** → GitHub Pages auto-deploy

## Governance

- Constitution supersedes all other decisions
- Any tool/service addition must be verified as free-tier
- LOC budget violations block deployment
- Amendments require documented justification

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
