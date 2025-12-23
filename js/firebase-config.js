// Firebase Configuration
// Note: Firebase API keys are safe to expose in client-side code
// Security is enforced through Firebase Security Rules and App Check
// See: https://firebase.google.com/docs/projects/api-keys

const firebaseConfig = {
    apiKey: "AIzaSyDfVW5z7PKskcKWOTXdLJQheh7ymbMJBHU",
    authDomain: "stupid-humans.firebaseapp.com",
    projectId: "stupid-humans",
    storageBucket: "stupid-humans.firebasestorage.app",
    messagingSenderId: "1040080870388",
    appId: "1:1040080870388:web:fb226e8d6fe6cfbc21f7a1",
    measurementId: "G-HCWDB5GGCB"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    // Enable App Check for security (protects against abuse)
    // You'll need to set this up in Firebase Console
    if (typeof firebase.appCheck !== 'undefined') {
        const appCheck = firebase.appCheck();
        // Use reCAPTCHA v3 for production
        appCheck.activate(
            // Replace with your reCAPTCHA v3 site key from Firebase Console
            'RECAPTCHA_SITE_KEY_PLACEHOLDER',
            true // Set to true to allow auto-refresh
        );
        console.log('Firebase App Check activated');
    }

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
