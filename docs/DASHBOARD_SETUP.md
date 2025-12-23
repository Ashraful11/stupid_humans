# Content Management Dashboard Setup Guide

This guide will help you set up the admin dashboard for managing blog posts and news articles on your Stupid Humans Tech website.

## Overview

The dashboard includes:
- **Authentication**: Secure login for admin users
- **Blog Management**: Create, edit, publish, and delete blog posts
- **News Management**: Create, edit, publish, and delete news articles
- **Overview Dashboard**: View statistics and quick actions
- **Firebase Backend**: Real-time cloud database for content storage

## Prerequisites

1. A Google account
2. Basic understanding of Firebase (we'll guide you through the setup)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `stupid-humans-tech` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set Up Firebase Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Create Your Admin User

1. Click on the "Users" tab
2. Click "Add user"
3. Enter your email and password
4. Click "Add user"

## Step 3: Set Up Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in **test mode** (we'll secure it later)
4. Choose your region (closest to your users)
5. Click "Enable"

### Create Collections

Firestore will automatically create collections when you add your first blog post or news article through the dashboard. However, you can manually create them:

1. Click "Start collection"
2. Collection ID: `blogPosts`
3. Add a dummy document (you can delete it later):
   - Document ID: Auto-ID
   - Field: `title`, Type: string, Value: `test`
4. Click "Save"
5. Repeat for `newsArticles` collection

## Step 4: Configure Firebase in Your Code

1. In Firebase Console, click on the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Register app name: `Stupid Humans Tech Dashboard`
6. Click "Register app"
7. Copy the Firebase configuration object

8. Open `firebase-config.js` in your project
9. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Secure Your Firestore Database

Once you've tested the dashboard, update your Firestore security rules:

1. Go to Firestore Database > Rules
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write blog posts and news
    match /blogPosts/{document=**} {
      allow read: if true;  // Anyone can read (for your website)
      allow write: if request.auth != null;  // Only authenticated users can write
    }

    match /newsArticles/{document=**} {
      allow read: if true;  // Anyone can read (for your website)
      allow write: if request.auth != null;  // Only authenticated users can write
    }
  }
}
```

3. Click "Publish"

## Step 6: Access Your Dashboard

1. Open `admin-dashboard.html` in your web browser
2. Or upload it to your hosting and navigate to: `https://yourdomain.com/admin-dashboard.html`
3. Login with the email and password you created in Step 2

## Step 7: Deploy to Production

### Option A: GitHub Pages (Free)

1. Add all dashboard files to your repository:
   - `admin-dashboard.html`
   - `admin-dashboard.css`
   - `admin-dashboard.js`
   - `firebase-config.js`

2. Push to GitHub:
```bash
git add admin-dashboard.html admin-dashboard.css admin-dashboard.js firebase-config.js DASHBOARD_SETUP.md
git commit -m "Add content management dashboard"
git push origin main
```

3. Access at: `https://yourusername.github.io/yourrepo/admin-dashboard.html`

### Option B: Any Web Host

Simply upload these files to your web hosting:
- `admin-dashboard.html`
- `admin-dashboard.css`
- `admin-dashboard.js`
- `firebase-config.js`

## Using the Dashboard

### Creating a Blog Post

1. Login to the dashboard
2. Click "Blog Posts" in the sidebar
3. Click "New Blog Post"
4. Fill in the form:
   - **Title**: Your blog post title
   - **Category**: Select appropriate category (tutorials, tools, etc.)
   - **Difficulty**: Beginner, Intermediate, or Advanced
   - **Author**: Your name
   - **Read Time**: Estimated minutes to read
   - **Excerpt**: Brief description (shows on listing pages)
   - **Content**: Full blog post content (supports Markdown)
   - **Featured Image**: URL to header image
   - **Tags**: Comma-separated tags
5. Click "Publish" or "Save as Draft"

### Creating a News Article

1. Click "News Articles" in the sidebar
2. Click "New News Article"
3. Fill in the form (similar to blog posts)
4. Categories include: AI Tools, Marketing Tech, Platform Updates, etc.
5. Click "Publish" or "Save as Draft"

### Managing Content

- **Edit**: Click the pencil icon on any content item
- **Publish/Unpublish**: Click the checkmark icon to toggle status
- **Delete**: Click the trash icon (permanent - cannot be undone!)

### Dashboard Overview

The overview section shows:
- Total blog posts
- Total news articles
- Published content count
- Draft content count

## Next Steps: Display Content on Your Website

To display the dynamic content from Firebase on your actual website pages, you'll need to:

1. Add Firebase to your blog and news pages
2. Fetch content from Firestore
3. Dynamically render the content

Would you like me to create scripts to automatically display your Firebase content on the blog and news pages?

## Troubleshooting

### "Firebase not defined" error
- Make sure you're loading the Firebase scripts before `firebase-config.js`
- Check that you're viewing the page over HTTP/HTTPS (not file://)

### Authentication errors
- Verify you created a user in Firebase Authentication
- Check that Email/Password sign-in is enabled
- Make sure your email and password are correct

### Content not loading
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore security rules allow read access
- Ensure collections `blogPosts` and `newsArticles` exist

### Can't publish content
- Verify you're logged in
- Check Firestore security rules allow write access for authenticated users
- Check browser console for specific error messages

## Security Best Practices

1. **Never commit your Firebase config with real API keys to public repositories**
   - Use environment variables for production
   - Or restrict API key access in Firebase Console

2. **Limit authentication to specific email addresses**
   - Update Firestore rules to check for specific admin emails

3. **Keep Firebase SDKs updated**
   - Check for updates regularly

4. **Monitor usage in Firebase Console**
   - Set up budget alerts
   - Review authentication logs

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review Firebase Console logs
3. Verify all setup steps were completed
4. Check that your Firebase config is correct

## What's Included

Files created:
- `admin-dashboard.html` - Main dashboard interface
- `admin-dashboard.css` - Dashboard styling
- `admin-dashboard.js` - Dashboard functionality
- `firebase-config.js` - Firebase configuration
- `DASHBOARD_SETUP.md` - This setup guide

## Firebase Pricing

Firebase has a generous free tier:
- **Firestore**: 50,000 reads/day, 20,000 writes/day
- **Authentication**: Unlimited
- **Hosting**: 10GB storage, 360MB/day transfer

This should be more than enough for a blog/news website. You can monitor usage in Firebase Console.

---

**Ready to start publishing content!** 🚀

Access your dashboard at `admin-dashboard.html` and start creating amazing content.
