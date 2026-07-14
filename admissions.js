import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ======================================
// ADMIN SECURITY
// ======================================

const ADMIN_EMAIL = "itsraqim@gmail.com";

const applicationTable = document.getElementById("applicationTable");
const totalPending = document.getElementById("totalPending");

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

    loadApplications();

});
// ======================================
// LOAD APPLICATIONS
// ======================================

async function loadApplications() {

applicationTable.innerHTML = `
<tr>
<td colspan="8" align="center">
Loading Applications...
</td>
</tr>
`;

try {

const snapshot = await getDocs(collection(db, "applications"));

applicationTable.innerHTML = "";

let pendingCount = 0;

if (snapshot.empty) {

applicationTable.innerHTML = `
<tr>
<td colspan="8" align="center">
No Applications Found
</td>
</tr>
`;

totalPending.textContent = "0";

return;

}

snapshot.forEach((application) => {

const data = application.data();

if ((data.status || "").toLowerCase() === "pending") {
pendingCount++;
}

const statusClass =
(data.status || "").toLowerCase() === "approved"
? "approved"
: (data.status || "").toLowerCase() === "rejected"
? "rejected"
: "pending";

applicationTable.innerHTML += `

<tr>

<td>${data.fullName || "-"}</td>

<td>${data.email || "-"}</td>

<td>${data.phone || "-"}</td>

<td>${data.dob || "-"}</td>

<td>${data.city || "-"}</td>

<td>${data.course || "-"}</td>

<td>

<span class="${statusClass}">
${data.status || "Pending"}
</span>

</td>

<td>

<button
class="approve"
onclick="approveApplication('${application.id}')">

Approve

</button>

<button
class="reject"
style="margin-left:8px;"
onclick="rejectApplication('${application.id}')">

Reject

</button>

</td>

</tr>

`;

});

totalPending.textContent = pendingCount;

} catch (error) {

console.error(error);

applicationTable.innerHTML = `
<tr>
<td colspan="8" align="center">
Failed to load applications.
</td>
</tr>
`;

}

}
// ======================================
// APPROVE APPLICATION
// ======================================

window.approveApplication = async function (id) {

const ok = confirm("Approve this student's admission?");

if (!ok) return;

try {

await updateDoc(doc(db, "applications", id), {

status: "Approved"

});

alert("Student Approved Successfully.");

loadApplications();

} catch (error) {

console.error(error);

alert(error.message);

}

};

// ======================================
// REJECT APPLICATION
// ======================================

window.rejectApplication = async function (id) {

const ok = confirm("Reject this student's admission?");

if (!ok) return;

try {

await updateDoc(doc(db, "applications", id), {

status: "Rejected"

});

alert("Student Rejected Successfully.");

loadApplications();

} catch (error) {

console.error(error);

alert(error.message);

}

};
