import { db, auth, onAuthStateChanged } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const assignmentGrid = document.getElementById("assignmentGrid");

// ==============================
// AUTH CHECK
// ==============================
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadAssignments(user);

});

// ==============================
// LOAD ASSIGNMENTS
// ==============================
async function loadAssignments(user) {

    assignmentGrid.innerHTML = "<p>Loading Assignments...</p>";

    try {

        const snapshot = await getDocs(collection(db, "assignments"));

        assignmentGrid.innerHTML = "";

        if (snapshot.empty) {
            assignmentGrid.innerHTML = "<p>No Assignments Available.</p>";
            return;
        }

        for (const assignment of snapshot.docs) {

            const data = assignment.data();

            // Check if already submitted
            const alreadySubmitted = await getDocs(
                query(
                    collection(db, "submissions"),
                    where("studentEmail", "==", user.email),
                    where("assignmentId", "==", data.title)
                )
            );

            const submitted = !alreadySubmitted.empty;

            const card = document.createElement("div");
            card.className = "assignment-card";

            card.innerHTML = `
            
                <div class="assignment-number">
                    Assignment
                </div>

                <h3>${data.title}</h3>

                <p>${data.description}</p>

                <div class="assignment-date">
                    Due : ${data.dueDate}
                </div>

                <div class="assignment-buttons">

                    <a href="${data.download}"
                       target="_blank"
                       class="download-btn">
                       Download Task
                    </a>

                    ${
                        submitted
                        ?
                        `<a class="submit-btn" style="background:green;pointer-events:none;">
                            Submitted ✔
                        </a>`
                        :
                        `<a href="#"
                            class="submit-btn"
                            onclick="submitTask('${assignment.id}','${data.title}')">
                            Submit Task
                        </a>`
                    }

                </div>

            `;

            assignmentGrid.appendChild(card);

        }

    }

    catch (error) {

        console.error(error);

    }

}

// ==============================
// SUBMIT TASK
// ==============================
window.submitTask = async function (assignmentId, title) {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.zip,.rar,.doc,.docx";

    input.onchange = async () => {

        const file = input.files[0];

        if (!file) return;

        const user = auth.currentUser;

        try {

            // Upload to Cloudflare Worker
            const formData = new FormData();
            formData.append("file", file);

            const upload = await fetch(
                "https://twilight-queen-9702.westanking2.workers.dev/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await upload.json();

            if (!result.success) {
                throw new Error(result.error || "Upload Failed");
            }

            // Save submission in Firestore
            await addDoc(collection(db, "submissions"), {

                assignmentId: title,

                assignmentLink: result.url,

                fileName: result.filename,

                studentName: user.displayName || user.email.split("@")[0],

                studentEmail: user.email,

                status: "Pending",

                pros: "",

                cons: "",

                feedback: "",

                submittedAt: new Date().toISOString()

            });

            alert("✅ Assignment Submitted Successfully.");

            loadAssignments(user);

        }
        catch (err) {

            alert(err.message);

        }

    };

    input.click();

};
};
