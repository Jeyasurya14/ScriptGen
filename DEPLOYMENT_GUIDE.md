# Deployment Guide: Vercel + PostgreSQL

This guide explains how to deploy your **Script Generator** application.
*   **Frontend**: Hosted on [Vercel](https://vercel.com).
*   **Backend (Database)**: Hosted on a PostgreSQL provider (e.g., Render, Neon, or Supabase).

---

## 1. Database Setup (PostgreSQL)

You need a PostgreSQL database hosted in the cloud. We recommend **Render**, **Neon**, or **Supabase** (Database only).

### Option A: Render (Recommended for simplicity)
1.  Log in to [Render.com](https://render.com).
2.  Click **New +** -> **PostgreSQL**.
3.  Name it (e.g., `script-gen-db`).
4.  Adding a **Region** close to you (e.g., Singapore/US).
5.  Select **Free Plan**.
6.  Once created, copy the **External Database URL**.
    *   It looks like: `postgres://user:password@hostname.render.com/dbname`

### Option B: Neon (Serverless) / Supabase
1.  Create a project/database.
2.  Get the **Connection String** (Transaction mode / pooled connection is fine).

---

## 2. Prepare the Database

Before deploying the app, you need to push your local schema to the new production database.

1.  Open your project terminal locally.
2.  Run the following command (replace `<YOUR_CONNECTION_STRING>` with the actual URL from Step 1):
    ```powershell
    # Temporarily set the URL for this command
    $env:DATABASE_URL="postgres://user:password@host/db..."
    
    # Push the schema
    npx prisma db push
    ```
    *   *Note: If permissions denied on PowerShell, you can also paste the URL into your local `.env` temporarily and run `npx prisma db push`.*

---

## 3. Deploy to Vercel

1.  Push your latest code to **GitHub**.
2.  Log in to [Vercel](https://vercel.com).
3.  Click **Add New...** -> **Project**.
4.  Import your `script-generator` repository.
5.  **Configure Project**:
    *   **Framework Preset**: Next.js (Auto-detected).
    *   **Root Directory**: `./` (Default).
6.  **Environment Variables** (Crucial!):
    *   Expand the "Environment Variables" section.
    *   Add the following:

| Name | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...` | The **External Database URL** from Step 1. |
| `NEXTAUTH_SECRET` | `(generate random)` | Run `openssl rand -base64 32` or type a long random string. |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Your temporary Vercel URL (or update this after first deploy). |
| `GOOGLE_CLIENT_ID` | `...` | Your Google OAuth Client ID. |
| `GOOGLE_CLIENT_SECRET` | `...` | Your Google OAuth Secret. |

7.  Click **Deploy**.

---

## 4. Updates & Maintenance

*   **Schema Changes**: If you modify `prisma/schema.prisma`, you must run `npx prisma db push` against your production database URL to update the tables.
*   **App Updates**: Just push to GitHub, and Vercel will auto-deploy.

---

### Troubleshooting
*   **Prisma Client Error**: Vercel automatically runs `prisma generate` during build (we added a `postinstall` script to ensure this).
*   **Connection Error**: Ensure your Database Provider allows connections from anywhere (0.0.0.0/0), which is default for Render Free tier.
