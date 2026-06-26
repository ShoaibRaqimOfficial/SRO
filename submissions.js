import { db, auth, onAuthStateChanged } from "./firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================
const ADMIN_EMAIL = "itsraqim@gmail.com"; 

const submissionTable = document.getElementById("submissionTable");

// ==============================
// SECURITY CHECK (SMART VERSION)
// ==============================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    const currentUserEmail = user.email.trim().toLowerCase();
    const adminEmailToMatch = ADMIN_EMAIL.trim().toLowerCase();
    
    if (currentUserEmail !== adminEmailToMatch) {
        alert("Access Denied! System is currently seeing this email: " + currentUserEmail);
        window.location.href = "login.html";
        return;
    }
    loadSubmissions();
});

// ==============================
// LOAD SUBMISSIONS
// ==============================
async function loadSubmissions() {
    if(!submissionTable) return;
    submissionTable.innerHTML = "<tr><td colspan='6' style='text-align:center;'>Loading data...</td></tr>";
    try {
        const snapshot = await getDocs(collection(db, "submissions"));
        submissionTable.innerHTML = "";
        
        if(snapshot.empty) {
            submissionTable.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No submissions found.</td></tr>";
            return;
        }

        snapshot.forEach((document) => {
            const data = document.data();
            const statusVal = data.status || "Pending";
            
            submissionTable.innerHTML += `
            <tr>
                <td>${data.studentName}</td>
                <td>${data.studentEmail}</td>
                <td>${data.assignmentId || 'N/A'}</td>
                <td><span class="status ${statusVal}">${statusVal}</span></td>
                <td>
                    <a href="${data.assignmentLink}" target="_blank" class="btn-link">
                        <i class="fas fa-external-link-alt"></i> Open
                    </a>
               <td>
    <textarea
        id="pros-${document.id}"
        placeholder="Pros..."
        rows="3"
        style="width:180px;"
    >${data.pros || ""}</textarea>
</td>

<td>
    <textarea
        id="cons-${document.id}"
        placeholder="Needs Improvement..."
        rows="3"
        style="width:180px;"
    >${data.cons || ""}</textarea>
</td>

<td>
    <textarea
        id="feedback-${document.id}"
        placeholder="Overall Feedback..."
        rows="3"
        style="width:220px;"
    >${data.feedback || ""}</textarea>
</td>

<td class="action-btns">

    <button onclick="saveFeedback('${document.id}')">
        💾 Save
    </button>

    <button class="btn-approve" onclick="approveSubmission('${document.id}')">
        ✅
    </button>

    <button class="btn-reject" onclick="rejectSubmission('${document.id}')">
        ❌
    </button>

    <button class="btn-delete" onclick="deleteSubmission('${document.id}')">
        🗑
    </button>

</td>
            </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading submissions:", error);
    }
}

// ==============================
// APPROVE
// ==============================
window.approveSubmission = async function(id){
    await updateDoc(doc(db,"submissions",id),{
        status:"Approved"
    });
    loadSubmissions();
}

// ==============================
// REJECT
// ==============================
window.rejectSubmission = async function(id){
    await updateDoc(doc(db,"submissions",id),{
        status:"Rejected"
    });
    loadSubmissions();
}

// ==============================
// DELETE
// ==============================
window.deleteSubmission = async function(id){
    if(confirm("Are you sure you want to delete this submission?")){
        await deleteDoc(doc(db,"submissions",id));
        loadSubmissions();
    }
}
