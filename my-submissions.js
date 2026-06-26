import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionTable = document.getElementById("submissionTable");

// ==============================
// LOGIN CHECK
// ==============================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadMySubmissions(user.email);

});

// ==============================
// LOAD STUDENT SUBMISSIONS
// ==============================
async function loadMySubmissions(email) {

    submissionTable.innerHTML = `
    <tr>
        <td colspan="6" style="text-align:center;">
            Loading...
        </td>
    </tr>
    `;

    try {

        const q = query(
            collection(db, "submissions"),
            where("studentEmail", "==", email)
        );

        const snapshot = await getDocs(q);

        submissionTable.innerHTML = "";

        if (snapshot.empty) {

            submissionTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No submissions found.
                </td>
            </tr>
            `;
            return;
        }

        snapshot.forEach((doc) => {

            const data = doc.data();

            submissionTable.innerHTML += `

<tr>

<td>${data.assignmentId || "-"}</td>

<td>${data.status || "Pending"}</td>

<td>${data.pros || "-"}</td>

<td>${data.cons || "-"}</td>

<td>${data.feedback || "Waiting for teacher review..."}</td>

<td>${data.submittedAt || "-"}</td>

</tr>

`;

        });

    } catch (error) {

        console.error(error);

        submissionTable.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;color:red;">
                Failed to load submissions.
            </td>
        </tr>
        `;

    }

}
