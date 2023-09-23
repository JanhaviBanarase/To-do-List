document.addEventListener("DOMContentLoaded", function() {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");

  // Load tasks from storage on popup open
  chrome.runtime.sendMessage({ action: "getTasks" }, (tasks) => {
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => addTaskToUI(task));
    }
  });

  addTaskBtn.addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const task = { text: taskText, completed: false };
      addTaskToUI(task);
      saveTasksToStorage();
      taskInput.value = "";
    }
  });

  taskList.addEventListener("click", function(event) {
    if (event.target.tagName === "INPUT") {
      const checkbox = event.target;
      const taskText = checkbox.nextElementSibling;
      taskText.classList.toggle("strike");
      saveTasksToStorage();
      setTimeout(() => {
        const listItem = checkbox.closest("li");
        if (listItem && listItem.parentNode === taskList) {
          taskList.removeChild(listItem);
          saveTasksToStorage(); // Save again after removing from UI
        }
      }, 2000);
    }
  });

  function addTaskToUI(task) {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="${task.completed ? "strike" : ""}">${task.text}</span>
    `;
    taskList.appendChild(li);
  }

  function saveTasksToStorage() {
    const tasks = Array.from(taskList.querySelectorAll("li")).map(li => {
      const text = li.querySelector("span").textContent;
      const completed = li.querySelector("input").checked;
      return { text, completed };
    });
    chrome.runtime.sendMessage({ action: "setTasks", tasks: tasks });
  }
});
