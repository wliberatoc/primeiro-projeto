const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const todoEmpty = document.querySelector('#todo-empty');
const todoCount = document.querySelector('#todo-count');

const tasks = [];
let nextTaskId = 1;

function updateTaskSummary() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.done).length;

    todoEmpty.hidden = totalTasks > 0;

    if (totalTasks === 0) {
        todoCount.textContent = '0 tarefas';
        return;
    }

    const taskLabel = totalTasks === 1 ? 'tarefa' : 'tarefas';
    todoCount.textContent = `${completedTasks} de ${totalTasks} ${taskLabel} concluída${totalTasks === 1 ? '' : 's'}`;
}

function renderTasks() {
    todoList.replaceChildren();

    tasks.forEach((task) => {
        const listItem = document.createElement('li');
        const taskLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        const taskText = document.createElement('span');
        const deleteButton = document.createElement('button');

        listItem.className = 'todo-item';
        listItem.dataset.taskId = task.id;
        listItem.classList.toggle('checked', task.done);
        taskLabel.className = 'todo-item__label';
        checkbox.className = 'todo-item__checkbox';
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.setAttribute('aria-label', `Marcar “${task.text}” como ${task.done ? 'pendente' : 'concluída'}`);
        taskText.className = 'todo-item__text';
        taskText.textContent = task.text;
        deleteButton.className = 'todo-item__delete';
        deleteButton.type = 'button';
        deleteButton.textContent = 'Excluir';
        deleteButton.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);

        taskLabel.append(checkbox, taskText);
        listItem.append(taskLabel, deleteButton);
        todoList.append(listItem);
    });

    updateTaskSummary();
}

function addTask(taskText) {
    tasks.push({ id: String(nextTaskId), text: taskText, done: false });
    nextTaskId += 1;
    renderTasks();
}

function toggleTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (task) {
        task.done = !task.done;
        renderTasks();
    }
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex((item) => item.id === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        renderTasks();
    }
}

if (todoForm && todoInput && todoList && todoEmpty && todoCount) {
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = todoInput.value.trim();

        if (!taskText) {
            todoInput.focus();
            return;
        }

        addTask(taskText);
        todoForm.reset();
        todoInput.focus();
    });

    todoList.addEventListener('change', (event) => {
        if (!event.target.matches('.todo-item__checkbox')) return;

        const listItem = event.target.closest('.todo-item');
        toggleTask(listItem.dataset.taskId);
    });

    todoList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.todo-item__delete');
        if (!deleteButton) return;

        const listItem = deleteButton.closest('.todo-item');
        deleteTask(listItem.dataset.taskId);
    });

    renderTasks();
}
