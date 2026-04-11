
// Supabase configuration loaded from config.js

const input = document.querySelector("input")
const button = document.querySelector("button")
const list = document.querySelector("#tasks")

let tasks = []
// Save the tasks to local storage as a JSON string. When the page is loaded, retrieve the tasks from local storage and parse them back into an array. If there are saved tasks, render them in the DOM.
const savedTasks = localStorage.getItem("tasks")

if (savedTasks) {
    tasks = JSON.parse(savedTasks)
    renderTasks()
}

/**
 * Event listener that handles adding a task when the button is clicked.
 */
button.addEventListener("click", () => {
    addTask()
});

/**
 * Adds a new task to the task list.
 * Retrieves the text from the input, creates a new list item (li),
 * appends it to the DOM, and resets the input field.
 * Does nothing if the input field is empty.
 */
async function addTask() {

    const user = await getUser()
    if (!user) {
        console.error("User not authenticated")
        return
    }

    const text = input.value

    if (text.trim() === "") return

    const { error } = await supabaseClient.from("tasks").insert({ text, user_id: user.id })
    // Visualizar el error en la consola
    if (error) {
        console.error("Error adding task:", error)
        return
    }

    getTasks()

    input.value = ""

}

async function getTasks() {
    const user = await getUser()
    if (!user) {
        console.error("User not authenticated")
        return
    }
    const { data, error } = await supabaseClient.from("tasks").select("*").eq("user_id", user.id)
    if (error) {
        console.error("Error fetching tasks:", error)
        return
    }
    // tasks = data.map(task => task.text)
    tasks = data // data es el array de objetos que contiene las tareas, cada objeto tiene una propiedad "text" que es el texto de la tarea. Al asignar data a tasks, estamos almacenando el array completo de objetos en lugar de solo los textos.
    renderTasks()
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

    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return

    await supabaseClient.from("tasks").delete().eq("id", id)
    tasks = tasks.filter(task => task.id !== id)
    getTasks()
}

/**
 * Renders the current list of tasks in the DOM.
 * Clears the existing tasks and iterates over the tasks array to create and append list items for each task.
 * Assumes that `tasks` is an array of task strings and that the `list` variable refers to the DOM element where tasks are displayed.
 *
 * @returns {void}
 */
function renderTasks() {
    list.innerHTML = ""

    tasks.forEach(task => {
        const listItem = document.createElement("li")
        listItem.textContent = task.text
        list.appendChild(listItem)

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Eliminar"
        deleteButton.classList.add("delete-btn")
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id)
        })
        listItem.appendChild(deleteButton)
    })
}

const logoutBtn = document.getElementById("logout-btn")

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
    const { data, error } = await supabaseClient.auth.getUser()
    if (error || !data.user) {
        logoutBtn.style.display = "none";
        window.location.href = "login.html";
        return null
    }
    logoutBtn.style.display = "block";
    return data.user
}


getTasks() // Llamar a la función getTasks para cargar las tareas desde Supabase al cargar la página.


