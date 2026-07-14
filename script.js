import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

    const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
    );

    const currentUserEmail =
        userCredential.user.email.trim().toLowerCase();

    // ===========================
    // ADMIN LOGIN
    // ===========================

    if (currentUserEmail === ADMIN_EMAIL.toLowerCase()) {

        message.style.color = "green";
        message.textContent = "Welcome Admin...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        },1000);

        return;

    }

    // ===========================
    // STUDENT APPROVAL CHECK
    // ===========================

    const q = query(

        collection(db,"applications"),

        where("email","==",currentUserEmail)

    );

    const snapshot = await getDocs(q);

    if(snapshot.empty){

        message.style.color="red";
        message.textContent="Admission record not found.";

        return;

    }

    const application = snapshot.docs[0].data();

    if(application.status==="Pending"){

        message.style.color="#ff9800";
        message.textContent="Your admission is waiting for admin approval.";

        return;

    }

    if(application.status==="Rejected"){

        message.style.color="red";
        message.textContent="Your admission has been rejected.";

        return;

    }

    message.style.color="green";
    message.textContent="Login Successful!";

    setTimeout(()=>{

        window.location.href="student-dashboard.html";

    },1000);

}

catch(error){

    message.style.color="red";
    message.textContent=error.message;

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
// ======================================
// SHOW / HIDE PASSWORD
// ======================================

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        password.type = "password";
        togglePassword.textContent = "Show";

    }

});
