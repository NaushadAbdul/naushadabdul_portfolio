import type { Experience, Project, Service, Skill, Testimonial } from "./types";

/**
 * Fallback content.
 *
 * `lib/data.ts` serves this whenever Supabase is not configured or a query
 * fails, so the site never renders empty. Once your tables have rows this is
 * ignored — but it doubles as the shape reference for what to insert.
 */

export const fallbackServices: Service[] = [
  {
    id: "fallback-service-ai",
    title: "AI Integration & Agents",
    description:
      "LLM features that survive contact with real users — RAG over your own data, tool-calling agents, evals and guardrails wired into the product you already have.",
    icon: "◆",
    accent: "yellow",
    display_order: 1,
  },
  {
    id: "fallback-service-web",
    title: "Web Development",
    description:
      "Production Next.js applications: fast, accessible, typed end to end, and structured so the second year of the codebase is as pleasant as the first.",
    icon: "▣",
    accent: "blue",
    display_order: 2,
  },
  {
    id: "fallback-service-automation",
    title: "Automation & Workflows",
    description:
      "The repetitive work nobody wants. Scheduled jobs, webhook pipelines and integrations that replace copy-paste operations with something observable.",
    icon: "⟳",
    accent: "pink",
    display_order: 3,
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "fallback-project-nexus",
    slug: "nexus-docs-copilot",
    title: "Nexus Docs Copilot",
    tagline: "Answers from 4,000 pages of internal docs in under two seconds.",
    description:
      "A retrieval-augmented assistant over a support team's scattered knowledge base. Chunking pipeline, hybrid search, streaming answers with citations back to the source paragraph.",
    year: "2026",
    role: "Design & full-stack",
    stack: ["Next.js", "TypeScript", "pgvector", "LLM APIs"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: true,
    accent: "yellow",
    display_order: 1,
  },
  {
    id: "fallback-project-flowline",
    slug: "flowline-automations",
    title: "Flowline",
    tagline: "An ops dashboard that removed six hours of manual work per week.",
    description:
      "Visual builder for recurring back-office jobs. Non-technical staff compose triggers and steps, the platform runs them on schedule and surfaces every failure instead of hiding it.",
    year: "2025",
    role: "Full-stack",
    stack: ["Next.js", "Postgres", "Queue workers", "Webhooks"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: true,
    accent: "blue",
    display_order: 2,
  },
  {
    id: "fallback-project-pulse",
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    tagline: "Realtime product metrics that load before you finish scrolling.",
    description:
      "Event ingestion plus a sub-second dashboard. Materialised rollups, streaming updates over a socket, and a chart layer built for dense data on small screens.",
    year: "2025",
    role: "Front-end & data",
    stack: ["React", "WebSockets", "Redis", "D3"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: true,
    accent: "pink",
    display_order: 3,
  },
  {
    id: "fallback-project-atlas",
    slug: "atlas-support-agent",
    title: "Atlas Support Agent",
    tagline: "Tier-one tickets answered end to end, with a human still in the loop.",
    description:
      "An agentic triage layer over a helpdesk inbox. Classifies, drafts, and either resolves or escalates with a written rationale attached for the human reviewer.",
    year: "2024",
    role: "AI engineering",
    stack: ["Python", "Agents", "Postgres", "REST APIs"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: false,
    accent: "lime",
    display_order: 4,
  },
  {
    id: "fallback-project-forge",
    slug: "forge-component-system",
    title: "Forge",
    tagline: "A component system one designer and one developer could actually maintain.",
    description:
      "Documented React primitives with tokens, accessibility baked in, and a playground so design decisions stopped being arguments in pull requests.",
    year: "2024",
    role: "Design systems",
    stack: ["React", "Tailwind CSS", "Storybook"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: false,
    accent: "purple",
    display_order: 5,
  },
  {
    id: "fallback-project-relay",
    slug: "relay-intake",
    title: "Relay",
    tagline: "Client intake that goes from PDF to database without a human typing.",
    description:
      "Document parsing pipeline that extracts structured records from inconsistent PDFs, flags low-confidence fields, and pushes clean rows into the CRM.",
    year: "2023",
    role: "Automation",
    stack: ["Node.js", "OCR", "Supabase", "Cron"],
    image_url: null,
    live_url: null,
    repo_url: null,
    featured: false,
    accent: "orange",
    display_order: 6,
  },
];

export const fallbackSkills: Skill[] = [
  { id: "fallback-skill-1", name: "LLM Integration", category: "AI & ML", level: 5, display_order: 1 },
  { id: "fallback-skill-2", name: "RAG Pipelines", category: "AI & ML", level: 5, display_order: 2 },
  { id: "fallback-skill-3", name: "Agent Frameworks", category: "AI & ML", level: 4, display_order: 3 },
  { id: "fallback-skill-4", name: "TypeScript", category: "Frontend", level: 5, display_order: 4 },
  { id: "fallback-skill-5", name: "React", category: "Frontend", level: 5, display_order: 5 },
  { id: "fallback-skill-6", name: "Next.js", category: "Frontend", level: 5, display_order: 6 },
  { id: "fallback-skill-7", name: "Tailwind CSS", category: "Frontend", level: 5, display_order: 7 },
  { id: "fallback-skill-8", name: "Node.js", category: "Backend", level: 4, display_order: 8 },
  { id: "fallback-skill-9", name: "PostgreSQL", category: "Backend", level: 4, display_order: 9 },
  { id: "fallback-skill-10", name: "Supabase", category: "Backend", level: 4, display_order: 10 },
  { id: "fallback-skill-11", name: "Workflow Design", category: "Automation", level: 4, display_order: 11 },
  { id: "fallback-skill-12", name: "Webhooks & Queues", category: "Automation", level: 4, display_order: 12 },
];

export const fallbackExperience: Experience[] = [
  {
    id: "fallback-exp-1",
    role: "Independent Developer & Consultant",
    company: "Self-employed",
    company_url: null,
    location: "Remote",
    start_date: "2023",
    end_date: "",
    is_current: true,
    description:
      "Building AI features, product surfaces and automation for small teams. Typically the first technical hire on a project — scope it, ship it, then hand it over with documentation.",
    display_order: 1,
  },
  {
    id: "fallback-exp-2",
    role: "Senior Full-Stack Developer",
    company: "Nimbus Softworks",
    company_url: null,
    location: "Hybrid",
    start_date: "2021",
    end_date: "2023",
    is_current: false,
    description:
      "Owned the customer-facing dashboard end to end. Cut page load times by half, introduced typed APIs across the stack, and mentored two junior developers.",
    display_order: 2,
  },
  {
    id: "fallback-exp-3",
    role: "Full-Stack Developer",
    company: "Kirana Labs",
    company_url: null,
    location: "On-site",
    start_date: "2019",
    end_date: "2021",
    is_current: false,
    description:
      "Shipped internal tools for operations teams, including a reporting pipeline that replaced a manual spreadsheet process running several hours a week.",
    display_order: 3,
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-quote-1",
    quote:
      "He replaced a process our team had accepted as unavoidable. Two weeks later it ran itself, and it has not needed a fix since.",
    author_name: "Priya Raghavan",
    author_role: "Head of Operations",
    author_company: "Sample Company",
    avatar_url: null,
    featured: true,
    display_order: 1,
  },
  {
    id: "fallback-quote-2",
    quote:
      "Clear communication, honest estimates, and code the next developer could actually read. That combination is rarer than it should be.",
    author_name: "Daniel Okonkwo",
    author_role: "Founder",
    author_company: "Sample Startup",
    avatar_url: null,
    featured: true,
    display_order: 2,
  },
  {
    id: "fallback-quote-3",
    quote:
      "We asked for an AI feature and got an AI feature that works in production. The evals and guardrails were his idea, and they are the reason we trust it.",
    author_name: "Mei Lin Tan",
    author_role: "Product Lead",
    author_company: "Sample Studio",
    avatar_url: null,
    featured: true,
    display_order: 3,
  },
];
