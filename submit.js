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
const assignmentFile = document.getElementById("assignmentFile");
const message = document.getElementById("message");

// 👇 Apna Worker URL
const WORKER_URL = "https://twilight-queen-9702.westanking2.workers.dev";

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

    if (assignmentFile.files.length === 0) {

        message.style.color = "red";
        message.textContent = "Please select a file.";
        return;

    }

    try {

        message.style.color = "blue";
        message.textContent = "Uploading file...";

        const file = assignmentFile.files[0];

        const formData = new FormData();
        formData.append("file", file);

        // Upload to Cloudflare Worker
        const uploadResponse = await fetch(WORKER_URL, {

            method: "POST",
            body: formData

        });

        if (!uploadResponse.ok) {
            throw new Error("File upload failed.");
        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
            throw new Error("Upload failed.");
        }

        const studentName = user.email.split("@")[0];

        // Save in Firestore
        await addDoc(collection(db, "submissions"), {

            assignmentId: assignmentId,

            studentName: studentName,

            studentEmail: user.email,

            assignmentLink: uploadResult.url,

            fileName: uploadResult.filename,

            submittedAt: new Date().toLocaleString(),

            status: "Pending"

        });

        message.style.color = "green";
        message.textContent = "✅ Assignment Submitted Successfully!";

        form.reset();

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent = error.message;

    }

});
