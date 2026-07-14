import {
    db,
    auth,
    onAuthStateChanged
} from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionList =
document.getElementById("submissionList");

const totalSubmission =
document.getElementById("totalSubmission");

const approvedSubmission =
document.getElementById("approvedSubmission");

const pendingSubmission =
document.getElementById("pendingSubmission");

const rejectedSubmission =
document.getElementById("rejectedSubmission");

let assignmentCache = {};

onAuthStateChanged(auth, async (user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    await loadAssignmentCache();

    await loadMySubmissions(user.email);

});

async function loadAssignmentCache(){

    assignmentCache={};

    const snapshot=await getDocs(

        collection(db,"assignments")

    );

    snapshot.forEach((doc)=>{

        assignmentCache[doc.id]={

            id:doc.id,

            ...doc.data()

        };

    });

}

async function loadMySubmissions(email){

submissionList.innerHTML=`

<div class="submission-card">

<div class="submission-body">

Loading...

</div>

</div>

`;

const q=query(

collection(db,"submissions"),

where("studentEmail","==",email)

);

const snapshot=await getDocs(q);

let submissions=[];

snapshot.forEach((doc)=>{

submissions.push({

id:doc.id,

...doc.data()

});

});

submissions.sort((a,b)=>

new Date(b.submittedAt||0)-

new Date(a.submittedAt||0)

);

renderCards(submissions);

}
function renderCards(submissions){

let total=0;
let approved=0;
let pending=0;
let rejected=0;

submissionList.innerHTML="";

if(submissions.length===0){

submissionList.innerHTML=`

<div class="submission-card">

<div class="submission-body">

<h3>No submissions found.</h3>

</div>

</div>

`;

return;

}

submissions.forEach((item)=>{

total++;

if(item.status==="Approved") approved++;
else if(item.status==="Rejected") rejected++;
else pending++;

let title=item.assignmentTitle;

if(!title){

if(assignmentCache[item.assignmentId]){

title=assignmentCache[item.assignmentId].title;

}else{

title="Unknown Assignment";

}

}

const submittedDate=

item.submittedDate ||

(item.submittedAt ?

new Date(item.submittedAt)

.toLocaleDateString("en-GB")

: "-");

const submittedTime=

item.submittedTime ||

(item.submittedAt ?

new Date(item.submittedAt)

.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})

: "-");

let badge="pending";

if(item.status==="Approved"){

badge="approved";

}

if(item.status==="Rejected"){

badge="rejected";

}

submissionList.innerHTML+=`

<div class="submission-card">

<div class="submission-header">

<div>

<h2>

📚 ${title}

</h2>

<p>

${item.course || "SRO Academy"}

</p>

</div>

<div>

<span class="status ${badge}">

${item.status || "Pending"}

</span>

</div>

</div>

<div class="submission-body">

<div class="meta">

<div class="meta-box">

<strong>Submitted Date</strong>

${submittedDate}

</div>

<div class="meta-box">

<strong>Submitted Time</strong>

${submittedTime}

</div>

<div class="meta-box">

<strong>Course</strong>

${item.course || "-"}

</div>

<div class="meta-box">

<strong>Assignment</strong>

${title}

</div>

</div>

<div class="feedback-grid">
submissionList.innerHTML += `

<div class="feedback-card">

<h4>✅ Pros</h4>

<p>

${item.pros || "Waiting for teacher review..."}

</p>

</div>

<div class="feedback-card">

<h4>⚠ Needs Improvement</h4>

<p>

${item.cons || "Waiting for teacher review..."}

</p>

</div>

<div class="feedback-card">

<h4>💬 Teacher Feedback</h4>

<p>

${item.feedback || "Waiting for teacher feedback..."}

</p>

</div>

<div class="feedback-card">

<h4>👨‍🏫 Teacher Reply</h4>

<p>

${item.teacherReply || "No reply yet."}

</p>

</div>

</div>

<div class="question-section">

<h3 style="margin-bottom:15px;">

Ask Your Teacher

</h3>

<textarea

id="question-${item.id}"

placeholder="Type your question here..."

class="question-box"

>${item.studentQuestion || ""}</textarea>

<div class="button-row">

<button

class="send-btn"

onclick="saveQuestion('${item.id}')">

📩 Send Question

</button>

<a

href="${item.assignmentLink}"

target="_blank"

class="view-btn">

🎥 View My Submission

</a>

</div>

</div>

</div>

</div>

`;

});

totalSubmission.textContent = total;

approvedSubmission.textContent = approved;

pendingSubmission.textContent = pending;

rejectedSubmission.textContent = rejected;

}
// ======================================
// SAVE QUESTION
// ======================================

window.saveQuestion = async function(id){

try{

const question=document
.getElementById(`question-${id}`)
.value
.trim();

await updateDoc(

doc(db,"submissions",id),

{

studentQuestion:question,

questionUpdatedAt:new Date().toISOString()

}

);

alert("Question sent successfully.");

}
catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// STATUS REFRESH
// ======================================

function refreshStatusBadges(){

document.querySelectorAll(".status").forEach((badge)=>{

const value=badge.innerText
.trim()
.toLowerCase();

badge.classList.remove(

"approved",

"pending",

"rejected"

);

if(value==="approved"){

badge.classList.add("approved");

}

else if(value==="rejected"){

badge.classList.add("rejected");

}

else{

badge.classList.add("pending");

}

});

}

document.addEventListener(

"DOMContentLoaded",

refreshStatusBadges

);

// ======================================
// READY
// ======================================

console.log("===================================");

console.log("SRO Academy V2 My Submissions Ready");

console.log("Compatible With Old Database");

console.log("Compatible With New Database");

console.log("===================================");
