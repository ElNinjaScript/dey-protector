# DEY-PROTECTOR - Deployment & Setup Guide

## Prerequisites
- Supabase account connected in the v0 UI (already done ✓)
- Vercel account (free tier available at vercel.com)
- Node.js 18+ installed locally (optional, for local testing)

---

## Local Testing Setup

### 1. Verify Your Database is Running
The migration script has already been executed. Your `lua_files` table is ready in Supabase.

### 2. Check Environment Variables
In the v0 sidebar, go to **Vars** section and make sure these are set:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_BASE_URL` - Set to `http://localhost:3000` for local testing

### 3. Test Locally
1. Click the Preview button to test the app
2. Paste some Lua code in the textarea
3. Click "Generate Protection"
4. Copy the generated loadstring command
5. Open the file URL in a new tab to test the protection

---

## Deploying to Vercel

### Step 1: Publish to Vercel
1. In v0, click the **"Publish"** button (top right of your Block view)
2. Select "Create new project" or choose an existing one
3. Connect your GitHub (if prompted)
4. Click "Deploy"

### Step 2: Set Production Environment Variables
After deployment, add these to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the same variables from your v0 Vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **NEW**: `NEXT_PUBLIC_BASE_URL` = `https://your-project-name.vercel.app`

### Step 3: Update Your Domain
**Option A: Use Vercel Domain (Recommended)**
- Vercel automatically assigns `your-project-name.vercel.app`
- This URL is your `NEXT_PUBLIC_BASE_URL`

**Option B: Use Custom Domain**
1. In Vercel project → **Settings → Domains**
2. Add your custom domain (e.g., `protector.yourdomain.com`)
3. Set `NEXT_PUBLIC_BASE_URL` to your custom domain

### Step 4: Redeploy After Env Changes
1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select "Redeploy" - this applies the new env variables

---

## How It Works

### Uploading Code
1. User pastes Lua code on the main page
2. Click "Generate Protection"
3. API creates unique 12-character ID using nanoid
4. Code stored in Supabase `lua_files` table
5. User receives two URLs:
   - Protected file URL: `https://your-domain.com/file/[unique-id]`
   - Loadstring command: `loadstring(game:HttpGet("https://your-domain.com/file/[unique-id]"))()`

### Accessing Protected Code
When someone visits `/file/[unique-id]`, they see "access denied!" The unlock mechanism is completely hidden - only you know how it works.

---

## Troubleshooting

### "File not found" Error
- ✗ You're trying to access a file ID that doesn't exist in the database
- ✓ Upload code first through the main page to generate a valid ID
- ✓ Check that the file ID matches exactly

### Localhost URL Works but Won't Change to Vercel
1. Make sure you updated `NEXT_PUBLIC_BASE_URL` in Vercel env vars
2. After updating, click "Redeploy" in Vercel Deployments
3. Wait 1-2 minutes for the deployment to complete
4. Test with the new Vercel domain

### Code Not Saving to Database
- Check that Supabase integration is connected in v0
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase dashboard to confirm `lua_files` table exists



---

## Quick Reference: URLs After Deployment

| Type | Example |
|------|---------|
| Main Page | `https://your-domain.com/` |
| Protected File | `https://your-domain.com/file/gg96AH47GTIf` |
| Loadstring | `loadstring(game:HttpGet("https://your-domain.com/file/gg96AH47GTIf"))()` |

---

## Security Notes
- Supabase RLS (Row Level Security) is enabled on the `lua_files` table
- Anyone with the file URL can access the code, so only share with trusted developers
- The "hidden unlock" is security through obscurity - it deters casual access
- For maximum security, consider adding authentication before sharing URLs
