# Firebase Setup - Quick Guide

## Step 1: Create Firebase Project (2 min)
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: `stupid-humans-tech`
4. Disable Google Analytics
5. Click "Create project"

## Step 2: Enable Authentication (1 min)
1. Click "Authentication" → "Get started"
2. Click "Email/Password" → Toggle ON → Save
3. Click "Users" tab → "Add user"
4. Email: `your-email@example.com`
5. Password: `YourPassword123`
6. Save this login info!

## Step 3: Create Firestore Database (1 min)
1. Click "Firestore Database" → "Create database"
2. Select "Start in test mode"
3. Choose location (e.g., us-central1)
4. Click "Enable"

## Step 4: Get Configuration (1 min)
1. Click gear icon → "Project settings"
2. Scroll down → Click web icon `</>`
3. App nickname: `Dashboard`
4. Copy the `firebaseConfig` code block

## Step 5: Update Your Code (1 min)
Open `firebase-config.js` and replace:

```javascript
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "stupid-humans.firebaseapp.com",
  projectId: "stupid-humans",
  storageBucket: "stupid-humans.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "1:YOUR_SENDER_ID_HERE:web:fb226e8d6fe6cfbc21f7a1",
  measurementId: "YOUR_MEASUREMENT_ID_HERE"
};
```

With your actual config from Step 4.

## Step 6: Test (1 min)
1. Open `admin-dashboard-enhanced.html` in browser
2. Login with email/password from Step 2
3. Click "New Blog Post" → Create test post
4. Check Firebase Console → Firestore to see it saved

## Secure Your Database (Important!)
1. Firestore Database → Rules tab
2. Replace all with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Done! 🎉

Your dashboard is connected to Firebase. Access at:
- Local: Open the HTML file in your browser
- Production: Deploy to GitHub Pages or Firebase Hosting

## Troubleshooting
- **Can't login?** Check email/password in Firebase Console → Authentication → Users
- **Content not saving?** Check browser console (F12) for errors
- **Firebase not defined?** Make sure scripts load in correct order in HTML

## Free Tier Limits
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- Plenty for your blog!
