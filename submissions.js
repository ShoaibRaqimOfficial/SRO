import {
    db,
    auth,
    onAuthStateChanged,
    doc,
    updateDoc,
    deleteDoc
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// CHANGE YOUR ADMIN EMAIL HERE
// ==============================

const ADMIN_EMAIL = "westanking2@gmail.com"; // <-- apni admin email

const submissionTable = document.getElementById("submissionTable");

// ==============================
// SECURITY
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

    loadSubmissions();

});

// ==============================
// LOAD SUBMISSIONS
// ==============================

async function loadSubmissions() {

    submissionTable.innerHTML = "";

    const snapshot = await getDocs(collection(db, "submissions"));

    snapshot.forEach((document) => {

        const data = document.data();

        submissionTable.innerHTML += `

<tr>

<td>${data.studentName}</td>

<td>${data.studentEmail}</td>

<td>${data.assignmentId}</td>

<td>${data.status}</td>

<td>

<a href="${data.assignmentLink}" target="_blank">

Open

</a>

</td>

<td>

<button onclick="approveSubmission('${document.id}')">

✅ Approve

</button>

<button onclick="rejectSubmission('${document.id}')">

❌ Reject

</button>

<button onclick="deleteSubmission('${document.id}')">

🗑 Delete

</button>

</td>

</tr>

`;

    });

}

// ==============================
// APPROVE
// ==============================

window.approveSubmission = async function(id){

    await updateDoc(doc(db,"submissions",id),{

        status:"Approved"

    });

    loadSubmissions();

}

// ==============================
// REJECT
// ==============================

window.rejectSubmission = async function(id){

    await updateDoc(doc(db,"submissions",id),{

        status:"Rejected"

    });

    loadSubmissions();

}

// ==============================
// DELETE
// ==============================

window.deleteSubmission = async function(id){

    if(confirm("Delete this submission?")){

        await deleteDoc(doc(db,"submissions",id));

        loadSubmissions();

    }

}
