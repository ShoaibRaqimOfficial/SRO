import {
    db,
    doc,
    updateDoc,
    deleteDoc
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionTable = document.getElementById("submissionTable");

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

window.approveSubmission = async function(id){

    await updateDoc(doc(db,"submissions",id),{

        status:"Approved"

    });

    loadSubmissions();

}

window.rejectSubmission = async function(id){

    await updateDoc(doc(db,"submissions",id),{

        status:"Rejected"

    });

    loadSubmissions();

}

window.deleteSubmission = async function(id){

    if(confirm("Delete this submission?")){

        await deleteDoc(doc(db,"submissions",id));

        loadSubmissions();

    }

}

loadSubmissions();
