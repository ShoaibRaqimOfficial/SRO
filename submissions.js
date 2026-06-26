import { db, auth, onAuthStateChanged } from "./firebase.js";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================
const ADMIN_EMAIL = "itsraqim@gmail.com";

const submissionTable = document.getElementById("submissionTable");

// ==============================
// SECURITY CHECK
// ==============================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        alert("Access Denied!");
        window.location.href = "login.html";
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

    if (snapshot.empty) {

        submissionTable.innerHTML = `
        <tr>
            <td colspan="9" style="text-align:center;">
                No submissions found.
            </td>
        </tr>
        `;

        return;
    }

    snapshot.forEach((document) => {

        const data = document.data();

        submissionTable.innerHTML += `

<tr>

<td>${data.studentName}</td>

<td>${data.studentEmail}</td>

<td>${data.assignmentId || ""}</td>

<td>${data.status || "Pending"}</td>

<td>
    <a href="${data.assignmentLink}" target="_blank">
        Open
    </a>
</td>

<td>
    <textarea
        id="pros-${document.id}"
        rows="3"
        style="width:180px;"
    >${data.pros || ""}</textarea>
</td>

<td>
    <textarea
        id="cons-${document.id}"
        rows="3"
        style="width:180px;"
    >${data.cons || ""}</textarea>
</td>

<td>
    <textarea
        id="feedback-${document.id}"
        rows="3"
        style="width:220px;"
    >${data.feedback || ""}</textarea>
</td>

<td>

<button onclick="saveFeedback('${document.id}')">
💾 Save
</button>

<button onclick="approveSubmission('${document.id}')">
✅
</button>

<button onclick="rejectSubmission('${document.id}')">
❌
</button>

<button onclick="deleteSubmission('${document.id}')">
🗑
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

// ==============================
// SAVE FEEDBACK
// ==============================
window.saveFeedback = async function(id){

    const pros = document.getElementById(`pros-${id}`).value;
    const cons = document.getElementById(`cons-${id}`).value;
    const feedback = document.getElementById(`feedback-${id}`).value;

    await updateDoc(doc(db,"submissions",id),{

        pros: pros,
        cons: cons,
        feedback: feedback

    });

    alert("✅ Feedback Saved Successfully!");

}
