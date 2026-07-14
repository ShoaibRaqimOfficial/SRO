import {
    db,
    auth,
    onAuthStateChanged
} from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form = document.getElementById("submitForm");
const assignmentFile = document.getElementById("assignmentFile");
const message = document.getElementById("message");

const WORKER_URL =
"https://twilight-queen-9702.westanking2.workers.dev/upload";

const params = new URLSearchParams(window.location.search);

const assignmentId = params.get("id");

let currentUser = null;
let student = null;
let assignment = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    currentUser = user;

    await loadStudentProfile();

    await loadAssignment();

});

async function loadStudentProfile() {

    const q = query(

        collection(db, "applications"),

        where("email", "==", currentUser.email)

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        alert("Student profile not found.");

        window.location.href = "login.html";

        return;

    }

    student = snapshot.docs[0].data();

}

async function loadAssignment() {

    const snapshot = await getDocs(collection(db, "assignments"));

    snapshot.forEach((doc) => {

        if (doc.id === assignmentId) {

            assignment = {

                id: doc.id,

                ...doc.data()

            };

        }

    });

    if (!assignment) {

        alert("Assignment not found.");

        window.location.href = "assignments.html";

    }

}
async function alreadySubmitted() {

    const q = query(

        collection(db, "submissions"),

        where("studentUID", "==", currentUser.uid),

        where("assignmentId", "==", assignmentId)

    );

    const snapshot = await getDocs(q);

    return !snapshot.empty;

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!currentUser) {

        message.style.color = "red";
        message.textContent = "Please login first.";

        return;

    }

    if (!student) {

        message.style.color = "red";
        message.textContent = "Student profile not found.";

        return;

    }

    if (!assignment) {

        message.style.color = "red";
        message.textContent = "Assignment not found.";

        return;

    }

    if (assignmentFile.files.length === 0) {

        message.style.color = "red";
        message.textContent = "Please select your assignment.";

        return;

    }

    const submitted = await alreadySubmitted();

    if (submitted) {

        message.style.color = "red";

        message.innerHTML = `
        You have already submitted this assignment.<br>
        Please wait for teacher review.
        `;

        return;

    }

    try {

        message.style.color = "#2563eb";
        message.textContent = "Uploading assignment...";

        const file = assignmentFile.files[0];

        const formData = new FormData();

        formData.append("file", file);

        const uploadResponse = await fetch(WORKER_URL, {

            method: "POST",

            body: formData

        });

        if (!uploadResponse.ok) {

            throw new Error("File upload failed.");

        }

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {

            throw new Error("Cloudflare upload failed.");

        }

        const now = new Date();

        const submittedDate = now.toLocaleDateString();

        const submittedTime = now.toLocaleTimeString();
                await addDoc(collection(db, "submissions"), {

            // ==========================
            // STUDENT INFORMATION
            // ==========================

            studentUID: currentUser.uid,

            studentName: student.fullName,

            studentEmail: student.email,

            studentPhone: student.phone || "",

            studentCity: student.city || "",

            studentDOB: student.dob || "",

            course: student.course || "",

            // ==========================
            // ASSIGNMENT INFORMATION
            // ==========================

            assignmentId: assignment.id,

            assignmentTitle: assignment.title || "",

            assignmentDescription:
                assignment.description || "",

            assignmentDueDate:
                assignment.dueDate || "",

            assignmentDownloadLink:
                assignment.downloadLink || "",

            assignmentCreatedAt:
                assignment.createdAt || "",

            // ==========================
            // FILE INFORMATION
            // ==========================

            assignmentLink: uploadResult.url,

            fileName: uploadResult.filename,

            fileSize: file.size,

            fileType: file.type,

            // ==========================
            // SUBMISSION INFORMATION
            // ==========================

            submittedDate,

            submittedTime,

            submittedAt: now.toISOString(),

            status: "Pending",

            // ==========================
            // TEACHER REVIEW
            // ==========================

            pros: "",

            cons: "",

            feedback: "",

            teacherReply: "",

            reviewedAt: "",

            reviewedBy: ""

        });

        message.style.color = "green";

        message.innerHTML = `
        ✅ Assignment Submitted Successfully.<br><br>
        Your assignment has been submitted successfully.<br>
        Please wait for your instructor's review.
        `;

        form.reset();
            }

    catch (error) {

        console.error(error);

        message.style.color = "red";

        message.textContent = error.message;

    }

});

// ==========================================
// UTILITIES
// ==========================================

function formatDate(date) {

    return date.toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}

function formatTime(date) {

    return date.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

}

console.log("=======================================");
console.log("SRO Academy V3 Submit System Loaded");
console.log("=======================================");
