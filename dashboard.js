import { db, auth, onAuthStateChanged } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================
const ADMIN_EMAIL = "itsraqim@gmail.com";

// DOM Elements
const totalAssignmentsEl = document.getElementById("totalAssignmentsCount");
const pendingSubmissionsEl = document.getElementById("pendingSubmissionsCount");
const approvedSubmissionsEl = document.getElementById("approvedSubmissionsCount");
const logoutBtn = document.getElementById("logoutBtn");

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
    
    loadDashboardStats();
});

// ==============================
// FETCH DASHBOARD STATS
// ==============================
async function loadDashboardStats() {
    try {
        const assignmentsSnap = await getDocs(collection(db, "assignments"));
        totalAssignmentsEl.textContent = assignmentsSnap.size;

        const submissionsSnap = await getDocs(collection(db, "submissions"));
        let pendingCount = 0;
        let approvedCount = 0;

        submissionsSnap.forEach((doc) => {
            const data = doc.data();
            if (!data.status || data.status === "Pending") {
                pendingCount++;
            } else if (data.status === "Approved") {
                approvedCount++;
            }
        });

        pendingSubmissionsEl.textContent = pendingCount;
        approvedSubmissionsEl.textContent = approvedCount;

    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// ==============================
// LOGOUT FUNCTION
// ==============================
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed: " + error.message);
        }
    });
}
