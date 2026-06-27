import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    updateDoc
} from "./firebase.js";

import {
    getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const profileImage = document.getElementById("profileImage");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const saveProfile = document.getElementById("saveProfile");
const message = document.getElementById("message");

let currentUser = null;

// ==============================
// AUTH CHECK
// ==============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    const studentRef = doc(db, "students", user.uid);

    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {

        const data = studentSnap.data();

        fullName.value = data.fullName || "";
        email.value = data.email || "";
        phone.value = data.phone || "";
        dob.value = data.dob || "";

        if (data.profileImage) {

            profileImage.src = data.profileImage;

        }

    }

});

// ==============================
// SAVE PROFILE
// ==============================

saveProfile.addEventListener("click", async () => {

    try {

        await updateDoc(doc(db, "students", currentUser.uid), {

            fullName: fullName.value,
            phone: phone.value,
            dob: dob.value

        });

        message.style.color = "green";
        message.textContent = "Profile Updated Successfully.";

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
