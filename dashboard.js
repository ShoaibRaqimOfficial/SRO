import { db, auth, onAuthStateChanged } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =====================================
// ADMIN EMAIL
// =====================================

const ADMIN_EMAIL = "itsraqim@gmail.com";

// =====================================
// DOM
// =====================================

const totalAssignmentsEl = document.getElementById("totalAssignmentsCount");
const pendingSubmissionsEl = document.getElementById("pendingSubmissionsCount");
const approvedSubmissionsEl = document.getElementById("approvedSubmissionsCount");
const rejectedSubmissionsEl = document.getElementById("rejectedSubmissionsCount");
const totalStudentsEl = document.getElementById("totalStudentsCount");
const pendingAdmissionsEl = document.getElementById("pendingSubmissionsCount");
const logoutBtn = document.getElementById("logoutBtn");

// =====================================
// ADMIN CHECK
// =====================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {

        alert("Access Denied");

        window.location.href = "login.html";

        return;

    }

    loadDashboard();

});

// =====================================
// LOAD DASHBOARD
// =====================================

async function loadDashboard() {

    try {

        // Assignments

        const assignmentSnap = await getDocs(collection(db, "assignments"));

        totalAssignmentsEl.textContent = assignmentSnap.size;

        // Submissions

        const submissionSnap = await getDocs(collection(db, "submissions"));

        let pending = 0;
        let approved = 0;
        let rejected = 0;

        const students = new Set();

        submissionSnap.forEach((doc)=>{

            const data = doc.data();

            if(data.studentEmail){

                students.add(data.studentEmail.toLowerCase());

            }

            if(data.status==="Approved"){

                approved++;

            }
            else if(data.status==="Rejected"){

                rejected++;

            }
            else{

                pending++;

            }

        });

        pendingSubmissionsEl.textContent = pending;

        approvedSubmissionsEl.textContent = approved;

        rejectedSubmissionsEl.textContent = rejected;

        totalStudentsEl.textContent = students.size;

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// LOGOUT
// =====================================

logoutBtn.addEventListener("click",async()=>{

    await signOut(auth);

    window.location.href="login.html";

});
