// Supabase configuration loaded from config.js

const input = document.querySelector("input");
const button = document.querySelector(".input-group button");
const list = document.querySelector("#tasks");
const loader = document.getElementById("loader");

let tasks = [];
// Local storage loading removed to avoid rendering outdated/empty tasks before Supabase fetch completes.

/**
 * Event listener that handles adding a task when the button is clicked.
 */
button.addEventListener("click", () => {
    addTask();
});

input.addEventListener("input", () => {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage && errorMessage.classList.contains("show")) {
        errorMessage.classList.remove("show");
    }
});

/**
 * Adds a new task to the task list.
 * Retrieves the text from the input, creates a new list item (li),
 * appends it to the DOM, and resets the input field.
 * Does nothing if the input field is empty.
 */
async function addTask() {
    const user = await getUser();
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    const text = input.value;
    const errorMessage = document.getElementById("error-message");

    if (text.trim() === "") {
        if (errorMessage) errorMessage.classList.add("show");
        return;
    } else {
        if (errorMessage) errorMessage.classList.remove("show");
    }

    const { error } = await supabaseClient
        .from("tasks")
        .insert({ text, user_id: user.id });
    // Visualizar el error en la consola
    if (error) {
        console.error("Error adding task:", error);
        return;
    }

    getTasks();

    input.value = "";
}

async function getTasks() {
    const user = await getUser();
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    loader.style.display = "block"; // Mostrar loader
    list.innerHTML = ""; // Limpiar la lista mientras carga

    const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);

    loader.style.display = "none"; // Ocultar loader cuando termina

    if (error) {
        console.error("Error fetching tasks:", error);
        return;
    }
    // tasks = data.map(task => task.text)
    tasks = data; // data es el array de objetos que contiene las tareas, cada objeto tiene una propiedad "text" que es el texto de la tarea. Al asignar data a tasks, estamos almacenando el array completo de objetos en lugar de solo los textos.
    renderTasks();
}

/**
 * Clears all tasks from the task list.
 * Sets the innerHTML of the tasks list to an empty string, effectively removing all child elements.
 *
 * @returns {void}
 */
// function clearTasks() {
//     tasks.innerHTML = ""
// }

async function deleteTask(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

    await supabaseClient.from("tasks").delete().eq("id", id);
    tasks = tasks.filter((task) => task.id !== id);
    getTasks();
}

/**
 * Renders the current list of tasks in the DOM.
 * Clears the existing tasks and iterates over the tasks array to create and append list items for each task.
 * Assumes that `tasks` is an array of task strings and that the `list` variable refers to the DOM element where tasks are displayed.
 *
 * @returns {void}
 */
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task) => {
        const listItem = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action-buttons");

        const editButton = document.createElement("button");
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <span class="btn-text">Editar</span>
        `;
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", () => {
            editTask(task);
        });
        actionDiv.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span class="btn-text">Eliminar</span>
        `;
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });
        actionDiv.appendChild(deleteButton);

        listItem.appendChild(actionDiv);
        list.appendChild(listItem);
    });
}

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
});

/**
 *  Gets the currently authenticated user from Supabase.
 *  Uses the `getUser` method from the Supabase client to retrieve the user data.
 *  If there is an error during the retrieval, it logs the error to the console.
 *
 * @returns {void}
 */
async function getUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    const userInfoDiv = document.getElementById("user-info");
    if (error || !data.user) {
        if (userInfoDiv) userInfoDiv.style.display = "none";
        window.location.href = "login.html";
        return null;
    }

    if (userInfoDiv) {
        document.getElementById("user-email").textContent = data.user.email;
        // Generate an avatar based on the user's email
        document.getElementById("user-avatar").src =
            `https://ui-avatars.com/api/?name=${data.user.email}&background=random`;
        userInfoDiv.style.display = "flex";
    }

    return data.user;
}

async function editTask(item) {
    const newText = prompt("Editar tarea", item.text);

    if (newText === null) return;
    if (newText.trim() === "") return;

    await supabaseClient.from("tasks").update({ text: newText }).eq("id", item.id);

    getTasks();
}

getTasks(); // Llamar a la función getTasks para cargar las tareas desde Supabase al cargar la página.
