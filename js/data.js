/* ==========================================================================
   PORTFOLIO DATA — the single source of truth for customizable content.

   Rebrand this site by editing only this file. It holds:
     • identity (name, role, email, location, availability)
     • social handles (GitHub, LinkedIn)
     • contact-form delivery settings
     • the technology lists rendered across every page (hero strengths,
       daily-stack band, and the technical-skills grid)

   Narrative content (About, experience timeline, project case studies,
   AI/architecture expertise, achievements, education/certifications) lives
   in the HTML files, as approved in the UI contract.

   After changing a value, refresh the browser — no build step is required.
   ========================================================================== */

window.PORTFOLIO_DATA = {
  /* ---- Site metadata (used for canonical URLs and structured data) ---- */
  site: {
    url: "https://alexmorgan.dev",          // <-- set to your real domain
    title: "MR Tony MR — Senior Software Engineer",
    description:
      "Senior software engineer with 9+ years building full-stack platforms, " +
      "system design and production AI. Portfolio, case studies and architecture work.",
    author: "MR Tony MR"
  },

  /* ---- Identity ---- */
  identity: {
    name: "MR Tony MR",
    initials: "TM",
    brand: { first: "tony", last: "mr" },
    role: "Senior Software Engineer",
    subrole: "Full-Stack & AI Platforms",
    email: "alex@alexmorgan.dev",
    mailto: "mailto:alex@alexmorgan.dev",
    location: "Seattle, WA",
    timezone: "Pacific Time (UTC−8)",
    availability: "Available for senior & staff engineering roles"
  },

  /* ---- Social handles (real profiles before publishing) ---- */
  social: {
    github: {
      url: "https://github.com/alexmorgan-dev",       // <-- placeholder
      handle: "github.com/alexmorgan-dev"
    },
    linkedin: {
      url: "https://www.linkedin.com/in/alexmorgan-dev", // <-- placeholder
      handle: "linkedin.com/in/alexmorgan-dev"
    }
  },

  /* ---- Contact form delivery ---- */
  contactForm: {
    /*
     * Set `endpoint` to a form service URL (Formspree, Getform, Basin, etc.)
     * to deliver messages for real. Leave it empty ("") to use the built-in
     * mailto: fallback, which opens the visitor's email client with the
     * message pre-filled.
     */
    endpoint: "",
    subject: "Portfolio contact — {name} ({role})"
  },

  /* ---- Technology lists (rendered by app.js) ---- */
  technologies: {
    /* Hero "key technical strengths" chips */
    heroStrengths: [
      "React & TypeScript",
      "Node.js & NestJS",
      "System design",
      "AI / LLM & RAG",
      "Cloud & CI/CD"
    ],

    /* "Daily stack" band below the hero */
    techBand: [
      "TypeScript", "React", "Angular", "Node.js", "NestJS",
      "Python", "PHP / Laravel", "PostgreSQL", "Docker", "AWS",
      "LLM & RAG", "CI/CD"
    ],

    /* Technical-skills grid (group → skills → level). Icons are keyed by name. */
    skillGroups: [
      {
        title: "Frontend",
        icon: "code",
        skills: [
          { name: "React", level: 95 },
          { name: "TypeScript", level: 95 },
          { name: "JavaScript (ES2023)", level: 95 },
          { name: "Angular", level: 88 },
          { name: "Design systems & WCAG 2.1 AA", level: 90 },
          { name: "Performance & Core Web Vitals", level: 87 }
        ]
      },
      {
        title: "Backend & APIs",
        icon: "server",
        skills: [
          { name: "Node.js", level: 95 },
          { name: "NestJS", level: 92 },
          { name: "REST & GraphQL API design", level: 94 },
          { name: "Python", level: 84 },
          { name: "PHP / Laravel", level: 80 },
          { name: "Queues & event-driven design", level: 88 }
        ]
      },
      {
        title: "Data & AI",
        icon: "database",
        skills: [
          { name: "PostgreSQL", level: 92 },
          { name: "LLM integration & orchestration", level: 90 },
          { name: "RAG pipelines & embeddings", level: 90 },
          { name: "pgvector / vector databases", level: 86 },
          { name: "Prompt engineering & evals", level: 88 },
          { name: "Redis & caching strategy", level: 88 }
        ]
      },
      {
        title: "Platform & delivery",
        icon: "cloud",
        skills: [
          { name: "Docker", level: 90 },
          { name: "CI/CD (GitHub Actions)", level: 92 },
          { name: "AWS (ECS, S3, SQS, RDS)", level: 86 },
          { name: "GCP (Cloud Run, GKE)", level: 79 },
          { name: "Git / GitHub workflow & review", level: 95 },
          { name: "Observability & incident response", level: 84 }
        ]
      }
    ]
  }
};
