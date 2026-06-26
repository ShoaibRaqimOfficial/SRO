import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const form = document.getElementById("assignmentForm");

const title = document.getElementById("title");
const description = document.getElementById("description");
const dueDate = document.getElementById("dueDate");
const download = document.getElementById("download");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "assignments"), {

            title: title.value,
            description: description.value,
            dueDate: dueDate.value,
            download: download.value,
            status: "Active"

        });

        message.style.color = "green";
        message.textContent = "Assignment Published Successfully!";

        form.reset();

    } catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
