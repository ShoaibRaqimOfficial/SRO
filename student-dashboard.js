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
where
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

});

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

snapshot.forEach((doc)=>{

const assignment=doc.data();

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
href="submit.html?id=${doc.id}"
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

snapshot.forEach((doc)=>{

const data=doc.data();

if(data.status==="Pending") pending++;

if(data.status==="Approved") approved++;

submissionList.innerHTML+=`

<div class="assignment-card">

<h3>${data.fileName}</h3>

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

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});
