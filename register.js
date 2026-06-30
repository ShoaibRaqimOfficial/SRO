import {
db
} from "./firebase.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const city = document.getElementById("city");
const course = document.getElementById("course");
const reason = document.getElementById("reason");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "applications"), {

            fullName: fullName.value,

            email: email.value,

            phone: phone.value,

            city: city.value,

            course: course.value,

            reason: reason.value,

            status: "Pending",

            appliedAt: new Date().toISOString()

        });

        message.style.color = "green";

        message.innerHTML = `
        ✅ Application Submitted Successfully.<br><br>
        Your admission request has been sent to SRO Academy.<br>
        Please wait for approval from the admin.
        `;

        registerForm.reset();

    }

    catch(error){

        console.error(error);

        message.style.color="red";

        message.textContent=error.message;

    }

});
