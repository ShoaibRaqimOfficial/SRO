import {
    db,
    auth,
    onAuthStateChanged
} from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const ADMIN_EMAIL = "itsraqim@gmail.com";

const reviewContainer =
document.getElementById("reviewContainer");

const totalSubmissions =
document.getElementById("totalSubmissions");

const pendingCount =
document.getElementById("pendingCount");

const approvedCount =
document.getElementById("approvedCount");

const rejectedCount =
document.getElementById("rejectedCount");

const studentSearch =
document.getElementById("studentSearch");

const assignmentSearch =
document.getElementById("assignmentSearch");

const statusFilter =
document.getElementById("statusFilter");

let submissions = [];

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    if(user.email.toLowerCase()!=
    ADMIN_EMAIL.toLowerCase()){

        alert("Access Denied");

        window.location.href="login.html";

        return;

    }

    await loadSubmissions();

});

async function loadSubmissions(){

    reviewContainer.innerHTML=`

    <div class="empty">

    Loading submissions...

    </div>

    `;

    submissions=[];

    const snapshot=await getDocs(

        collection(db,"submissions")

    );

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

    renderSubmissions();

}
function renderSubmissions(){

let studentKeyword=
studentSearch.value.toLowerCase().trim();

let assignmentKeyword=
assignmentSearch.value.toLowerCase().trim();

let status=statusFilter.value;

let filtered=submissions.filter((item)=>{

const student=(item.studentName||"")
.toLowerCase();

const assignment=(item.assignmentTitle||
item.assignmentId||"")
.toLowerCase();

const currentStatus=
(item.status||"Pending");

if(studentKeyword &&
!student.includes(studentKeyword))
return false;

if(assignmentKeyword &&
!assignment.includes(assignmentKeyword))
return false;

if(status!="All" &&
currentStatus!=status)
return false;

return true;

});

totalSubmissions.textContent=
filtered.length;

pendingCount.textContent=
filtered.filter(x=>
(x.status||"Pending")=="Pending"
).length;

approvedCount.textContent=
filtered.filter(x=>
x.status=="Approved"
).length;

rejectedCount.textContent=
filtered.filter(x=>
x.status=="Rejected"
).length;

if(filtered.length===0){

reviewContainer.innerHTML=`

<div class="empty">

No submissions found.

</div>

`;

return;

}

const groups={};

filtered.forEach(item=>{

const title=
item.assignmentTitle ||
item.assignmentId ||
"Unknown Assignment";

if(!groups[title]){

groups[title]=[];

}

groups[title].push(item);

});

reviewContainer.innerHTML="";

Object.keys(groups).forEach(title=>{

const list=groups[title];

const first=list[0];

reviewContainer.innerHTML+=`

<div class="assignment-card">

<div class="assignment-header">

<div>

<h2>${title}</h2>

<p style="margin-top:8px;opacity:.9;">

${list.length}
Submission(s)

</p>

</div>

<div>

${first.assignmentDueDate||"-"}

</div>

</div>

<div class="assignment-meta">

<div>

<strong>Course</strong>

${first.course||"-"}

</div>

<div>

<strong>Published</strong>

${first.assignmentCreatedAt ?
new Date(first.assignmentCreatedAt)
.toLocaleDateString() : "-"}

</div>

<div>

<strong>Status</strong>

Active

</div>

</div>

<div class="table-wrapper">

<table>

<thead>

<tr>

<th>SR</th>

<th>Student</th>

<th>Email</th>

<th>Submitted</th>

<th>Status</th>

<th>File</th>

<th>Pros</th>

<th>Needs Improvement</th>

<th>Feedback</th>

<th>Teacher Reply</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

`;
  list.forEach((item,index)=>{

const statusClass=
(item.status||"Pending").toLowerCase();

reviewContainer.innerHTML+=`

<tr>

<td>

${index+1}

</td>

<td>

<strong>${item.studentName||"-"}</strong>

</td>

<td>

${item.studentEmail||"-"}

</td>

<td>

<div>

${item.submittedDate||"-"}

</div>

<div style="font-size:12px;color:#666;">

${item.submittedTime||"-"}

</div>

</td>

<td>

<span class="status ${statusClass}">

${item.status||"Pending"}

</span>

</td>

<td>

<a

href="${item.assignmentLink}"

target="_blank"

class="open-btn">

Open File

</a>

</td>

<td>

<textarea

class="review-box"

id="pros-${item.id}"

>${item.pros||""}</textarea>

</td>

<td>

<textarea

class="review-box"

id="cons-${item.id}"

>${item.cons||""}</textarea>

</td>

<td>

<textarea

class="review-box"

id="feedback-${item.id}"

>${item.feedback||""}</textarea>

</td>

<td>

<textarea

class="review-box"

id="reply-${item.id}"

>${item.teacherReply||""}</textarea>

</td>

<td>

<div class="action-group">

<button

class="save-btn"

onclick="saveFeedback('${item.id}')">

💾 Save

</button>

<button

class="approve-btn"

onclick="approveSubmission('${item.id}')">

✅ Approve

</button>

<button

class="reject-btn"

onclick="rejectSubmission('${item.id}')">

❌ Reject

</button>

<button

class="delete-btn"

onclick="deleteSubmission('${item.id}')">

🗑 Delete

</button>

</div>

</td>

</tr>

`;

});

reviewContainer.innerHTML+=`

</tbody>

</table>

</div>

</div>

`;

});

}

studentSearch.addEventListener("input",renderSubmissions);

assignmentSearch.addEventListener("input",renderSubmissions);

statusFilter.addEventListener("change",renderSubmissions);
// ======================================
// SAVE FEEDBACK
// ======================================

window.saveFeedback = async function(id){

try{

const pros =
document.getElementById(`pros-${id}`).value;

const cons =
document.getElementById(`cons-${id}`).value;

const feedback =
document.getElementById(`feedback-${id}`).value;

const teacherReply =
document.getElementById(`reply-${id}`).value;

await updateDoc(doc(db,"submissions",id),{

pros,

cons,

feedback,

teacherReply,

reviewedAt:new Date().toISOString(),

reviewedBy:ADMIN_EMAIL

});

alert("Feedback Saved Successfully.");

await loadSubmissions();

}
catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// APPROVE
// ======================================

window.approveSubmission = async function(id){

try{

await updateDoc(doc(db,"submissions",id),{

status:"Approved",

reviewedAt:new Date().toISOString(),

reviewedBy:ADMIN_EMAIL

});

await loadSubmissions();

}
catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// REJECT
// ======================================

window.rejectSubmission = async function(id){

try{

await updateDoc(doc(db,"submissions",id),{

status:"Rejected",

reviewedAt:new Date().toISOString(),

reviewedBy:ADMIN_EMAIL

});

await loadSubmissions();

}
catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// DELETE
// ======================================

window.deleteSubmission = async function(id){

const ok = confirm(
"Delete this submission permanently?"
);

if(!ok) return;

try{

await deleteDoc(doc(db,"submissions",id));

await loadSubmissions();

}
catch(error){

console.error(error);

alert(error.message);

}

};

// ======================================
// READY
// ======================================

console.log("======================================");

console.log("SRO Academy V3 Review System Loaded");

console.log("======================================");
