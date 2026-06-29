import {
    auth,
    db,
    createUserWithEmailAndPassword,
    doc,
    setDoc
} from "./firebase.js";

const registerForm = document.getElementById("registerForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (password.value !== confirmPassword.value) {

        message.style.color = "red";
        message.textContent = "Passwords do not match.";

        return;

    }

    try {

        const userCredential = await createUserWithEmailAndPassword(

            auth,
            email.value,
            password.value

        );

        const user = userCredential.user;

        await setDoc(doc(db, "students", user.uid), {

            uid: user.uid,

            fullName: fullName.value,

            email: email.value,

            phone: phone.value,

            dob: dob.value,

            profileImage: "",

            status: "Active",

            joinedAt: new Date().toISOString()

        });

        message.style.color = "green";
        message.textContent = "Account Created Successfully! Redirecting...";

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

catch (error) {

    console.error("REGISTER ERROR:", error);

    message.style.color = "red";
    message.textContent = error.message;

    alert(error.message);

}

});
const togglePassword=document.getElementById("togglePassword");
const toggleConfirmPassword=document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click",()=>{

if(password.type==="password"){

password.type="text";
togglePassword.textContent="Hide";

}else{

password.type="password";
togglePassword.textContent="Show";

}

});

toggleConfirmPassword.addEventListener("click",()=>{

if(confirmPassword.type==="password"){

confirmPassword.type="text";
toggleConfirmPassword.textContent="Hide";

}else{

confirmPassword.type="password";
toggleConfirmPassword.textContent="Show";

}

});
