# Supabase Setup (one-time, ~10 minutes)

This connects the site to a free cloud database so a learner's progress is saved to the cloud and works on any device. You only do this once.

## Step 1 — Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (or sign in).
2. Click **New project**.
3. Give it a name (e.g. `fde-academy`), pick a database password (save it somewhere), pick the region closest to you.
4. Click **Create new project** and wait about 2 minutes while it starts up.

## Step 2 — Create the database tables

1. In your Supabase project dashboard, click **SQL Editor** in the left menu, then **New query**.
2. Open the file `supabase/schema.sql` in this repo, copy its **entire contents**, and paste them into the query box.
3. Press **Run**. You should see "Success" — this creates the `profiles` and `mentor_progress` tables, the security rules, and the auto-setup for new sign-ups.

## Step 3 — Add the two secrets to GitHub

1. In your GitHub repo, go to **Settings → Secrets and variables → Actions → New repository secret**.
2. Add a secret named **exactly** `VITE_SUPABASE_URL` with this value:
   In Supabase: **Settings → API → Project URL** (copy it).
3. Add a secret named **exactly** `VITE_SUPABASE_ANON_KEY` with this value:
   In Supabase: **Settings → API → Project API keys → anon public** (copy it).
4. Never paste these keys anywhere else (not in chat, code, or files). The `anon public` key is safe to use in the website; it only lets learners see their own data.

## Step 4 — Give the website the two secrets at build time

1. Open `.github/workflows/academy-pages.yml` on GitHub and click the **pencil (edit)** icon.
2. Find the step that says `- run: npm run build` — it already has an `env:` block with `BASE_PATH`.
3. Add the two lines below **under** that `env:` (keep the `BASE_PATH` line). Watch the spaces — indentation must match:

```yaml
        env:
          BASE_PATH: /${{ github.event.repository.name }}/
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

4. Click **Commit changes**. The site rebuilds in a couple of minutes.

## How to check it worked

Sign up on the site — your progress should show **"Saved to cloud ✓"**. If the secrets are missing, the site still works fully offline (progress stays in the browser).
