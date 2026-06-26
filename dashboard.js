import {
  db,
  auth,
  onAuthStateChanged
} from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const totalAssignments = document.getElementById("totalAssignments");
const submittedAssignments = document.getElementById("submittedAssignments");
const approvedAssignments = document.getElementById("approvedAssignments");
const pendingAssignments = document.getElementById("pendingAssignments");

const dashboardTable = document.getElementById("dashboardTable");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard(user.email);

});

async function loadDashboard(email) {

    dashboardTable.innerHTML = "";

    let submitted = 0;
    let approved = 0;
    let pending = 0;

    // Total Assignments
    const assignmentSnapshot = await getDocs(collection(db, "assignments"));
    totalAssignments.textContent = assignmentSnapshot.size;

    // Student Submissions
    const q = query(
        collection(db, "submissions"),
        where("studentEmail", "==", email)
    );

    const snapshot = await getDocs(q);

    submitted = snapshot.size;

    snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.status === "Approved") approved++;
        if (data.status === "Pending") pending++;

        dashboardTable.innerHTML += `
        <tr>
            <td>${data.assignmentId}</td>
            <td>${data.status}</td>
            <td>${data.submittedAt}</td>
        </tr>
        `;

    });

    submittedAssignments.textContent = submitted;
    approvedAssignments.textContent = approved;
    pendingAssignments.textContent = pending;

}
