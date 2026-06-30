import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const ADMIN_EMAIL="itsraqim@gmail.com";

const submissionTable=document.getElementById("submissionTable");

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

if(user.email.toLowerCase()!=ADMIN_EMAIL.toLowerCase()){

alert("Access Denied");

window.location.href="login.html";

return;

}

loadSubmissions();

});

async function loadSubmissions(){

submissionTable.innerHTML="";

const snapshot=await getDocs(collection(db,"submissions"));

if(snapshot.empty){

submissionTable.innerHTML=`

<tr>

<td colspan="11" style="text-align:center;">

No submissions found.

</td>

</tr>

`;

return;

}

snapshot.forEach((document)=>{

const data=document.data();

submissionTable.innerHTML+=`

<tr>

<td>${data.studentName}</td>

<td>${data.studentEmail}</td>

<td>${data.assignmentId}</td>

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
style="width:180px;">${data.pros || ""}</textarea>

</td>

<td>

<textarea
id="cons-${document.id}"
rows="3"
style="width:180px;">${data.cons || ""}</textarea>

</td>

<td>

<textarea
id="feedback-${document.id}"
rows="3"
style="width:220px;">${data.feedback || ""}</textarea>

</td>

<td>

${data.studentQuestion || "-"}

</td>

<td>

<textarea
id="reply-${document.id}"
rows="3"
style="width:220px;">${data.teacherReply || ""}</textarea>

</td>

<td>

<button onclick="saveFeedback('${document.id}')">💾</button>

<button onclick="approveSubmission('${document.id}')">✅</button>

<button onclick="rejectSubmission('${document.id}')">❌</button>

<button onclick="deleteSubmission('${document.id}')">🗑</button>

</td>

</tr>

`;

});

}

window.approveSubmission=async(id)=>{

await updateDoc(doc(db,"submissions",id),{

status:"Approved"

});

loadSubmissions();

};

window.rejectSubmission=async(id)=>{

await updateDoc(doc(db,"submissions",id),{

status:"Rejected"

});

loadSubmissions();

};

window.deleteSubmission=async(id)=>{

if(confirm("Delete Submission?")){

await deleteDoc(doc(db,"submissions",id));

loadSubmissions();

}

};

window.saveFeedback=async(id)=>{

const pros=document.getElementById(`pros-${id}`).value;

const cons=document.getElementById(`cons-${id}`).value;

const feedback=document.getElementById(`feedback-${id}`).value;

const teacherReply=document.getElementById(`reply-${id}`).value;

await updateDoc(doc(db,"submissions",id),{

pros,

cons,

feedback,

teacherReply

});

alert("Saved Successfully");

};
