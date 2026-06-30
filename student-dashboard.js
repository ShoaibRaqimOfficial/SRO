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
orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const assignmentList=document.getElementById("assignmentList");

const assignmentCount=document.getElementById("assignmentCount");

const logoutBtn=document.getElementById("logoutBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

loadAssignments();

});

async function loadAssignments(){

assignmentList.innerHTML="Loading...";

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

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);

window.location.href="login.html";

});
