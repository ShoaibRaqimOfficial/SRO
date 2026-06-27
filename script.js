import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const forgotPassword = document.getElementById("forgotPassword");
// ==============================
// ADMIN EMAIL CONFIGURATION
// ==============================
const ADMIN_EMAIL = "itsraqim@gmail.com";

// Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        // userCredential mein hum login hone wale user ka data save kar rahe hain
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.style.color = "green";
        message.textContent = "Login Successful! Redirecting...";

        // User ki email check kar ke sahi page par bhejna
        setTimeout(() => {
            const currentUserEmail = userCredential.user.email.trim().toLowerCase();
            
            if (currentUserEmail === ADMIN_EMAIL.toLowerCase()) {
                window.location.href = "dashboard.html"; // Admin Dashboard
            } else {
                window.location.href = "index.html"; // Student Portal
            }
        }, 1000);

    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    }
});

// Create Account

// ==============================
// FORGOT PASSWORD
// ==============================

forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    if (email.value.trim() === "") {

        message.style.color = "red";
        message.textContent = "Enter your email first.";
        return;

    }

    try {

        await sendPasswordResetEmail(auth, email.value);

        message.style.color = "green";
        message.textContent =
        "Password reset email has been sent. Check your inbox.";

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
