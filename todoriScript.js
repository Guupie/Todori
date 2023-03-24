const phases = [
    {id: 'open-task-list', name: 'Offene Aufgaben'},
    {id: 'in-progress-task-list', name: 'In Bearbeitung'},
    {id: 'completed-task-list', name: 'Abgeschlossen'},
];

document.addEventListener('DOMContentLoaded', loadTasks);

function createTask(taskText, listId, isReload = false) {
    const task = document.createElement('li');
    task.className = 'task';

    const currentPhaseIndex = phases.findIndex((phase) => phase.id === listId);

    const taskTextNode = document.createElement('span');
    taskTextNode.className = 'task-text';
    taskTextNode.textContent = taskText;
    task.appendChild(taskTextNode);

    const previousArrow = document.createElement('button');
    previousArrow.className = 'previous-arrow';
    previousArrow.innerHTML = '&larr;';
    previousArrow.addEventListener('click', function () {
        task.remove();
        createTask(taskText, phases[currentPhaseIndex - 1].id);
        saveTasks();
    });

    const nextArrow = document.createElement('button');
    nextArrow.className = 'next-arrow';
    nextArrow.innerHTML = '&rarr;';
    nextArrow.addEventListener('click', function () {
        task.remove();
        createTask(taskText, phases[currentPhaseIndex + 1].id);
        saveTasks();
    });

    if (!isReload) {
        if (currentPhaseIndex > 0) {
            task.appendChild(previousArrow);
        }

        if (currentPhaseIndex < phases.length - 1) {
            task.appendChild(nextArrow);
        }
    } else {
        // Ausblenden der Pfeile beim Reload
        previousArrow.style.display = currentPhaseIndex === 0 ? 'none' : '';
        nextArrow.style.display = currentPhaseIndex === phases.length - 1 ? 'none' : '';

        task.appendChild(previousArrow);
        task.appendChild(nextArrow);
    }

    document.getElementById(listId).appendChild(task);
    saveTasks();
}

document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const taskText = document.getElementById('task-input').value;
    createTask(taskText, 'open-task-list');
    document.getElementById('task-input').value = '';
});

document.addEventListener('DOMContentLoaded', loadTasks);

function saveTasks() {
    const openTasks = Array.from(document.getElementById('open-task-list').children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        phaseId: 'open-task-list'
    }));
    const inProgressTasks = Array.from(document.getElementById('in-progress-task-list').children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        phaseId: 'in-progress-task-list'
    }));
    const completedTasks = Array.from(document.getElementById('completed-task-list').children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        phaseId: 'completed-task-list'
    }));

    localStorage.setItem('todoriTasks', JSON.stringify([...openTasks, ...inProgressTasks, ...completedTasks]));
}

function createStoredTasks(taskText, listId) {
    const currentPhaseIndex = phases.findIndex((phase) => phase.id === listId);
    const task = document.createElement('li');
    task.className = 'task';

    const previousArrow = document.createElement('span');
    previousArrow.className = 'prev-arrow';
    previousArrow.innerHTML = '←';
    if (currentPhaseIndex > 0) {
        task.appendChild(previousArrow);
    }

    const taskTextNode = document.createElement('span');
    taskTextNode.className = 'task-text';
    taskTextNode.textContent = taskText;
    task.appendChild(taskTextNode);

    const nextArrow = document.createElement('span');
    nextArrow.className = 'next-arrow';
    nextArrow.innerHTML = '→';
    if (currentPhaseIndex < phases.length - 1) {
        task.appendChild(nextArrow);
    }

    nextArrow.addEventListener('click', function () {
        task.remove();
        createTask(taskText, phases[currentPhaseIndex + 1].id);
        saveTasks();
    });

    document.getElementById(listId).appendChild(task);
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todoriTasks')) || [];
    tasks.forEach(task => createStoredTasks(task.text, task.phaseId));
}

function moveTask(taskElement, targetListId) {
    const targetList = document.getElementById(targetListId);
    targetList.appendChild(taskElement);
    saveTasks();
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    createTask(taskText, 'open-task-list');
    taskInput.value = '';
    saveTasks();
});

const darkModeButton = document.getElementById('toggle-dark-mode');
darkModeButton.addEventListener('click', function () {
    const body = document.body;
    body.classList.toggle('dark-mode');
});

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    button.classList.toggle('dark-mode');
});

const previousArrows = document.querySelectorAll('.prev-arrow');
const nextArrows = document.querySelectorAll('.next-arrow');

previousArrows.forEach((arrow) => {
    arrow.addEventListener('click', function () {
        const taskElement = arrow.parentNode;
        const listId = taskElement.parentNode.getAttribute('id');
        const currentPhaseIndex = phases.findIndex((phase) => phase.id === listId);

        taskElement.remove();
        createTask(taskElement.firstChild.textContent, phases[currentPhaseIndex - 1].id);
        saveTasks();
    });
});

nextArrows.forEach((arrow) => {
    arrow.addEventListener('click', function () {
        const taskElement = arrow.parentNode;
        const listId = taskElement.parentNode.getAttribute('id');
        const currentPhaseIndex = phases.findIndex((phase) => phase.id === listId);
        taskElement.remove();
        createTask(taskElement.firstChild.textContent, phases[currentPhaseIndex + 1].id);
        saveTasks();
    });
});

const deleteAllButton = document.getElementById('delete-all-tasks');
deleteAllButton.addEventListener('click', function () {
    const openTaskList = document.getElementById('open-task-list');
    const inProgressTaskList = document.getElementById('in-progress-task-list');
    const completedTaskList = document.getElementById('completed-task-list');

// Schleife über alle Aufgaben-Elemente und entferne sie
    while (openTaskList.firstChild) {
        openTaskList.removeChild(openTaskList.firstChild);
    }
    while (inProgressTaskList.firstChild) {
        inProgressTaskList.removeChild(inProgressTaskList.firstChild);
    }
    while (completedTaskList.firstChild) {
        completedTaskList.removeChild(completedTaskList.firstChild);
    }

// Löschen aller Aufgaben aus dem Local Storage
    localStorage.removeItem('todoriTasks');

});
