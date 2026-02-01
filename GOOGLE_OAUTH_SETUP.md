# How to Get Google Client ID and Secret

Follow these steps to configure Google Sign-In for your application.

## 1. Create a Project on Google Cloud
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown at the top left.
3.  Click **New Project**.
4.  Enter a name (e.g., "Script Generator Auth") and click **Create**.
5.  Select your new project from the notification or dropdown.

## 2. Configure OAuth Consent Screen
1.  In the left sidebar, navigate to **APIs & Services** > **OAuth consent screen**.
2.  Select **External** (unless you are a Google Workspace user testing internally) and click **Create**.
3.  **App Information**:
    *   **App name**: Thunglish Script Generator
    *   **User support email**: Select your email.
    *   **Developer contact information**: Enter your email.
4.  Click **Save and Continue**.
5.  **Scopes**: Click **Add or Remove Scopes**.
    *   Select `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
    *   Click **Update**, then **Save and Continue**.
6.  **Test Users**: Add your own email address to test the login locally.
7.  Click **Save and Continue** until finished.

## 3. Create Credentials
1.  Go to **APIs & Services** > **Credentials** in the sidebar.
2.  Click **+ CREATE CREDENTIALS** (top of screen) > **OAuth client ID**.
3.  **Application type**: Select **Web application**.
4.  **Name**: "Next.js Client" (or similar).
5.  **Authorized JavaScript origins**:
    *   Add: `http://localhost:3000`
    *   (Later, add your Vercel domain: `https://your-app.vercel.app`)
6.  **Authorized redirect URIs**:
    *   Add: `http://localhost:3000/api/auth/callback/google`
    *   (Later, add production URI: `https://your-app.vercel.app/api/auth/callback/google`)
7.  Click **Create**.

## 4. Copy Your Keys
A popup will appear with your keys.
*   **Client ID**: Copy this to `GOOGLE_CLIENT_ID` in `.env.local`.
*   **Client Secret**: Copy this to `GOOGLE_CLIENT_SECRET` in `.env.local`.

> [!IMPORTANT]
> If you get a "Access Blocked: This app has not been verified" error during login, make sure you added your email to the **Test Users** list in the OAuth Consent Screen step.
