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

let assignmentsMap = {};

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    await loadAssignments();

    await loadMySubmissions(user.email);

});

async function loadAssignments(){

    assignmentsMap={};

    const snapshot=await getDocs(

        collection(db,"assignments")

    );

    snapshot.forEach((item)=>{

        assignmentsMap[item.id]={

            id:item.id,

            ...item.data()

        };

    });

}
async function loadMySubmissions(email){

submissionList.innerHTML=`
<div class="assignment-card">
<h3>Loading...</h3>
</div>
`;

try{

const q=query(

collection(db,"submissions"),

where("studentEmail","==",email)

);

const snapshot=await getDocs(q);

let submissions=[];

snapshot.forEach((item)=>{

submissions.push({

id:item.id,

...item.data()

});

});

submissions.sort((a,b)=>{

return new Date(b.submittedAt||0)-
new Date(a.submittedAt||0);

});

let total=0;
let approved=0;
let pending=0;
let rejected=0;

submissionList.innerHTML="";

if(submissions.length===0){

submissionList.innerHTML=`

<div class="assignment-card">

<h3>

No submissions found.

</h3>

</div>

`;

return;

}

for(const data of submissions){

total++;

if(data.status==="Approved") approved++;
else if(data.status==="Rejected") rejected++;
else pending++;

let assignmentTitle=
data.assignmentTitle;

if(!assignmentTitle){

const assignment=

assignmentsMap[data.assignmentId];

if(assignment){

assignmentTitle=
assignment.title;

}else{

assignmentTitle="Assignment";

}

}

const submittedDate=

data.submittedDate ||

(data.submittedAt ?

new Date(data.submittedAt)
.toLocaleDateString("en-GB")

: "-");

const submittedTime=

data.submittedTime ||

(data.submittedAt ?

new Date(data.submittedAt)
.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})

: "-");

let badge="pending";

if(data.status==="Approved")
badge="approved";

if(data.status==="Rejected")
badge="rejected";

submissionList.innerHTML+=`

<div class="assignment-card">

<h3>

📚 ${assignmentTitle}

</h3>

<p>

<strong>Status:</strong>

<span class="${badge}">

${data.status||"Pending"}

</span>

</p>

<p>

<strong>Submitted:</strong>

${submittedDate}

&nbsp;|&nbsp;

${submittedTime}

</p>

<hr>
`;
  submissionList.innerHTML+=`

<p>

<strong>✅ Pros</strong>

<br><br>

${data.pros || "Waiting for review..."}

</p>

<p>

<strong>⚠ Needs Improvement</strong>

<br><br>

${data.cons || "Waiting for review..."}

</p>

<p>

<strong>💬 Teacher Feedback</strong>

<br><br>

${data.feedback || "Waiting for teacher review..."}

</p>

<p>

<strong>👨‍🏫 Teacher Reply</strong>

<br><br>

${data.teacherReply || "No reply yet."}

</p>

<textarea

id="question-${data.id}"

placeholder="Ask your teacher..."

style="
width:100%;
height:120px;
padding:12px;
margin-top:15px;
border-radius:10px;
border:1px solid #ddd;
resize:vertical;
"

>${data.studentQuestion || ""}</textarea>

<br><br>

<button

class="submit-btn"

onclick="saveQuestion('${data.id}')">

Send Question

</button>

<br><br>

<a

href="${data.assignmentLink}"

target="_blank"

class="download-btn">

🎥 View My Submission

</a>

</div>

`;

}

totalSubmission.textContent=total;

approvedSubmission.textContent=approved;

pendingSubmission.textContent=pending;

rejectedSubmission.textContent=rejected;

}

catch(error){

console.error(error);

submissionList.innerHTML=`

<div class="assignment-card">

<h3 style="color:red;">

Failed to load submissions.

</h3>

</div>

`;

}

}
// ======================================
// SAVE QUESTION
// ======================================

window.saveQuestion = async function(id){

try{

const question = document
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
// STATUS COLOR REFRESH
// ======================================

document.addEventListener("DOMContentLoaded",()=>{

document.querySelectorAll(".status").forEach((item)=>{

const value=item.innerText.trim().toLowerCase();

item.classList.remove(

"pending",

"approved",

"rejected"

);

if(value==="approved"){

item.classList.add("approved");

}

else if(value==="rejected"){

item.classList.add("rejected");

}

else{

item.classList.add("pending");

}

});

});

// ======================================
// READY
// ======================================

console.log("======================================");

console.log("SRO Academy V3 Student Submission Portal");

console.log("Assignments Cache Loaded");

console.log("Old + New Database Compatible");

console.log("======================================");
