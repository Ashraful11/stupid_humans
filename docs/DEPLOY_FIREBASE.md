# Deploy to Firebase Hosting - stupidhumans.tech

## Step 1: Login to Firebase (Run this in Terminal)

```bash
cd /Users/ashraful/Developer/stupid_humans
firebase login
```

This will open your browser for authentication. Login with your Google account.

## Step 2: Initialize Hosting (Already Done!)

✅ `.firebaserc` - Created (links to your stupid-humans project)
✅ `firebase.json` - Created (hosting configuration)

## Step 3: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

This will:
- Upload all your website files
- Deploy to Firebase CDN
- Make your site live at:
  - https://stupid-humans.web.app
  - https://stupid-humans.firebaseapp.com

## Step 4: Connect Custom Domain (stupidhumans.tech)

### In Firebase Console:

1. Go to: https://console.firebase.google.com/project/stupid-humans/hosting/sites
2. Click **"Add custom domain"**
3. Enter: `stupidhumans.tech`
4. Firebase will provide DNS records

### Update Your DNS (at your domain registrar):

Firebase will give you something like:

**For root domain (stupidhumans.tech):**
```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195
```

**For www (www.stupidhumans.tech):**
```
Type: CNAME
Name: www
Value: stupid-humans.web.app
```

### Where to Update DNS:

- **GoDaddy**: Domain Settings → DNS Management
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Cloudflare**: DNS → Add Record
- **Google Domains**: My Domains → DNS

**DNS propagation takes 24-48 hours** but often works in 1-2 hours.

## Step 5: Update Firebase API Key Restrictions

After deploying, secure your API key:

1. Go to: https://console.cloud.google.com/apis/credentials?project=stupid-humans
2. Click your API key
3. Under "Application restrictions" → "HTTP referrers"
4. Add:
   ```
   https://stupidhumans.tech/*
   https://www.stupidhumans.tech/*
   https://stupid-humans.web.app/*
   https://stupid-humans.firebaseapp.com/*
   http://localhost/*
   ```
5. Save

## Step 6: Add Authorized Domain in Firebase Auth

1. Go to: https://console.firebase.google.com/project/stupid-humans/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `stupidhumans.tech`
5. Add: `www.stupidhumans.tech`

## Your URLs After Deployment

| Type | URL | Notes |
|------|-----|-------|
| **Main Site** | https://stupidhumans.tech | Your public website |
| **Dashboard** | https://stupidhumans.tech/admin | Admin login |
| **Editor** | https://stupidhumans.tech/editor | Content editor (via dashboard) |
| **Firebase URLs** | https://stupid-humans.web.app | Always works, even before DNS |

## Quick Deploy Commands

```bash
# Navigate to project
cd /Users/ashraful/Developer/stupid_humans

# Login (first time only)
firebase login

# Deploy
firebase deploy --only hosting

# View your site
open https://stupid-humans.web.app
```

## What Gets Deployed?

✅ **Included:**
- index.html (Homepage)
- blog.html, news.html, contact.html
- admin-dashboard-enhanced.html (Dashboard)
- content-editor.html (Editor)
- All CSS and JS files
- assets/ folder (images, videos)
- firebase-config.js

❌ **Excluded (see firebase.json):**
- Documentation (.md files)
- Test files (firebase-test.html)
- Old backup files
- .DS_Store and hidden files

## Testing After Deployment

1. **Visit:** https://stupid-humans.web.app
2. **Check homepage loads**
3. **Go to:** https://stupid-humans.web.app/admin
4. **Login with your Firebase credentials**
5. **Create a test blog post**
6. **Verify it saves to Firebase**

## Re-deploying After Changes

Anytime you make changes locally:

```bash
firebase deploy --only hosting
```

Takes ~30 seconds to deploy. Changes are live immediately!

## Troubleshooting

### "Firebase login failed"
- Make sure you're logged into the Google account that owns the Firebase project
- Try: `firebase logout` then `firebase login` again

### "Site not loading"
- Check: https://stupid-humans.web.app (Firebase default URL)
- If that works, DNS isn't configured yet
- Wait 1-2 hours for DNS propagation

### "Dashboard won't login"
- Check authorized domains in Firebase Auth settings
- Verify API key restrictions include your domain
- Clear browser cache and try again

### "Permission denied"
- Make sure you're the owner of the Firebase project
- Check IAM permissions in Firebase Console

## Next Steps

1. Run `firebase login` in your terminal
2. Run `firebase deploy --only hosting`
3. Visit your site: https://stupid-humans.web.app
4. Set up custom domain: stupidhumans.tech
5. Start publishing content!

Your site will be live with:
- ✅ Free SSL certificate (HTTPS)
- ✅ Global CDN (fast worldwide)
- ✅ Automatic backups
- ✅ 10GB storage (free tier)
- ✅ 360MB/day bandwidth (free tier)

---

**Ready to deploy?** Open Terminal and run:

```bash
cd /Users/ashraful/Developer/stupid_humans
firebase login
firebase deploy --only hosting
```

🚀 Your site will be live in under 1 minute!
