import {
    db,
    auth,
    onAuthStateChanged
} from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form = document.getElementById("submitForm");
const assignmentLink = document.getElementById("assignmentLink");
const message = document.getElementById("message");

// URL se Assignment ID
const params = new URLSearchParams(window.location.search);
const assignmentId = params.get("id");

// Login Check
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

// Submit

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {

        message.style.color = "red";
        message.textContent = "Please login first.";

        return;

    }

    try {

        // Email se temporary name banana
        const studentName = user.email.split("@")[0];

        await addDoc(collection(db, "submissions"), {

            assignmentId: assignmentId,

            studentName: studentName,

            studentEmail: user.email,

            assignmentLink: assignmentLink.value,

            submittedAt: new Date().toLocaleString(),

            status: "Pending"

        });

        message.style.color = "green";
        message.textContent = "✅ Assignment Submitted Successfully!";

        form.reset();

    } catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
