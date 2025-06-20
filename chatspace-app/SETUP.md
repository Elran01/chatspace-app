# ChatSpace Authentication Setup Guide

## 🚀 Firebase Configuration Complete!

Your Firebase backend is fully configured. Now you need to get your credentials and test the authentication system.

## Step 1: Get Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/project/chatspace-kai-workspace/overview

2. **Get Web App Config**:

   - Go to Project Settings (⚙️) → General
   - Scroll down to "Your apps" section
   - Click "Web app" icon or "Add app" if none exists
   - Copy the config object

3. **Get Service Account Key**:
   - Go to Project Settings (⚙️) → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

## Step 2: Create Environment Variables

Create `.env.local` in your project root:

```env
# Firebase Client Configuration (from Project Settings → General)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=chatspace-kai-workspace.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=chatspace-kai-workspace
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=chatspace-kai-workspace.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Firebase Admin Configuration (from Service Account JSON)
FIREBASE_PROJECT_ID=chatspace-kai-workspace
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chatspace-kai-workspace.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=chatspace-kai-workspace.appspot.com
```

## Step 3: Enable Authentication Providers

1. **Go to Authentication**: https://console.firebase.google.com/project/chatspace-kai-workspace/authentication
2. **Go to Sign-in method tab**
3. **Enable Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Save
4. **Enable Google** (optional):
   - Click "Google"
   - Toggle "Enable"
   - Add your email as test user
   - Save

## Step 4: Test Authentication

Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000 and you should:

1. Be redirected to `/auth/login`
2. See the login form
3. Be able to register a new account
4. Be redirected to `/dashboard` after login

## Routes Available

- `/` - Redirects based on auth status
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Protected dashboard (requires login)

## Testing Checklist

- [ ] Environment variables added to `.env.local`
- [ ] Email/Password authentication enabled in Firebase
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Redirected to dashboard after login
- [ ] Can logout and return to login page
- [ ] Protected routes require authentication

## Next Steps

Once authentication is working:

1. Deploy Cloud Functions for AI integration
2. Implement conversation system
3. Add project management features

## Troubleshooting

**"Firebase: No Firebase App '[DEFAULT]' has been created"**

- Check `.env.local` file exists and has correct variables
- Restart development server after adding env vars

**"Invalid API key"**

- Verify API key is correct in Firebase console
- Make sure `.env.local` uses `NEXT_PUBLIC_` prefix for client vars

**Authentication not working**

- Check browser console for errors
- Verify authentication providers are enabled in Firebase console
- Check network tab for failed requests

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify Firebase console settings
3. Test with Firebase Emulator Suite for local development
