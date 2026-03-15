// JS
const input = document.querySelector("input")
const button = document.querySelector("button")
const list = document.querySelector("#tasks")

button.addEventListener("click", () => {

    const text = input.value

    // if (text === "") return

    const li = document.createElement("li")

    li.textContent = text

    list.appendChild(li)

    input.value = ""

});

// Funcion para agregar una tarea
function addTask() {

    const text = input.value

    // if (text === "") return

    const li = document.createElement("li")

    li.textContent = text

    list.appendChild(li) // Agrega la tarea a la lista una tras de otra

    input.value = ""

}
