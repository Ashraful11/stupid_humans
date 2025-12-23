# Deploy Content Dashboard to Your Own Domain

## Files to Upload

### Required Dashboard Files:
```
admin-dashboard-enhanced.html    (Main dashboard)
admin-dashboard-enhanced.css     (Dashboard styles)
admin-dashboard-enhanced.js      (Dashboard functionality)
admin-dashboard.css              (Additional styles)
content-editor.html              (Full-page editor)
content-editor.css               (Editor styles)
content-editor.js                (Editor functionality)
firebase-config.js               (Firebase configuration)
```

### Your Existing Website Files:
```
index.html
blog.html
news.html
contact.html
styles.css
script.js
assets/                          (images, videos, etc.)
```

## Deployment Steps

### Option 1: cPanel / FTP Upload

1. **Connect via FTP** (FileZilla, Cyberduck, etc.)
   - Host: ftp.yourdomain.com
   - Username: Your FTP username
   - Password: Your FTP password

2. **Navigate to public_html** (or www, htdocs)

3. **Upload all files** from your project folder

4. **Set correct permissions** (if needed):
   - Files: 644
   - Folders: 755

5. **Access your dashboard**:
   - https://yourdomain.com/admin-dashboard-enhanced.html

### Option 2: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
cd /Users/ashraful/Developer/stupid_humans
firebase init hosting

# Choose:
# - Use existing project: stupid-humans
# - Public directory: . (current directory)
# - Single-page app: No
# - GitHub deploys: No

# Deploy
firebase deploy --only hosting
```

**Your site will be live at:**
- https://stupid-humans.web.app
- https://stupid-humans.firebaseapp.com

**Connect custom domain:**
1. Firebase Console → Hosting → Add custom domain
2. Enter: yourdomain.com
3. Add DNS records provided by Firebase
4. Wait for SSL certificate (24-48 hours)

### Option 3: Netlify (Easy Drag & Drop)

1. Go to https://app.netlify.com
2. Sign up/Login
3. Drag your project folder to deploy
4. Configure custom domain in settings

### Option 4: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/ashraful/Developer/stupid_humans
vercel

# Add custom domain
vercel domains add yourdomain.com
```

## Firebase Configuration for Production

### Update API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: stupid-humans
3. APIs & Services → Credentials
4. Click your API key
5. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add:
     ```
     https://yourdomain.com/*
     https://www.yourdomain.com/*
     http://localhost/*
     ```
6. Save

### Update Firebase Authentication

1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Add: `yourdomain.com`

## File Structure on Server

```
yourdomain.com/
├── index.html                          (Homepage)
├── blog.html                           (Blog listing)
├── news.html                           (News listing)
├── contact.html
├── admin-dashboard-enhanced.html       (Dashboard - password protected)
├── content-editor.html                 (Editor - password protected)
├── styles.css
├── script.js
├── admin-dashboard-enhanced.css
├── admin-dashboard-enhanced.js
├── admin-dashboard.css
├── content-editor.css
├── content-editor.js
├── firebase-config.js
└── assets/
    ├── images/
    └── video/
```

## Security Recommendations

### 1. Protect Dashboard URLs

**Using .htaccess (Apache):**

Create `.htaccess` file:

```apache
# Protect admin pages
<FilesMatch "^(admin-|content-editor|firebase-config).*\.(html|js)$">
    AuthType Basic
    AuthName "Admin Area"
    AuthUserFile /path/to/.htpasswd
    Require valid-user
</FilesMatch>

# OR use IP restriction
<FilesMatch "^admin-.*\.html$">
    Order Deny,Allow
    Deny from all
    Allow from 123.456.789.0  # Your IP
</FilesMatch>
```

**Create password file:**
```bash
htpasswd -c .htpasswd admin
```

### 2. Use Separate Subdomain (Recommended)

**Main site:** https://yourdomain.com
**Admin dashboard:** https://admin.yourdomain.com

This keeps admin separate and more secure.

### 3. Firestore Security Rules

Make sure your Firebase rules are secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can read
    match /{document=**} {
      allow read: if true;
    }

    // Only authenticated users can write
    match /blogPosts/{document=**} {
      allow write: if request.auth != null;
    }

    match /newsArticles/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Testing Checklist

After deployment, verify:

- [ ] Can access homepage: https://yourdomain.com
- [ ] Can access dashboard: https://yourdomain.com/admin-dashboard-enhanced.html
- [ ] Can login to dashboard
- [ ] Can create blog post
- [ ] Can view blog post in Firebase Console
- [ ] Can edit and delete posts
- [ ] Preview works
- [ ] All images load correctly
- [ ] SSL certificate is active (https://)

## Troubleshooting

### Dashboard won't load
- Check if all files uploaded correctly
- Check browser console for errors (F12)
- Verify firebase-config.js has correct config

### Can't login
- Check Firebase Authentication authorized domains
- Verify user exists in Firebase Console
- Check API key restrictions in Google Cloud Console

### Content not saving
- Check Firebase Firestore rules
- Verify you're logged in (email in header)
- Check browser console for specific error

### Images not loading
- Check file paths are relative (not absolute)
- Verify assets/ folder uploaded
- Check file permissions

## DNS Configuration

If using custom domain, update DNS:

**For Firebase Hosting:**
```
Type: A
Name: @
Value: (provided by Firebase)

Type: A
Name: www
Value: (provided by Firebase)
```

**For other hosting:**
```
Type: A
Name: @
Value: Your server IP address

Type: CNAME
Name: www
Value: yourdomain.com
```

## Post-Deployment Steps

1. **Test everything** using the checklist above
2. **Create your first blog post** on production
3. **Bookmark dashboard URL** for easy access
4. **Save admin credentials** securely
5. **Set up regular Firebase backups**
6. **Monitor Firebase usage** to stay in free tier

## URLs After Deployment

- **Homepage:** https://yourdomain.com
- **Blog:** https://yourdomain.com/blog.html
- **News:** https://yourdomain.com/news.html
- **Dashboard:** https://yourdomain.com/admin-dashboard-enhanced.html (keep this private!)
- **Editor:** https://yourdomain.com/content-editor.html (accessed via dashboard)

## Need Help?

Tell me:
1. Your hosting provider
2. Do you have FTP/cPanel/SSH access?
3. Your domain name (if comfortable sharing)

I'll provide specific deployment instructions for your setup!
