import {
  db,
  auth,
  onAuthStateChanged
} from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// CHANGE THIS TO YOUR ADMIN EMAIL
// ==============================

const ADMIN_EMAIL = "westanking2@gmail.com"; // <-- apni admin email likho

const form = document.getElementById("assignmentForm");

const title = document.getElementById("title");
const description = document.getElementById("description");
const dueDate = document.getElementById("dueDate");
const download = document.getElementById("download");
const message = document.getElementById("message");

// ==============================
// AUTH CHECK
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.email !== ADMIN_EMAIL) {
        alert("Access Denied!");
        window.location.href = "dashboard.html";
        return;
    }

});

// ==============================
// ADD ASSIGNMENT
// ==============================

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
