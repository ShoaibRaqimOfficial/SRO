import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const createAccount = document.getElementById("createAccount");

// Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try{
        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.style.color = "green";
        message.textContent = "Login Successful!";

        setTimeout(()=>{
            window.location.href="index.html";
        },1000);

    }catch(error){

        message.style.color="red";
        message.textContent=error.message;

    }

});

// Create Account
createAccount.addEventListener("click", async (e)=>{

    e.preventDefault();

    try{

        await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        message.style.color="green";
        message.textContent="Account Created Successfully!";

    }catch(error){

        message.style.color="red";
        message.textContent=error.message;

    }

});
