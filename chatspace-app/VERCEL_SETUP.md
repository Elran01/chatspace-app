# ChatSpace Vercel Deployment Setup

## 🚀 Vercel Deployment Configuration Complete!

Your project is now ready for Vercel deployment. Follow these steps to get your app live on the internet.

## Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**:
   - Click "New Project"
   - Connect your GitHub account
   - Import the `chatspace-app` repository
   - Choose "Next.js" framework (should auto-detect)

3. **Configure Build Settings**:
   - Root Directory: `chatspace-app`
   - Build Command: `npm run build` (should auto-fill)
   - Output Directory: `.next` (should auto-fill)

### Option B: Deploy via CLI

```bash
cd chatspace-app
vercel
```

Follow the prompts to connect your account and deploy.

## Step 3: Configure Environment Variables in Vercel

1. **Go to your project in Vercel Dashboard**
2. **Go to Settings → Environment Variables**
3. **Add these variables** (get values from your `.env.local` file):

### Production Environment Variables

```
# Firebase Client Configuration (Public - can be seen by users)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chatspace-kai-workspace.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chatspace-kai-workspace
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chatspace-kai-workspace.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Firebase Admin Configuration (Private - server-side only)
FIREBASE_PROJECT_ID=chatspace-kai-workspace
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chatspace-kai-workspace.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=chatspace-kai-workspace.appspot.com

# Node Environment
NODE_ENV=production
```

**Important**: 
- Set all variables to "Production, Preview, and Development" environments
- For `FIREBASE_PRIVATE_KEY`, make sure to include the quotes and escape sequences exactly as shown

## Step 4: Update Firebase Project Settings

1. **Go to Firebase Console**: https://console.firebase.google.com/project/chatspace-kai-workspace
2. **Go to Authentication → Settings → Authorized domains**
3. **Add your Vercel domain**:
   - `your-project-name.vercel.app` (replace with your actual domain)
   - `your-project-name-git-main-username.vercel.app` (for git deployments)

## Step 5: Test Deployment

1. **Visit your Vercel URL** (provided after deployment)
2. **Test authentication**:
   - Try to register a new account
   - Try to login
   - Check if you're redirected to dashboard
   - Test logout functionality

## Deployment URLs

After deployment, you'll get these URLs:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch-username.vercel.app` (for PR previews)

## Automatic Deployments

Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests
- **Development**: When you push to other branches

## Troubleshooting

### Build Failures

**"Module not found"**
- Check if all dependencies are in `package.json`
- Run `npm install` locally to verify

**"Environment variable missing"**
- Verify all variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)

### Runtime Errors

**"Firebase: No Firebase App '[DEFAULT]' has been created"**
- Check Firebase environment variables in Vercel
- Verify `NEXT_PUBLIC_` prefix for client variables

**Authentication not working**
- Add Vercel domain to Firebase authorized domains
- Check browser console for CORS errors

### Performance Issues

**Slow loading**
- Check Vercel Analytics for performance insights
- Verify images are optimized in `next.config.ts`

## Monitoring & Analytics

1. **Vercel Analytics**: Monitor performance and user behavior
2. **Vercel Logs**: View function logs and errors
3. **Firebase Console**: Monitor authentication and database usage

## Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed

2. **Update Firebase**:
   - Add custom domain to Firebase authorized domains
   - Update any hardcoded URLs in your app

## Security Checklist

- [ ] Environment variables properly configured
- [ ] Firebase security rules active
- [ ] Vercel domain added to Firebase authorized domains
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers configured in `vercel.json`

## Next Steps

Once deployment is successful:
1. Test all functionality in production
2. Set up monitoring and alerts
3. Configure custom domain (if desired)
4. Share with beta users for testing

## Support

**Vercel Issues**: https://vercel.com/help
**Firebase Issues**: https://firebase.google.com/support
**Next.js Issues**: https://nextjs.org/docs

**Common Commands**:
```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Check project status
vercel ls
``` 