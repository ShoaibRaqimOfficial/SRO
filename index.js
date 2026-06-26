import {
  db,
  auth,
  onAuthStateChanged
} from "./firebase.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    loadAssignments();

});
const assignmentGrid = document.getElementById("assignmentGrid");

async function loadAssignments() {

    try {

        assignmentGrid.innerHTML = "";

        const snapshot = await getDocs(collection(db, "assignments"));

        snapshot.forEach((doc) => {

            const data = doc.data();

            assignmentGrid.innerHTML += `

            <div class="assignment-card">

                <div class="assignment-number">
                    ${data.status}
                </div>

                <h3>${data.title}</h3>

                <p>${data.description}</p>

                <div class="assignment-date">
                    Due: ${data.dueDate}
                </div>

                <div class="assignment-buttons">

                    <a href="${data.download}" target="_blank" class="download-btn">
                        Download
                    </a>

                    <a href="#" class="submit-btn">
                        Submit
                    </a>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

