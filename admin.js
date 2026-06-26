import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================

const ADMIN_EMAIL = "itsraqim@gmail.com";

const form = document.getElementById("assignmentForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const dueDate = document.getElementById("dueDate");
const download = document.getElementById("download");
const message = document.getElementById("message");
const assignmentTable = document.getElementById("assignmentTable");

// ==============================
// SECURITY
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {

        alert("Access Denied");

        window.location.href = "login.html";

        return;

    }

    loadAssignments();

});

// ==============================
// ADD ASSIGNMENT
// ==============================

if(form){

form.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

await addDoc(collection(db,"assignments"),{

title:title.value,

description:description.value,

dueDate:dueDate.value,

download:download.value,

status:"Active",

createdAt:new Date().toISOString()

});

message.style.color="green";

message.textContent="Assignment Published Successfully!";

form.reset();

loadAssignments();

}catch(error){

message.style.color="red";

message.textContent=error.message;

}

});

}

// ==============================
// LOAD ASSIGNMENTS
// ==============================

async function loadAssignments(){

if(!assignmentTable) return;

assignmentTable.innerHTML=`
<tr>
<td colspan="4" align="center">
Loading...
</td>
</tr>
`;

const snapshot=await getDocs(collection(db,"assignments"));

assignmentTable.innerHTML="";

if(snapshot.empty){

assignmentTable.innerHTML=`
<tr>
<td colspan="4" align="center">
No Assignments Found
</td>
</tr>
`;

return;

}

snapshot.forEach((assignment)=>{

const data=assignment.data();

assignmentTable.innerHTML+=`

<tr>

<td>${data.title}</td>

<td>${data.dueDate}</td>

<td>${data.status}</td>

<td>

<button
onclick="deleteAssignment('${assignment.id}')"
style="
background:red;
color:white;
border:none;
padding:8px 15px;
border-radius:6px;
cursor:pointer;
">

Delete

</button>

</td>

</tr>

`;

});

}

// ==============================
// DELETE ASSIGNMENT
// ==============================

window.deleteAssignment=async function(id){

const ok=confirm("Delete this assignment?");

if(!ok) return;

await deleteDoc(doc(db,"assignments",id));

loadAssignments();

alert("Assignment Deleted Successfully.");

}
