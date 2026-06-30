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

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

loadAssignments();

});

async function loadAssignments(){

assignmentList.innerHTML="<h3>Loading Assignments...</h3>";

try{

const q=query(

collection(db,"assignments"),

orderBy("createdAt","desc")

);

const snapshot=await getDocs(q);

if(snapshot.empty){

assignmentList.innerHTML="<h3>No Assignments Available.</h3>";

return;

}

assignmentList.innerHTML="";

snapshot.forEach((document)=>{

const assignment=document.data();

assignmentList.innerHTML+=`

<div class="assignment-card">

<h2>${assignment.title}</h2>

<p>${assignment.description}</p>

<p>

<strong>Due Date:</strong>

${assignment.dueDate}

</p>

<div class="assignment-buttons">

<a
href="${assignment.downloadLink}"
target="_blank"
class="download-btn">

📥 Download

</a>

<a
href="submit.html?id=${document.id}"
class="submit-btn">

📤 Submit Assignment

</a>

</div>

</div>

`;

});

}catch(error){

console.error(error);

assignmentList.innerHTML="<h3>Failed to load assignments.</h3>";

}

}
