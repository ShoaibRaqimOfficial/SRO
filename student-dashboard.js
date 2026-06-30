import {
auth,
db,
onAuthStateChanged,
signOut
} from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy,
where,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const assignmentList=document.getElementById("assignmentList");
const assignmentCount=document.getElementById("assignmentCount");

const submissionList=document.getElementById("submissionList");
const submissionCount=document.getElementById("submissionCount");
const pendingCount=document.getElementById("pendingCount");
const approvedCount=document.getElementById("approvedCount");

const logoutBtn=document.getElementById("logoutBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

loadAssignments();
loadMySubmissions(user);
loadProfile(user);

});

// ==========================
// LOAD ASSIGNMENTS
// ==========================

async function loadAssignments(){

assignmentList.innerHTML="Loading Assignments...";

try{

const q=query(
collection(db,"assignments"),
orderBy("createdAt","desc")
);

const snapshot=await getDocs(q);

assignmentCount.textContent=snapshot.size;

if(snapshot.empty){

assignmentList.innerHTML="<h3>No Assignments Found</h3>";
return;

}

assignmentList.innerHTML="";

snapshot.forEach((document)=>{

const assignment=document.data();

assignmentList.innerHTML+=`

<div class="assignment-card">

<h3>${assignment.title}</h3>

<p>${assignment.description}</p>

<p><strong>Due Date:</strong> ${assignment.dueDate}</p>

<div class="assignment-buttons">

<a
href="${assignment.downloadLink}"
target="_blank"
class="download-btn">

Download

</a>

<a
href="submit.html?id=${document.id}"
class="submit-btn">

Submit

</a>

</div>

</div>

`;

});

}catch(error){

console.error(error);

assignmentList.innerHTML="<h3>Error Loading Assignments</h3>";

}

}

// ==========================
// LOAD MY SUBMISSIONS
// ==========================

async function loadMySubmissions(user){

try{

const q=query(

collection(db,"submissions"),

where("studentEmail","==",user.email)

);

const snapshot=await getDocs(q);

submissionCount.textContent=snapshot.size;

let pending=0;
let approved=0;

submissionList.innerHTML="";

if(snapshot.empty){

submissionList.innerHTML="<h3>No submissions yet.</h3>";

pendingCount.textContent=0;
approvedCount.textContent=0;

return;

}

snapshot.forEach((document)=>{

const data=document.data();

if(data.status==="Pending") pending++;

if(data.status==="Approved") approved++;

submissionList.innerHTML+=`

<div class="assignment-card">

<h3>${data.fileName || "Assignment"}</h3>

<p><strong>Status:</strong> ${data.status}</p>

<a
href="${data.assignmentLink}"
target="_blank"
class="download-btn">

View Submission

</a>

</div>

`;

});

pendingCount.textContent=pending;
approvedCount.textContent=approved;

}catch(error){

console.error(error);

}

}

// ==========================
// LOAD PROFILE
// ==========================

async function loadProfile(user){

try{

const snapshot=await getDoc(
doc(db,"students",user.uid)
);

if(!snapshot.exists()){

document.getElementById("profileBox").innerHTML="<h3>Profile not found.</h3>";
return;

}

const data=snapshot.data();

document.getElementById("profileBox").innerHTML=`

<div class="assignment-card">

<h3>${data.fullName}</h3>

<p><strong>Email:</strong> ${data.email}</p>

<p><strong>Phone:</strong> ${data.phone}</p>

<p><strong>Date of Birth:</strong> ${data.dob}</p>

<p><strong>Status:</strong> ${data.status}</p>

</div>

`;

}catch(error){

console.error(error);

}

}

// ==========================
// LOGOUT
// ==========================

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});
