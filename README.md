# Abdul Naushad Ali — Portfolio + Admin

A neo-brutalist portfolio with a fully editable admin dashboard, built on
Next.js 16 (App Router), Tailwind CSS v4, Supabase and Resend.

Thick ink borders, hard offset shadows, and a six-colour palette
(yellow / lime / pink / blue / orange / purple).

```
Public site                          Admin
/                homepage            /admin                  dashboard
/projects        full archive        /admin/login            sign in
                                     /admin/projects         list · add · edit · delete · reorder
                                     /admin/services         CRUD
                                     /admin/skills           CRUD
                                     /admin/experience       CRUD
                                     /admin/testimonials     CRUD
                                     /admin/about            single record
                                     /admin/settings         single record + file uploads
                                     /admin/messages         inbox
                                     /admin/admins           who can sign in here
```

The homepage order is:
`Navbar → Hero → About → Skills → Experience → Services → Projects → Testimonials → Contact → Socials → Footer`

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The site runs with **no environment variables** — it falls back to the sample
content in `lib/content.ts`, so you can see the design immediately.

---

## 1. Database

Run these in the Supabase **SQL Editor**, in order. Both are idempotent, so
re-running is safe.

| File | What it creates |
| --- | --- |
| `supabase/schema.sql` | `services`, `projects` + public-read RLS |
| `supabase/admin.sql` | `admins`, `site_settings`, `skills`, `experience`, `testimonials`, `messages`, storage buckets, `is_admin()` and all policies |
| `supabase/admin-users.sql` | admin allow-list management: `list_admins()`, `admin_grant_by_email()`, and a guard that prevents removing the last admin |
| `supabase/seed.sql` | *(optional)* starter rows, only inserted if the table is empty |

Then add your Supabase credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Newer Supabase projects issue a **publishable** key; older ones have an **anon**
key. Either works — put it in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or the
legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`, both are read.

### Security model

Every table has Row Level Security on:

- **Reads** — public (anon) for content, so the site renders without a server.
- **Writes** — require `public.is_admin()`, a `SECURITY DEFINER` function that
  checks `auth.uid()` against the `admins` allow-list. RLS is the real
  authorisation layer; the admin UI only reflects it.
- **`messages`** — anon may *insert* only. Nobody can read the inbox without
  being an admin, so submissions cannot be scraped.

---

## 2. Create your admin account

1. **Supabase → Authentication → Users → Add user.** Enter your email and a
   password, and tick **Auto Confirm User**. (Signing up through `/admin/login`
   also works, but then you must confirm the email first.)
2. **Supabase → Authentication → Sign In / Providers → Email** and turn
   **off** "Allow new users to sign up". This is the important step — it stops
   strangers creating accounts.
3. Grant yourself admin by running the snippet at the bottom of
   `supabase/admin.sql`, with your email:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;
```

Now sign in at `/admin/login`. If you see *"That account is not an
administrator yet"*, step 3 has not been run for that account.

### Adding more admins later

`/admin/admins` manages the allow-list once you are signed in, so you never have
to touch SQL again:

- **Grant access to an existing account** — works with your normal key, via the
  `admin_grant_by_email()` function. No privileged secret needed.
- **Create a brand-new account at the same time** — this one operation needs
  `SUPABASE_SERVICE_ROLE_KEY`, because Supabase's Admin API is the only way to
  create an auth user. Add it to `.env.local` (see below) and the form will do
  both in one step. Without it, the form still grants existing accounts and
  tells you to create the user in the Supabase dashboard first.

Two safety rails: you cannot remove your own access, and a database trigger
rejects any deletion that would empty the allow-list — so there is no way to
lock everyone out of `/admin` by accident.

### `SUPABASE_SERVICE_ROLE_KEY` (optional, server-only)

```
SUPABASE_SERVICE_ROLE_KEY=
```

**Never prefix this with `NEXT_PUBLIC_`.** It bypasses Row Level Security
completely. It is read only by `lib/supabase/admin.ts`, which no Client
Component imports. If it ever leaks into the browser bundle, rotate it in the
dashboard immediately.

Everything except creating new auth accounts works without it.

---

## 3. Resend (optional email copy)

The contact form **always** writes to the `messages` inbox. Email is an extra
notification layer — without it, everything still works.

```
RESEND_API_KEY=re_...
CONTACT_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL=Portfolio <hello@yourdomain.com>
```

`CONTACT_FROM_EMAIL` is optional. It defaults to Resend's shared
`onboarding@resend.dev`, which **only delivers to the address your Resend
account was created with** — verify your own domain before going live.

The handler validates, drops honeypot submissions, rate-limits to 5/minute per
IP, and only reports failure when **both** the inbox write and the email fail.

---

## 4. File uploads

Two public storage buckets are created by `admin.sql`:

| Bucket | Used for |
| --- | --- |
| `media` | project covers, testimonial avatars, your portrait |
| `resume` | your CV (PDF) |

Uploads go straight from the browser to Supabase Storage, gated by policies that
only allow authenticated admins to write. Every upload field also accepts a
pasted URL if you would rather host the file elsewhere.

---

## How the admin is built

The repetitive part of a CRUD dashboard is the repetition, so there isn't any.
`lib/admin/resources.ts` declares each editable table once — its fields, types,
list columns and accent colour — and everything else is generic:

- **Three route files** (`[resource]`, `[resource]/new`, `[resource]/[id]`)
  render every list, create and edit screen, including services.
- **One server action** (`createRecord` / `updateRecord` / `deleteRecord` /
  `moveRecord`) validates and writes against the resource's field specs.
- **One form component** renders any field type: text, textarea, number,
  checkbox, select, comma-separated list, URL, image upload, file upload.

Adding a whole new editable table is therefore: add an entry to `resources`,
run a `create table`. No new pages, no new actions.

Two safety details worth knowing:

- `parseFields` only reads keys declared in the field specs, so a crafted POST
  cannot smuggle `id` or `display_order` into a write.
- The resource key from the URL is a **whitelist lookup**; unknown keys 404
  rather than reaching a query builder.

### Reordering

Rows have a `display_order` column. The ↑/↓ buttons swap a row with its
neighbour and renumber the whole list sequentially, which also repairs any gaps
left by earlier deletes. Buttons are disabled at the ends of the list.

---

## Things to change before deploying

- **`/admin/settings`** — name, initials, contact email, social URLs, portrait,
  résumé. These are placeholders in `lib/site.ts` until you save the settings
  form once.
- **`app/layout.tsx`** — `metadataBase` is `https://example.com`; point it at
  your real domain.
- **Sample content** — the projects, experience, skills and testimonials in
  `lib/content.ts` are invented placeholders. They are shown only until you add
  real rows, but the fabricated company names should not ship. Add real rows and
  the fallback disappears.
- **`supabase/seed.sql`** — skip it if you would rather start from an empty
  admin and enter everything yourself.

## Project structure

```
app/
  layout.tsx                 html, body, fonts (no chrome)
  (site)/layout.tsx          navbar + footer, settings-driven metadata
  (site)/page.tsx            homepage
  (site)/projects/page.tsx   archive
  admin/login/page.tsx
  admin/(dashboard)/          protected: shell + requireAdmin
  api/contact/route.ts       inbox write + Resend email
  globals.css                design tokens + brutalist utilities
components/
  navbar  hero  about  skills  experience  services  projects
  testimonials  contact  contact-form  socials  footer  portrait
  project-card  hero-graphics
  ui/                        Button, Card, SectionHeading, Marquee, Sticker
  admin/                     AdminShell, ResourceForm, ActionForm, PageHeader
lib/
  site.ts                    nav + default settings
  content.ts                 fallback content
  data.ts                    public readers (graceful fallback)
  socials.ts  portrait.ts  types.ts  utils.ts
  supabase/                  env, public, server (cookies), browser
  admin/                     resources, actions, auth, guard, parse, queries
middleware.ts                session refresh + /admin auth gate
supabase/                    schema.sql, admin.sql, seed.sql
```

## Design system

Tokens live in the `@theme` block at the top of `app/globals.css`:

- **Colours** — `--color-ink`, `--color-paper`, `--color-brut-{yellow,lime,pink,blue,orange,purple}`
- **Shadows** — `--shadow-brut-{xs,sm,lg,xl}` plus the base `shadow-brut`, all zero-blur offsets
- **Fonts** — Archivo Black (display), Space Grotesk (body), Space Mono (labels)
- **Utilities** — `brut-border`, `brut-border-2`, `grid-paper`, `grid-paper-dark`,
  `dots-ink`, `dots-paper`, `text-outline`, `text-outline-paper`, `press`

Interactive elements press flush into the page on hover: they translate by
exactly their shadow offset and the shadow drops to zero.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the build
npm run lint     # eslint
```
