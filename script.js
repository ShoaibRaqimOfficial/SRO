import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const createAccount = document.getElementById("createAccount");

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
createAccount.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.style.color = "green";
        message.textContent = "Account Created Successfully!";

    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;
    }
});
