# Deployment Guide: Render (DB) & Vercel (App)

## 1. Prerequisites
*   [GitHub Account](https://github.com/) with this repository pushed.
*   [Render Account](https://render.com/) (for PostgreSQL).
*   [Vercel Account](https://vercel.com/) (for Next.js App).
*   [OpenAI API Key](https://platform.openai.com/).
*   [Razorpay Account](https://razorpay.com/) (optional, for payments).

## 2. Set up PostgreSQL on Render
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  Name: `script-generator-db` (or similar).
4.  Region: Closest to you (e.g., Singapore, Frankfurt).
5.  Plan: **Free** (for dev) or **Individual**.
6.  Click **Create Database**.
7.  Wait for it to restart directly. Copy the **External Database URL**.
    *   Looks like: `postgres://user:password@host.render.com/db_name`

## 3. Prepare Repository
Ensure your latest code (with Prisma config) is pushed to GitHub.
```bash
git add .
git commit -m "Migrate to Prisma"
git push origin main
```

## 4. Deploy to Vercel
1.  Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository (`script-generator`).
4.  **Configure Project**:
    *   **Build Command**: `npx prisma generate && next build` (Override if needed, but Next.js defaults are usually fine. **Important**: Prisma needs to generate the client during build).
    *   **Environment Variables**: Add the following:
        *   `DATABASE_URL`: (Paste the **External Database URL** from Render)
        *   `NEXTAUTH_SECRET`: (Generate a random string, e.g. `openssl rand -base64 32`)
        *   `NEXTAUTH_URL`: `https://your-project-name.vercel.app` (You can update this after deployment if the URL changes)
        *   `NEXT_PUBLIC_OPENAI_API_KEY`: (Your OpenAI Key)
        *   `GOOGLE_CLIENT_ID`: (Your Google OAuth ID)
        *   `GOOGLE_CLIENT_SECRET`: (Your Google OAuth Secret)
        *   `RAZORPAY_KEY_ID`: (Your Razorpay Key)
        *   `RAZORPAY_KEY_SECRET`: (Your Razorpay Secret)
5.  Click **Deploy**.

## 5. Initialize Database
After deployment (or during build if you add it to build command), you need to push the schema to the database.
You can do this from your local machine:

1.  Create a `.env` file locally if you haven't (add the Render Connection String).
    ```env
    DATABASE_URL="postgres://user:password@host.render.com/db_name"
    ```
2.  Run the push command:
    ```bash
    npx prisma db push
    ```
    *This creates the tables in your Render database.*

## 6. Verification
1.  Visit your Vercel URL.
2.  Try logging in (this verifies Database connection + Auth).
3.  Try generating a script.

> [!NOTE]
> If you see database errors, check the `DATABASE_URL` in Vercel environment variables and ensure you ran `npx prisma db push`.
