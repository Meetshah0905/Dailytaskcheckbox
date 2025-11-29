# Netlify Deployment Guide

This guide will help you deploy your RoutineFlow app to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Log in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in or create an account

2. **Add a New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository (GitHub, GitLab, or Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `RoutineFlow` (if your project is in a subfolder)
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/public`
   
   Note: These settings are already configured in `netlify.toml`, so Netlify should auto-detect them.

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at a URL like `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Navigate to your project**
   ```bash
   cd RoutineFlow
   ```

3. **Login to Netlify**
   ```bash
   netlify login
   ```

4. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Build Configuration

The project is configured with:
- **Build command**: `npm run build:client` (builds only the frontend)
- **Publish directory**: `dist/public` (Vite output directory)
- **Node version**: Netlify will use Node 18 by default

## Environment Variables

If you need to add environment variables:
1. Go to Site settings → Environment variables
2. Add any required variables
3. They will be available as `import.meta.env.VITE_*` in your code

## Custom Domain

To add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Site Shows 404
- Check that the publish directory is correct (`dist/public`)
- Verify the redirect rule in `netlify.toml` is working

### Assets Not Loading
- Ensure all assets are in the `client/public` folder
- Check that paths use relative URLs (not absolute)

## Notes

- This app uses **localStorage** for data storage, so no backend is required
- All data is stored in the user's browser
- The app works as a static site, perfect for Netlify

