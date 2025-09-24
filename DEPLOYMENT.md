# 🚀 Vercel Deployment Guide

This guide will help you deploy your Mobile Notion Second Brain System to Vercel.

## Prerequisites

- GitHub repository with your code (already pushed)
- Vercel account (free tier available)
- Database configuration for production

## Step 1: Connect to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from GitHub**:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Git Repository**:
   - Select your GitHub repository: `cornmankl/second-brain`
   - Click "Import"

## Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables

```bash
# Database Configuration
DATABASE_URL=file:./dev.db

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Application Configuration
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Configure Build Settings

In your Vercel project settings:

### Build Command
```bash
npm run build:vercel
```

### Output Directory
```
.next
```

### Install Command
```bash
npm install
```

### Start Command
```bash
npm run start:vercel
```

## Step 4: Database Setup

For Vercel deployment, we'll use SQLite with file-based storage:

1. **The database will be automatically created** at `./dev.db`
2. **Prisma will generate the client** during build
3. **Schema will be pushed** on first deployment

### Alternative: Use Vercel Postgres (Recommended for Production)

For better performance and persistence:

1. **Go to Vercel Dashboard → Storage**
2. **Create a new Postgres database**
3. **Copy the connection string**
4. **Update your DATABASE_URL**:
```bash
DATABASE_URL=postgres://user:password@host:port/database?sslmode=require
```

## Step 5: Deploy

### Automatic Deployment (Recommended)

1. **Enable Automatic Deploys** in Vercel settings
2. **Push changes to GitHub**:
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin master
```

### Manual Deployment

```bash
vercel --prod
```

## Step 6: Verify Deployment

1. **Visit your deployed app**: `https://your-app-name.vercel.app`
2. **Test all features**:
   - Navigation between modules
   - Creating and editing items
   - Database operations
   - Mobile responsiveness

## Step 7: Custom Domain (Optional)

1. **Go to Vercel Dashboard → Domains**
2. **Add your custom domain**
3. **Configure DNS settings** as instructed

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure all dependencies are in package.json
- Check TypeScript errors
- Verify Prisma schema
```

#### 2. Database Connection Issues
```bash
# Verify DATABASE_URL format
# For SQLite: file:./dev.db
# For Postgres: postgres://user:password@host:port/database
```

#### 3. Environment Variables
```bash
# Ensure all required env vars are set
# Check for typos in variable names
# Verify NEXTAUTH_SECRET is properly set
```

#### 4. Mobile Responsiveness
```bash
# Test on different devices
# Check viewport meta tag
# Verify Tailwind CSS mobile breakpoints
```

## Production Considerations

### Security
- Use strong NEXTAUTH_SECRET
- Enable HTTPS (automatic on Vercel)
- Consider rate limiting for API routes

### Performance
- Enable Vercel Edge Functions for static content
- Use Vercel CDN for assets
- Optimize images and fonts

### Monitoring
- Set up Vercel Analytics
- Configure error tracking (Sentry, etc.)
- Monitor build and deployment times

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this guide
3. Check GitHub issues
4. Contact Vercel support

---

Your Mobile Notion Second Brain System is now ready for production deployment! 🚀