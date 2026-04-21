// Supabase configuration loaded from config.js

const registerButton = document.getElementById("register-btn")
const loginButton = document.getElementById("login-btn")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const errorMsg = document.getElementById("error-msg")
const errorText = document.getElementById("error-text")
const emailError = document.getElementById("email-error")
const passwordError = document.getElementById("password-error")

function showError(msg) {
    if (errorText) errorText.textContent = msg;
    if (errorMsg) errorMsg.classList.add("show");
}

function hideError() {
    if (errorMsg) errorMsg.classList.remove("show");
}

function validateFields() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    if (!email) {
        if (emailError) emailError.classList.add("show");
        isValid = false;
    } else {
        if (emailError) emailError.classList.remove("show");
    }

    if (!password) {
        if (passwordError) passwordError.classList.add("show");
        isValid = false;
    } else {
        if (passwordError) passwordError.classList.remove("show");
    }

    return isValid;
}

emailInput.addEventListener("input", () => {
    if (emailError && emailError.classList.contains("show")) emailError.classList.remove("show");
    hideError();
});

passwordInput.addEventListener("input", () => {
    if (passwordError && passwordError.classList.contains("show")) passwordError.classList.remove("show");
    hideError();
});

function handleEnterPress(event) {
    if (event.key === "Enter") {
        loginButton.click();
    }
}

emailInput.addEventListener("keydown", handleEnterPress);
passwordInput.addEventListener("keydown", handleEnterPress);

registerButton.addEventListener("click", async () => {
    hideError();
    if (!validateFields()) return;

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    const { data, error } = await supabaseClient.auth.signUp({ email, password })
    if (error) {
        console.error("Error registering:", error)
        showError(error.message)
        return
    }
    window.location.href = "index.html";
})

loginButton.addEventListener("click", async () => {
    hideError();
    if (!validateFields()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
    if (error) {
        console.error("Error logging in:", error)
        showError("Credenciales incorrectas")
        return
    }
    window.location.href = "index.html";
})

// Si ya hay sesión iniciada, redirigir a la vista de tareas
/**
 * Event listener that executes when the page finishes loading.
 * Checks the current session state using Supabase authentication.
 * If a valid user session exists, redirects the user automatically to the tasks view (index.html).
 * 
 * @listens window:load
 * @returns {Promise<void>}
 */
window.addEventListener("load", async () => {
    const { data } = await supabaseClient.auth.getUser();

    // if data and data.user exist, redirect to index.html
    // data.user is the user object returned by supabase, it contains information about the authenticated user
    if (data && data.user) {
        window.location.href = "index.html"; // redirect to the tasks view if the user is already authenticated
    }
});
