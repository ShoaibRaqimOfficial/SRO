import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionTable=document.getElementById("submissionTable");

// ==============================
// LOGIN CHECK
// ==============================

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

loadMySubmissions(user.email);

});

// ==============================
// LOAD SUBMISSIONS
// ==============================

async function loadMySubmissions(email){

submissionTable.innerHTML=`

<tr>

<td colspan="8" style="text-align:center;padding:30px;">

Loading...

</td>

</tr>

`;

try{

const q=query(

collection(db,"submissions"),

where("studentEmail","==",email)

);

const snapshot=await getDocs(q);

submissionTable.innerHTML="";

if(snapshot.empty){

submissionTable.innerHTML=`

<tr>

<td colspan="8" style="text-align:center;">

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

<td>${data.assignmentId || "-"}</td>

<td>${data.status || "Pending"}</td>

<td>${data.pros || "-"}</td>

<td>${data.cons || "-"}</td>

<td>${data.feedback || "Waiting for teacher review..."}</td>

<td>

<textarea
id="question-${document.id}"
rows="3"
style="width:200px;"
placeholder="Ask your teacher...">${data.studentQuestion || ""}</textarea>

<br><br>

<button onclick="saveQuestion('${document.id}')">

Send

</button>

</td>

<td>

${data.teacherReply || "No reply yet."}

</td>

<td>

${data.submittedAt || "-"}

</td>

</tr>

`;

});

}catch(error){

console.error(error);

submissionTable.innerHTML=`

<tr>

<td colspan="8" style="text-align:center;color:red;">

Failed to load submissions.

</td>

</tr>

`;

}

}

// ==============================
// SAVE QUESTION
// ==============================

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
