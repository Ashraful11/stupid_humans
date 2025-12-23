// Firebase Configuration
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
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
