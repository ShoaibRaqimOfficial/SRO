import {
    db,
    auth,
    onAuthStateChanged,
    collection,
    addDoc,
    serverTimestamp
} from "./firebase.js";

const form = document.getElementById("aiOrderForm");
const message = document.getElementById("message");

// ==============================
// LOGIN CHECK
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

});

// ==============================
// CREDIT CALCULATOR
// ==============================

const durationSelect = document.getElementById("duration");
const creditText = document.getElementById("creditText");

function updateCredits() {

    const duration = parseInt(durationSelect.value);

    let credits = Math.ceil(duration / 20);

    creditText.textContent = `${credits} Credit${credits > 1 ? "s" : ""}`;

}

durationSelect.addEventListener("change", updateCredits);

updateCredits();
// ==============================
// SUBMIT ORDER
// ==============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {

        message.style.color = "red";
        message.textContent = "Please login first.";
        return;

    }

    const script = document.getElementById("script").value.trim();
    const language = document.getElementById("language").value;
    const ratio = document.getElementById("ratio").value;
    const duration = parseInt(document.getElementById("duration").value);
    const notes = document.getElementById("notes").value.trim();

    const avatarFile = document.getElementById("avatar").files[0];
    const voiceFile = document.getElementById("voice").files[0];

    if (!script || !avatarFile || !voiceFile) {

        message.style.color = "red";
        message.textContent = "Please complete all required fields.";
        return;

    }

    const credits = Math.ceil(duration / 20);

    message.style.color = "#2563eb";
    message.textContent = "Submitting your AI video request...";

    try {
              await addDoc(collection(db, "aiOrders"), {

            userId: user.uid,

            userEmail: user.email,

            script: script,

            language: language,

            ratio: ratio,

            duration: duration,

            creditsUsed: credits,

            notes: notes,

            // Abhi file upload implement nahi hua,
            // isliye sirf filename save kar rahe hain.
            avatarFileName: avatarFile.name,

            voiceFileName: voiceFile.name,

            status: "Queue",

            driveLink: "",

            adminMessage: "",

            createdAt: serverTimestamp()

        });

        message.style.color = "green";
        message.textContent = "✅ Your AI Video request has been submitted successfully.";

        form.reset();

        updateCredits();

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent = error.message;

    }

});
