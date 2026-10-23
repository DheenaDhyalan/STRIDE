# STRIDE — Shoe Store Website

A responsive shoe storefront made with plain HTML, CSS, and JavaScript. It includes product filters, sorting, search, a working demo shopping bag, and a newsletter form. No authentication page is included.

## 1. Run locally

1. Download and extract the project ZIP.
2. Open the folder in VS Code.
3. Open `index.html` directly in your browser, or use the VS Code **Live Server** extension.
4. The store works in demo mode without Supabase. Product data is currently stored in `script.js`.

## 2. Optional: configure Supabase for newsletter subscriptions

The product list and cart are frontend demo features; the cart does not persist and checkout does not collect payments. Supabase is used only to save newsletter emails.

1. Go to [supabase.com](https://supabase.com/) and create a project.
2. In your project dashboard, open **SQL Editor → New query**.
3. Paste all the contents of `supabase.sql` and click **Run**. This creates the `newsletter_subscribers` table and enables Row Level Security.
4. Open **Project Settings → API** (or **Connect**, depending on the dashboard version). Copy your **Project URL** and the **publishable key** (or legacy `anon` key). Never use the `service_role` / secret key in browser code.
5. Open `config.js` and set:
   ```js
   window.STRIDE_SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
   window.STRIDE_SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";
   ```
6. In `index.html`, add these two lines just before `<script src="script.js"></script>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="config.js"></script>
   ```
7. Save and test the newsletter form. With valid settings, it should insert the email into Supabase. If you prefer not to configure Supabase, leave these steps out; the website still works in demo mode.

**Security note:** A browser-visible publishable/anon key is expected, but access must be constrained by Row Level Security and policies. Never expose a service-role/secret key. The SQL intentionally has no public read policy for subscriber emails.

## 3. Deploy to Vercel

### Option A — GitHub (recommended)
1. Create/sign in to a GitHub account.
2. Create a new repository, for example `stride-shoe-store`.
3. Upload the extracted project files (`index.html`, `style.css`, `script.js`, `config.js`, `supabase.sql`, `README.md`) to the repository root.
4. Go to [vercel.com](https://vercel.com/) and sign in.
5. Click **Add New → Project**, import the GitHub repository, then click **Deploy**.
6. This is a static website. Leave the framework preset as **Other** (or no framework), and leave the build command and output directory blank. The root directory should be the project root.
7. After deployment, open the Vercel-provided URL to check the site.

### Option B — Vercel CLI
1. Install Node.js from [nodejs.org](https://nodejs.org/).
2. Open a terminal in this project folder.
3. Run:
   ```bash
   npm install -g vercel
   vercel
   ```
4. Follow the prompts. For production deployment, run:
   ```bash
   vercel --prod
   ```

### Supabase settings on Vercel
If you used the optional `config.js` approach above, the values are static browser config and will be deployed with the files. For a public frontend, this is normal for the publishable/anon key; protect data with RLS. If you prefer Vercel Environment Variables, note that plain HTML/JS does not automatically read Vercel variables in the browser. You would need a build step or server-side function to inject them. Do not put secrets in frontend variables.

## 4. Customize

- Change products, prices, tags, images, and categories in `script.js`.
- Change colors and spacing in `style.css` under `:root`.
- Update store name, headline, and sections in `index.html`.
- Replace demo image URLs with your own licensed product photos.
- Connect a real checkout provider before accepting orders; this demo does not process payments.
