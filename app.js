import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCsFHPPZi8XetwTKUuuRYmD6o_dNsaaT9I",
    authDomain: "skillsync-ai-8145b.firebaseapp.com",
    projectId: "skillsync-ai-8145b",
    storageBucket: "skillsync-ai-8145b.appspot.com",
    messagingSenderId: "22952267788",
    appId: "1:22952267788:web:73311ef68fc22be1561e29"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ========================
// 📌 UI ELEMENTS
// ========================
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

// ========================
// 📌 Helper: Show message
// ========================
function showMessage(msg, color = "red") {
    const el = document.getElementById("message");
    if (!el) return;
    el.style.color = color;
    el.innerText = msg;
}

// ========================
// 📌 Email validation
// ========================
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// ========================
// 📌 Loading state
// ========================
function setLoading(isLoading) {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => btn.disabled = isLoading);
}

// ========================
// 🔐 SIGNUP
// ========================
async function signup() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Enter email and password");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Enter a valid email");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters");
        return;
    }

    try {
        setLoading(true);
        showMessage("Creating account...", "black");

        await createUserWithEmailAndPassword(auth, email, password);

        showMessage("✅ Signup Successful!", "green");

    } catch (error) {
        console.error(error);
        showMessage(error.message);
    } finally {
        setLoading(false);
    }
}

// ========================
// 🔐 LOGIN
// ========================
async function login(event) {
    if (event) event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Enter email and password");
        return;
    }

    try {
        setLoading(true);
        showMessage("Logging in...", "black");

        await signInWithEmailAndPassword(auth, email, password);

        showMessage("✅ Login Successful", "green");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } catch (error) {
        console.error(error);
        showMessage(error.message);
    } finally {
        setLoading(false);
    }
}

// ========================
// 🔗 EVENT LISTENERS
// ========================
signupBtn.addEventListener("click", signup);
loginBtn.addEventListener("click", login);