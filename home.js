import {
  db,
  collection,
  getDocs
} from "./firebase.js";

const assignmentGrid = document.getElementById("assignmentGrid");

async function loadAssignments() {

    const snapshot = await getDocs(collection(db, "assignments"));

    assignmentGrid.innerHTML = "";

    let number = 1;

    snapshot.forEach((doc) => {

        const data = doc.data();

        assignmentGrid.innerHTML += `
        <div class="assignment-card">

            <div class="assignment-number">
                Assignment #${number++}
            </div>

            <h3>${data.title}</h3>

            <p>${data.description}</p>

            <div class="assignment-date">
                Due: ${data.dueDate}
            </div>

            <div class="assignment-buttons">

                <a href="${data.download}" class="download-btn">
                    Download
                </a>

                <a href="#" class="submit-btn">
                    Submit
                </a>

            </div>

        </div>
        `;

    });

}

loadAssignments();
