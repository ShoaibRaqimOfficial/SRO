import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const submissionTable = document.getElementById("submissionTable");

async function loadSubmissions() {

    try {

        submissionTable.innerHTML = "";

        const snapshot = await getDocs(collection(db, "submissions"));

        snapshot.forEach((doc) => {

            const data = doc.data();

            submissionTable.innerHTML += `

            <tr>

                <td>${data.studentName}</td>

                <td>${data.studentEmail}</td>

                <td>${data.assignmentId}</td>

                <td>${data.status}</td>

                <td>
                    <a href="${data.assignmentLink}" target="_blank">
                        Open
                    </a>
                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

loadSubmissions();
