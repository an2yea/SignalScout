# Reddit Integration Setup Guide

## Step 1: Create Reddit Application

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the form:
   - **Name**: `SignalScout Reddit Bot`
   - **App type**: Select "web app"
   - **Description**: `SignalScout - Find and engage with high-intent prospects on Reddit`
   - **About URL**: `http://localhost:5173` (or your domain)
   - **Redirect URI**: `http://localhost:5173/auth/reddit/callback`

4. Click "Create app"
5. Copy the **Client ID** (under the app name) and **Client Secret**

## Step 2: Update Environment Variables

Your `.env` file should already have:
```env
VITE_REDDIT_CLIENT_ID=E3bzQgA1n5tPjNCT5N2k9g
VITE_REDDIT_CLIENT_SECRET=e654VmYfsMYfwWUiJCmW3kiir09wWg
```

## Step 3: Test the Integration

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:5173/test-reddit` to test with sample data
3. Click "Login to Reddit" button
4. Authorize the app in the popup
5. Click "🚀 Post Comment" to test commenting

## Step 4: How the Flow Works

1. **User clicks "Login & Post"** → Opens Reddit OAuth popup
2. **User authorizes your app** → Reddit redirects to callback
3. **Tokens are stored** → User is now authenticated
4. **User clicks "Post Comment"** → Comment is posted automatically
5. **Success!** → Reddit post opens to show the comment

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the redirect URI in Reddit app settings exactly matches `http://localhost:5173/auth/reddit/callback`
- **"Invalid client"**: Check that your client ID and secret are correct in `.env`
- **"Insufficient scope"**: The app requests `submit read identity` scopes - make sure these are enabled

## Production Deployment

When deploying to production:
1. Add your production domain as another redirect URI in Reddit app settings
2. Update environment variables on your hosting platform
3. The service automatically detects the current domain 