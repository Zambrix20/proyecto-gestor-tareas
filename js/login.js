// Supabase configuration loaded from config.js

const registerButton = document.getElementById("register-btn")
const loginButton = document.getElementById("login-btn")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const errorMsg = document.getElementById("error-msg")

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "block";
}

registerButton.addEventListener("click", async () => {
    const email = emailInput.value
    const password = passwordInput.value
    if (!email || !password) return showError("Completa todos los campos");

    const { data, error } = await supabaseClient.auth.signUp({ email, password })
    if (error) {
        console.error("Error registering:", error)
        showError(error.message)
        return
    }
    window.location.href = "index.html";
})

loginButton.addEventListener("click", async () => {
    const email = emailInput.value
    const password = passwordInput.value
    if (!email || !password) return showError("Completa todos los campos");

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