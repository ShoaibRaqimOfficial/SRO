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

    console.log("User Object:", user);

    if (!user) {

        console.log("User NOT Logged In");

        window.location.href = "login.html";
        return;

    }

    console.log("Logged In Email:", user.email);

    loadDashboard(user.email);

});

async function loadDashboard(email) {

    console.log("Dashboard Loading...");

    dashboardTable.innerHTML = "";

    let submitted = 0;
    let approved = 0;
    let pending = 0;

    try {

        // Total Assignments

        const assignmentSnapshot = await getDocs(collection(db, "assignments"));

        console.log("Assignments:", assignmentSnapshot.size);

        totalAssignments.textContent = assignmentSnapshot.size;

        // Student Submissions

        const q = query(
            collection(db, "submissions"),
            where("studentEmail", "==", email)
        );

        const snapshot = await getDocs(q);

        console.log("Submissions:", snapshot.size);

        submitted = snapshot.size;

        snapshot.forEach((doc) => {

            const data = doc.data();

            console.log(data);

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

    } catch (error) {

        console.error("Dashboard Error:", error);

    }

}
