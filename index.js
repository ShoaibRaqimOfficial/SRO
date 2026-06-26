import { db, auth, onAuthStateChanged } from "./firebase.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const assignmentGrid = document.getElementById("assignmentGrid");

// ==============================
// AUTH CHECK (SURETY)
// ==============================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    loadAssignments();
});

// ==============================
// FETCH ASSIGNMENTS FROM FIRESTORE
// ==============================
async function loadAssignments() {
    assignmentGrid.innerHTML = "<p>Loading assignments...</p>";
    try {
        const querySnapshot = await getDocs(collection(db, "assignments"));
        assignmentGrid.innerHTML = ""; // Grid saaf karein

        if (querySnapshot.empty) {
            assignmentGrid.innerHTML = "<p>No assignments posted yet.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement("div");
            card.className = "course-card"; // Aapki style use kar rahe hain
            card.innerHTML = `
                <h3>${data.title}</h3>
                <p><strong>Due:</strong> ${data.dueDate}</p>
                <p>${data.description}</p>
                <a href="${data.download}" target="_blank" class="btn secondary" style="display:block; margin: 10px 0; text-align:center;">Download Task</a>
                <button onclick="submitTask('${doc.id}', '${data.title}')" class="btn primary" style="width:100%; border:none;">Submit Task</button>
            `;
            assignmentGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading assignments:", error);
    }
}

// ==============================
// SUBMIT ASSIGNMENT LOGIC
// ==============================
window.submitTask = async function(assignmentId, title) {
    const link = prompt("Enter your Drive/Project Link for: " + title);
    
    if (link) {
        try {
            const user = auth.currentUser;
            await addDoc(collection(db, "submissions"), {
                assignmentId: title,
                assignmentLink: link,
                studentName: user.email.split('@')[0], // Email se naam nikalna
                studentEmail: user.email,
                status: "Pending",
                submittedAt: new Date().toISOString()
            });
            alert("Assignment Submitted Successfully!");
        } catch (error) {
            alert("Error submitting task: " + error.message);
        }
    }
};
