# JAYBUILDS.IN — Database and admin setup

The Supabase project `jaybuilds-business` has been created in Mumbai (`ap-south-1`) and the database schema has been applied. The private dashboard frontend is at `/admin/`; its deployment follows the repository's normal Vercel GitHub integration.

## What is included
- Customer enquiries and quote requests
- Customers / business contacts
- Projects and project status
- Project updates table (for future progress-note UI)
- Quotes
- Payment records (tracking only; no payment gateway is connected)
- Tasks
- Allow-listed private administrators
- Row Level Security on all business tables

## Step 1 — Open the project
Supabase dashboard: https://supabase.com/dashboard/project/zggntkfvvswtlplmkwyy

Project URL: `https://zggntkfvvswtlplmkwyy.supabase.co`

The dashboard frontend uses the Supabase publishable key, which is designed for browser use with RLS enabled. Never put a secret key or `service_role` key in HTML, JavaScript, GitHub, or Vercel client-side configuration.

## Step 2 — Create your private admin account
1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create an account with an email you control and a strong unique password.
3. Copy the exact user UUID shown for that account.
4. In SQL Editor, run the following after replacing the UUID placeholder:

```sql
insert into public.admin_users (user_id, display_name)
values ('PASTE-THE-REAL-AUTH-USER-UUID-HERE', 'Jay')
on conflict (user_id) do update set display_name = excluded.display_name;
```

Do not share your password or UUID publicly. Do not enable public sign-up for administrator access.

## Step 3 — Open the dashboard
After Vercel deploys the latest commit, visit https://jaybuilds.in/admin/.

Sign in with the account created in Step 2. If the account has not been added to `public.admin_users`, the dashboard will reject access.

## Dashboard capabilities currently implemented
- Overview counts and latest enquiries
- View enquiries and update their status
- Add and view customers
- Add and view projects
- Create and view quotes
- Record and view payment status
- Add and view tasks (requires a valid project UUID)

## Important limitations
- Existing public website contact form and calculator still prepare WhatsApp messages; they are **not yet wired to save enquiries to the database**.
- Payment entries are manual records only. No payment gateway or automated reconciliation is connected.
- Project updates have a database table but no dedicated UI yet.
- Dashboard deployment must be verified after Vercel finishes building.

## Database tables
| Table | Purpose |
|---|---|
| `admin_users` | Explicit allow-list of administrators |
| `customers` | Customer / business contact records |
| `enquiries` | Enquiries; public inserts only |
| `projects` | Client work, status, due dates and live links |
| `project_updates` | Progress notes |
| `quotes` | Quotes and acceptance status |
| `payments` | Payment tracking, not payment processing |
| `tasks` | Internal project tasks |

## References
- Supabase database: https://supabase.com/docs/guides/database/overview
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Secure data: https://supabase.com/docs/guides/database/secure-data
