import { db, auth, onAuthStateChanged, signOut } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// ==============================
// ADMIN EMAIL SECURITY
// ==============================
const ADMIN_EMAIL = "westanking2@gmail.com";

// DOM Elements
const totalAssignmentsEl = document.getElementById("totalAssignmentsCount");
const pendingSubmissionsEl = document.getElementById("pendingSubmissionsCount");
const approvedSubmissionsEl = document.getElementById("approvedSubmissionsCount");
const logoutBtn = document.getElementById("logoutBtn");

// ==============================
// SECURITY CHECK
// ==============================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    if (user.email !== ADMIN_EMAIL) {
        alert("Access Denied! You are not an Admin.");
        window.location.href = "login.html"; 
        return;
    }
    
    // Agar admin hai, toh statistics load karo
    loadDashboardStats();
});

// ==============================
// FETCH DASHBOARD STATS
// ==============================
async function loadDashboardStats() {
    try {
        // 1. Fetch Total Assignments
        const assignmentsSnap = await getDocs(collection(db, "assignments"));
        totalAssignmentsEl.textContent = assignmentsSnap.size; // Total assignments count

        // 2. Fetch Submissions & Calculate Status
        const submissionsSnap = await getDocs(collection(db, "submissions"));
        let pendingCount = 0;
        let approvedCount = 0;

        submissionsSnap.forEach((doc) => {
            const data = doc.data();
            // Default status ko hum empty ya "Pending" assume karte hain
            if (!data.status || data.status === "Pending") {
                pendingCount++;
            } else if (data.status === "Approved") {
                approvedCount++;
            }
        });

        // Update HTML Cards
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
        }
    });
}
