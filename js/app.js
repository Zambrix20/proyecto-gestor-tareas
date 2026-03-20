
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
    // const text = input.value
    // const listItem = document.createElement("li")
    // listItem.textContent = text
    // list.appendChild(listItem)
    // input.value = ""
    addTask()
});

/**
 * Adds a new task to the task list.
 * Retrieves the text from the input, creates a new list item (li),
 * appends it to the DOM, and resets the input field.
 * Does nothing if the input field is empty.
 */
function addTask() {

    const text = input.value

    if (text.trim() === "") return

    // const listItem = document.createElement("li")

    // listItem.textContent = text

    // Appends the new task to the list
    // list.appendChild(listItem)
    // Add the task to the tasks array
    tasks.push(text)

    localStorage.setItem("tasks", JSON.stringify(tasks))

    renderTasks()

    input.value = ""

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

// function deleteTask(task) {
//     tasks.removeChild(task.lastChild)
// }

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
        listItem.textContent = task
        list.appendChild(listItem)
    })
}