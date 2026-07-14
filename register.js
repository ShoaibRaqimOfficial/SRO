import {
    auth,
    db,
    createUserWithEmailAndPassword
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
const dob = document.getElementById("dob");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const course = document.getElementById("course");
const reason = document.getElementById("reason");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    if (password.value !== confirmPassword.value) {

        message.style.color = "red";
        message.textContent = "Passwords do not match.";
        return;

    }

    try {

        // Create Firebase Authentication Account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        // Save Admission Application
        await addDoc(collection(db, "applications"), {

            uid: userCredential.user.uid,

            fullName: fullName.value,

            email: email.value,

            phone: phone.value,

            city: city.value,

            dob: dob.value,

            course: course.value,

            reason: reason.value,

            status: "Pending",

            approved: false,

            rejected: false,

            appliedAt: new Date().toISOString()

        });

        message.style.color = "green";

        message.innerHTML = `
        ✅ Application Submitted Successfully.<br><br>
        Your admission request has been sent to SRO Academy.<br>
        Please wait for Admin Approval before logging in.
        `;

        registerForm.reset();

    }

    catch(error){

        console.error(error);

        message.style.color = "red";

        message.textContent = error.message;

    }

});
