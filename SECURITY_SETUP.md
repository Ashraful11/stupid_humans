# Security Setup Guide - Stupid Humans Tech

## ✅ Security Measures Implemented

### 1. Firebase Security Rules ✅ DEPLOYED
- **Firestore Rules**: Deployed and active
  - Public can read blog posts, news, tutorials
  - Only authenticated admins can write/modify content
  - Newsletter subscribers can only create entries (no read access)
  - Contact forms create-only access

### 2. File Structure Security ✅ COMPLETE
- `.gitignore` configured to exclude sensitive files
- `.env.example` created for reference
- API keys remain in code (this is safe for Firebase - see below)

### 3. Access Control ✅ CONFIGURED
- Admin-only routes protected by authentication
- User data isolated by user ID
- Analytics restricted to admin access

## 🔴 CRITICAL: Actions You Must Complete

### Step 1: Restrict Your Firebase API Key (5 minutes)

**Why**: While Firebase API keys can be public, restricting them adds an extra security layer.

1. Go to Google Cloud Console:
   ```
   https://console.cloud.google.com/apis/credentials?project=stupid-humans
   ```

2. Find your API key: `AIzaSyDfVW5z7PKskcKWOTXdLJQheh7ymbMJBHU`

3. Click "Edit" (pencil icon)

4. **Application Restrictions**:
   - Select: "HTTP referrers (web sites)"
   - Add these referrers:
     ```
     stupidhumans.tech/*
     *.stupidhumans.tech/*
     stupid-humans.web.app/*
     *.stupid-humans.web.app/*
     localhost:*/*
     ```

5. **API Restrictions**:
   - Select: "Restrict key"
   - Check ONLY these APIs:
     - ✅ Cloud Firestore API
     - ✅ Firebase Authentication API
     - ✅ Identity Toolkit API
     - ✅ Token Service API
     - ✅ Firebase Installations API

6. Click "Save"

### Step 2: Create Admin User in Firestore (2 minutes)

1. Go to Firebase Console → Firestore Database:
   ```
   https://console.firebase.google.com/project/stupid-humans/firestore
   ```

2. Click "Start collection"
   - Collection ID: `admins`

3. Add first document:
   - Document ID: `YOUR_USER_UID` (you'll get this after login)
   - Fields:
     ```
     email: "your-email@gmail.com" (string)
     role: "admin" (string)
     createdAt: [click "timestamp" and select current time]
     ```

4. Click "Save"

### Step 3: Enable Firebase Authentication (3 minutes)

1. Go to Firebase Console → Authentication:
   ```
   https://console.firebase.google.com/project/stupid-humans/authentication
   ```

2. Click "Get Started" (if not already enabled)

3. Click "Sign-in method" tab

4. Enable these providers:
   - ✅ Email/Password → Enable → Save
   - ✅ Google → Enable → Add your email as test user → Save

5. Go to "Settings" tab → "Authorized domains"
   - Verify these are listed:
     - `stupidhumans.tech`
     - `stupid-humans.web.app`
     - `localhost`

### Step 4: Enable Firebase App Check (OPTIONAL but Recommended)

**What it does**: Protects your backend from abuse and automated attacks.

1. Go to Firebase Console → App Check:
   ```
   https://console.firebase.google.com/project/stupid-humans/appcheck
   ```

2. Click "Get Started"

3. Register your web app

4. Choose provider: "reCAPTCHA v3"

5. Get your reCAPTCHA site key

6. Update `js/firebase-config.js`:
   - Replace `RECAPTCHA_SITE_KEY_PLACEHOLDER` with your actual site key

7. Click "Save"

8. Enable enforcement for:
   - Firestore (set to "Enforce" after testing)
   - Authentication (set to "Enforce" after testing)

### Step 5: Set Up Budget Alerts (2 minutes)

Prevent unexpected costs from abuse:

1. Go to Google Cloud Console → Billing:
   ```
   https://console.cloud.google.com/billing
   ```

2. Select your project

3. Click "Budgets & alerts"

4. Click "Create Budget"

5. Set alert thresholds:
   - $5 (50% of $10)
   - $10 (100%)
   - $15 (150%)

6. Add your email for notifications

## 🛡️ Why Firebase API Keys Are Safe to Expose

According to Google's official documentation:

1. **Designed for Client-Side**:
   - Firebase API keys are NOT like traditional secret API keys
   - They're meant to be included in your client-side code
   - They identify your Firebase project, not authenticate users

2. **Security Comes From**:
   - ✅ Security Rules (deployed)
   - ✅ Authentication requirements
   - ✅ App Check (optional)
   - ✅ Domain restrictions

3. **Official Google Statement**:
   > "Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources; that can only be done with Firebase Security Rules."

Source: https://firebase.google.com/docs/projects/api-keys

## 📊 Monitoring & Maintenance

### Daily Checks:
- [ ] Review Firebase Console for unusual activity
- [ ] Check authentication logs for suspicious logins
- [ ] Monitor database usage in quotas

### Weekly Checks:
- [ ] Review Firestore security rules
- [ ] Check for failed authentication attempts
- [ ] Verify no unusual spikes in usage

### Monthly Checks:
- [ ] Audit admin user list
- [ ] Review and update security rules
- [ ] Check for Firebase SDK updates

## 🚨 What to Do If Compromised

If you suspect your project has been compromised:

1. **Immediately**:
   - Rotate Firebase API key (create new web app)
   - Review all Firestore documents for unauthorized changes
   - Check Authentication users for unknown accounts
   - Review Cloud Functions logs (if using)

2. **Within 24 hours**:
   - Update all applications with new credentials
   - Audit security rules
   - Enable App Check if not already enabled
   - Review billing for unusual charges

3. **Report**:
   - Contact Firebase Support
   - File incident report with details

## 📚 Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [API Key Best Practices](https://firebase.google.com/docs/projects/api-keys)
- [Authentication Security](https://firebase.google.com/docs/auth/web/start)
- [Google Cloud Security](https://cloud.google.com/security/best-practices)

## ✅ Security Checklist

- [x] Firestore Security Rules deployed
- [x] .gitignore configured
- [x] Documentation sanitized
- [ ] API key restricted to domains
- [ ] Admin user created in Firestore
- [ ] Email/Password authentication enabled
- [ ] Budget alerts configured
- [ ] App Check enabled (optional)
- [ ] reCAPTCHA configured (optional)

## 🎯 Current Security Status

**Risk Level**: 🟡 MEDIUM → 🟢 LOW (after completing steps above)

**Protected**:
- ✅ Database access controlled
- ✅ Admin routes require authentication
- ✅ Public content read-only

**Next Actions**:
1. Complete Step 1 (API key restriction) - 5 min
2. Complete Step 2 (Create admin user) - 2 min
3. Complete Step 3 (Enable auth) - 3 min
4. Complete Step 5 (Budget alerts) - 2 min

**Total Time**: ~15 minutes to maximum security
