import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form = document.getElementById("submitForm");

const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const assignmentLink = document.getElementById("assignmentLink");
const message = document.getElementById("message");

// URL se Assignment ID lena
const params = new URLSearchParams(window.location.search);
const assignmentId = params.get("id");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "submissions"), {

            assignmentId: assignmentId,

            studentName: studentName.value,

            studentEmail: studentEmail.value,

            assignmentLink: assignmentLink.value,

            submittedAt: new Date().toLocaleString(),

            status: "Pending"

        });

        message.style.color = "green";
        message.textContent = "Assignment Submitted Successfully!";

        form.reset();

    } catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
