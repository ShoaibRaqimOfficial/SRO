import {
    auth,
    db,
    onAuthStateChanged,
    signOut
} from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const assignmentList = document.getElementById("assignmentList");

let assignments = [];

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    await loadAssignments();

});

async function loadAssignments() {

    assignmentList.innerHTML = `
    <div style="padding:40px;text-align:center;">
        Loading Assignments...
    </div>
    `;

    try {

        const q = query(

            collection(db, "assignments"),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        assignments = [];

        snapshot.forEach((doc) => {

            assignments.push({

                id: doc.id,

                ...doc.data()

            });

        });

        renderAssignments();

    }

    catch (error) {

        console.error(error);

        assignmentList.innerHTML = `
        <h3 style="text-align:center;color:red;">
            Failed to load assignments.
        </h3>
        `;

    }

}

function renderAssignments() {

    if (assignments.length === 0) {

        assignmentList.innerHTML = `
        <h3 style="text-align:center;">
            No Assignments Available.
        </h3>
        `;

        return;

    }

    assignmentList.innerHTML = "";
      assignments.forEach((assignment) => {

        const publishDate = assignment.createdAt
            ? new Date(assignment.createdAt).toLocaleDateString()
            : "-";

        const publishTime = assignment.createdAt
            ? new Date(assignment.createdAt).toLocaleTimeString()
            : "-";

        assignmentList.innerHTML += `

<div class="assignment-card">

<div class="assignment-header">

<h2>${assignment.title}</h2>

<span class="status-badge">
${assignment.status || "Active"}
</span>

</div>

<p class="assignment-description">

${assignment.description}

</p>

<div class="assignment-meta">

<p>

<strong>📅 Published:</strong>

${publishDate}

</p>

<p>

<strong>🕒 Time:</strong>

${publishTime}

</p>

<p>

<strong>⏰ Due Date:</strong>

${assignment.dueDate || "-"}

</p>

</div>

<div class="assignment-buttons">

<a
href="${assignment.downloadLink}"
target="_blank"
class="download-btn">

📥 Download Assignment

</a>

<a
href="submit.html?id=${assignment.id}"
class="submit-btn">

📤 Submit Assignment

</a>

</div>

</div>

`;

    });

}
// ======================================
// HELPERS
// ======================================

function formatDate(value) {

    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}

function formatTime(value) {

    if (!value) return "-";

    return new Date(value).toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// ======================================
// LOGOUT
// ======================================

window.logout = async function () {

    const ok = confirm(
        "Are you sure you want to logout?"
    );

    if (!ok) return;

    try {

        await signOut(auth);

        window.location.href = "login.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

};

// ======================================
// READY
// ======================================

console.log("====================================");

console.log("SRO Academy V3 Assignment System");

console.log("Assignments Loaded :", assignments.length);

console.log("====================================");
