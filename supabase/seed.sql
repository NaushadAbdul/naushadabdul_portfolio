-- ============================================================
--  Seed content — run AFTER schema.sql
--
--  Both statements are idempotent and non-destructive: they only
--  insert when the table is still empty, so re-running this file
--  after you have added your own rows does nothing.
-- ============================================================

insert into public.services (title, description, icon, accent, display_order)
select title, description, icon, accent, display_order
from (values
  (
    'AI Integration & Agents',
    'LLM features that survive contact with real users — RAG over your own data, tool-calling agents, evals and guardrails wired into the product you already have.',
    '◆', 'yellow', 1
  ),
  (
    'Web Development',
    'Production Next.js applications: fast, accessible, typed end to end, and structured so the second year of the codebase is as pleasant as the first.',
    '▣', 'blue', 2
  ),
  (
    'Automation & Workflows',
    'The repetitive work nobody wants. Scheduled jobs, webhook pipelines and integrations that replace copy-paste operations with something observable.',
    '⟳', 'pink', 3
  )
) as seed(title, description, icon, accent, display_order)
where not exists (select 1 from public.services);

insert into public.projects (
  slug, title, tagline, description, year, role, stack, featured, accent, display_order
)
select slug, title, tagline, description, year, role, stack, featured, accent, display_order
from (values
  (
    'nexus-docs-copilot',
    'Nexus Docs Copilot',
    'Answers from 4,000 pages of internal docs in under two seconds.',
    'A retrieval-augmented assistant over a support team''s scattered knowledge base. Chunking pipeline, hybrid search, streaming answers with citations back to the source paragraph.',
    '2026', 'Design & full-stack',
    array['Next.js', 'TypeScript', 'pgvector', 'LLM APIs'],
    true, 'yellow', 1
  ),
  (
    'flowline-automations',
    'Flowline',
    'An ops dashboard that removed six hours of manual work per week.',
    'Visual builder for recurring back-office jobs. Non-technical staff compose triggers and steps, the platform runs them on schedule and surfaces every failure instead of hiding it.',
    '2025', 'Full-stack',
    array['Next.js', 'Postgres', 'Queue workers', 'Webhooks'],
    true, 'blue', 2
  ),
  (
    'pulse-analytics',
    'Pulse Analytics',
    'Realtime product metrics that load before you finish scrolling.',
    'Event ingestion plus a sub-second dashboard. Materialised rollups, streaming updates over a socket, and a chart layer built for dense data on small screens.',
    '2025', 'Front-end & data',
    array['React', 'WebSockets', 'Redis', 'D3'],
    true, 'pink', 3
  ),
  (
    'atlas-support-agent',
    'Atlas Support Agent',
    'Tier-one tickets answered end to end, with a human still in the loop.',
    'An agentic triage layer over a helpdesk inbox. Classifies, drafts, and either resolves or escalates with a written rationale attached for the human reviewer.',
    '2024', 'AI engineering',
    array['Python', 'Agents', 'Postgres', 'REST APIs'],
    false, 'lime', 4
  ),
  (
    'forge-component-system',
    'Forge',
    'A component system one designer and one developer could actually maintain.',
    'Documented React primitives with tokens, accessibility baked in, and a playground so design decisions stopped being arguments in pull requests.',
    '2024', 'Design systems',
    array['React', 'Tailwind CSS', 'Storybook'],
    false, 'purple', 5
  ),
  (
    'relay-intake',
    'Relay',
    'Client intake that goes from PDF to database without a human typing.',
    'Document parsing pipeline that extracts structured records from inconsistent PDFs, flags low-confidence fields, and pushes clean rows into the CRM.',
    '2023', 'Automation',
    array['Node.js', 'OCR', 'Supabase', 'Cron'],
    false, 'orange', 6
  )
) as seed(slug, title, tagline, description, year, role, stack, featured, accent, display_order)
where not exists (select 1 from public.projects);
