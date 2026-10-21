# JAYBUILDS.IN — Database and admin setup

This repository is a static HTML/CSS/JavaScript website deployed on Vercel. The database schema is prepared, but the live database cannot be created until you create a Supabase project and run the SQL yourself.

## What this setup covers
- Customer enquiries and quote requests
- Customers / business contacts
- Projects and project status
- Project updates
- Quotes
- Payment records (tracking only; no payment gateway is connected)
- Tasks
- Allow-listed private administrators

## Step 1 — Create the database
1. Open https://supabase.com and sign in.
2. Create a new project named `jaybuilds-business`.
3. Save the database password somewhere safe.
4. Wait for the project to finish provisioning.

## Step 2 — Create the tables securely
1. In this GitHub repository, open `supabase/schema.sql`.
2. Copy the complete SQL file.
3. In Supabase, open **SQL Editor** → **New query**.
4. Paste the SQL and click **Run**.
5. Confirm the tables appear in **Table Editor**.

The schema enables Row Level Security and allows the public to insert new enquiries only. Customers, project records, quotes, payments and tasks are restricted to an administrator explicitly added to `admin_users`.

## Step 3 — Create your private admin user
1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create your own account using an email you control. Use a strong unique password.
3. Open that user's details and copy the exact user UUID.
4. In SQL Editor, run the following after replacing both placeholders:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE-THE-REAL-AUTH-USER-UUID-HERE', 'Jay')
on conflict (user_id) do update set display_name = excluded.display_name;
```

Never share your password or secret keys in chat. Do not add a public sign-up form for admin access.

## Step 4 — Important current limitation
The current public website is static. This change adds the database schema and setup guide to GitHub; it does **not** yet connect the existing enquiry form, calculator or WhatsApp buttons to the database, and it does not create a working authenticated admin dashboard. Those require a Supabase project URL and publishable key, then frontend integration and testing. The website can continue using WhatsApp while this is pending.

## Step 5 — Secure configuration for the next implementation
After the project is created, collect only:
- Supabase Project URL
- Supabase publishable key (safe for browser use when RLS is configured)

These are available in Supabase **Project Settings → API** (labels may vary). Add them to the website's frontend configuration. Never put a Supabase secret key or legacy `service_role` key in HTML, JavaScript, GitHub, or Vercel client-side environment variables.

## Database tables
| Table | Purpose |
|---|---|
| `admin_users` | Explicit allow-list of administrators |
| `customers` | Customer / business contact records |
| `enquiries` | Public quote and contact submissions |
| `projects` | Client work, status, due dates and live links |
| `project_updates` | Progress notes |
| `quotes` | Quotes and acceptance status |
| `payments` | Payment tracking, not payment processing |
| `tasks` | Internal project tasks |

## References
- Supabase database: https://supabase.com/docs/guides/database/overview
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Secure data: https://supabase.com/docs/guides/database/secure-data
