// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVBxgwHvPRUsMiDggziYZnLa5JuYTFI1E",
    authDomain: "lms-bm-reading.firebaseapp.com",
    projectId: "lms-bm-reading",
    storageBucket: "lms-bm-reading.appspot.com",
    messagingSenderId: "388779759262",
    appId: "1:388779759262:web:955d777ed608a2c1118d8f",
    measurementId: "G-44730J0JV0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const goToSignup = document.getElementById('goToSignup');
    if (goToSignup) {
        goToSignup.addEventListener('click', showSignupForm);
    }
});

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email-address').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user.uid);
            checkUserRole(user.uid);
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login failed: " + error.message);
        });
}

function checkUserRole(userId) {
    db.collection("users").doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.role === 'teacher') {
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Access denied. This dashboard is for teachers only.");
                }
            } else {
                console.error("No user data found");
                alert("User data not found. Please contact support.");
            }
        })
        .catch((error) => {
            console.error("Error getting user data:", error);
            alert("Error retrieving user data. Please try again.");
        });
}

function showSignupForm() {
    // Implement signup form display logic here
    console.log("Show signup form");
}

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        checkUserRole(user.uid);
    }
});
