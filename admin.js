import { db, auth, onAuthStateChanged } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================
const ADMIN_EMAIL = "itsraqim@gmail.com";

const form = document.getElementById("assignmentForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const dueDate = document.getElementById("dueDate");
const download = document.getElementById("download");
const message = document.getElementById("message");

// ==============================
// SECURITY CHECK (SMART VERSION)
// ==============================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    const currentUserEmail = user.email.trim().toLowerCase();
    const adminEmailToMatch = ADMIN_EMAIL.trim().toLowerCase();
    
    if (currentUserEmail !== adminEmailToMatch) {
        alert("Access Denied! System is currently seeing this email: " + currentUserEmail);
        window.location.href = "login.html";
        return;
    }
});

// ==============================
// ADD ASSIGNMENT
// ==============================
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "assignments"), {
                title: title.value,
                description: description.value,
                dueDate: dueDate.value,
                download: download.value,
                status: "Active",
                createdAt: new Date().toISOString()
            });
            message.style.color = "green";
            message.textContent = "Assignment Published Successfully!";
            form.reset();
        } catch (error) {
            message.style.color = "red";
            message.textContent = error.message;
        }
    });
}
