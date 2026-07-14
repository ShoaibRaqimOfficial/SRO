import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionTable=document.getElementById("submissionList");

const totalSubmission=document.getElementById("totalSubmission");
const approvedSubmission=document.getElementById("approvedSubmission");
const pendingSubmission=document.getElementById("pendingSubmission");
const rejectedSubmission=document.getElementById("rejectedSubmission");

// LOGIN

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

loadMySubmissions(user.email);

});

// LOAD SUBMISSIONS

async function loadMySubmissions(email){

submissionTable.innerHTML="<p>Loading...</p>";

try{

const q=query(

collection(db,"submissions"),

where("studentEmail","==",email)

);

const snapshot=await getDocs(q);

let total=0;
let approved=0;
let pending=0;
let rejected=0;

submissionTable.innerHTML="";

if(snapshot.empty){

submissionTable.innerHTML=`

<div class="assignment-card">

<h3>No submissions found.</h3>

</div>

`;

return;

}

snapshot.forEach((document)=>{

const data=document.data();

total++;

if(data.status==="Approved") approved++;
else if(data.status==="Rejected") rejected++;
else pending++;

submissionTable.innerHTML+=`

<div class="assignment-card">

<h3>

📚 ${data.assignmentTitle || data.assignmentId || "Assignment"}

</h3>

<p>

<strong>Status:</strong>

<span class="status">

${data.status || "Pending"}

</span>

</p>

<p>

<strong>Submitted:</strong>

${data.submittedAt || "-"}

</p>

<hr>

<p>

<strong>✅ Pros</strong>

<br>

${data.pros || "Waiting for review..."}

</p>

<p>

<strong>⚠ Needs Improvement</strong>

<br>

${data.cons || "Waiting for review..."}

</p>

<p>

<strong>💬 Teacher Feedback</strong>

<br>

${data.feedback || "Waiting for teacher review..."}

</p>

<p>

<strong>👨‍🏫 Teacher Reply</strong>

<br>

${data.teacherReply || "No reply yet."}

</p>

<textarea

id="question-${document.id}"

placeholder="Feel free to ask your teacher..."

style="width:100%;margin-top:15px;height:100px;padding:12px;border-radius:10px;">

${data.studentQuestion || ""}

</textarea>

<br><br>

<button

class="submit-btn"

onclick="saveQuestion('${document.id}')">

Send Question

</button>

<br><br>

<a

href="${data.assignmentLink}"

target="_blank"

class="download-btn">

🎥 View Submission

</a>

</div>

`;

});

totalSubmission.textContent=total;
approvedSubmission.textContent=approved;
pendingSubmission.textContent=pending;
rejectedSubmission.textContent=rejected;

}catch(error){

console.error(error);

submissionTable.innerHTML=`

<div class="assignment-card">

<h3 style="color:red;">

Failed to load submissions.

</h3>

</div>

`;

}

}

// SAVE QUESTION

window.saveQuestion=async function(id){

const question=document.getElementById(`question-${id}`).value;

await updateDoc(

doc(db,"submissions",id),

{

studentQuestion:question

}

);

alert("Question sent successfully.");

};
