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



const repositoryForm = document.querySelector('#repository-form');
const repositoryInput = document.querySelector('#repository-input');
const repositoryList = document.querySelector('#repository-list');
const repositoryStatus = document.querySelector('#repository-status');

if (repositoryForm && repositoryInput && repositoryList && repositoryStatus) {
    const starFormatter = new Intl.NumberFormat('pt-BR');
    let activeRequest;

    function showRepositoryStatus(message, state = '') {
        repositoryStatus.textContent = message;
        repositoryStatus.className = 'card status-message';
        repositoryStatus.classList.toggle('is-loading', state === 'loading');
        repositoryStatus.classList.toggle('is-error', state === 'error');
        repositoryStatus.hidden = false;
    }

    function createRepositoryCard(repository) {
        const card = document.createElement('li');
        const author = document.createElement('div');
        const avatar = document.createElement('img');
        const authorName = document.createElement('span');
        const title = document.createElement('h3');
        const titleLink = document.createElement('a');
        const description = document.createElement('p');
        const metadata = document.createElement('ul');
        const language = document.createElement('li');
        const stars = document.createElement('li');
        const repositoryLink = document.createElement('a');

        card.className = 'card repository-card';
        author.className = 'repository-author';
        avatar.src = repository.owner.avatar_url;
        avatar.alt = `Foto de ${repository.owner.login}`;
        avatar.width = 40;
        avatar.height = 40;
        avatar.loading = 'lazy';
        authorName.textContent = repository.owner.login;

        titleLink.href = repository.html_url;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = repository.name;

        description.className = 'repository-description';
        description.textContent = repository.description || 'Sem descrição disponível.';

        metadata.className = 'repository-meta';
        language.textContent = repository.language || 'Linguagem não informada';
        stars.textContent = `★ ${starFormatter.format(repository.stargazers_count)} estrelas`;

        repositoryLink.className = 'repository-link';
        repositoryLink.href = repository.html_url;
        repositoryLink.target = '_blank';
        repositoryLink.rel = 'noopener noreferrer';
        repositoryLink.textContent = 'Ver repositório no GitHub ↗';
        repositoryLink.setAttribute('aria-label', `Abrir ${repository.name} no GitHub em uma nova aba`);

        author.append(avatar, authorName);
        title.append(titleLink);
        metadata.append(language, stars);
        card.append(author, title, description, metadata, repositoryLink);

        return card;
    }

    function renderRepositories(repositories) {
        const fragment = document.createDocumentFragment();

        repositories.forEach((repository) => {
            fragment.append(createRepositoryCard(repository));
        });

        repositoryList.replaceChildren(fragment);
        repositoryStatus.hidden = true;
    }

    async function searchRepositories(query) {
        if (activeRequest) activeRequest.abort();

        const request = new AbortController();
        activeRequest = request;
        repositoryList.replaceChildren();
        repositoryList.setAttribute('aria-busy', 'true');
        showRepositoryStatus(`Buscando repositórios para “${query}”...`, 'loading');

        const endpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;

        try {
            const response = await fetch(endpoint, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2026-03-10'
                },
                signal: request.signal
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('O limite de buscas do GitHub foi atingido. Aguarde alguns minutos e tente novamente.');
                }

                throw new Error(`Não foi possível concluir a busca (erro ${response.status}).`);
            }

            const data = await response.json();

            if (data.items.length === 0) {
                showRepositoryStatus(`Nenhum repositório foi encontrado para “${query}”. Tente outro termo.`);
                return;
            }

            renderRepositories(data.items);
        } catch (error) {
            if (error.name !== 'AbortError') {
                showRepositoryStatus(
                    error.message || 'Não foi possível buscar os repositórios. Tente novamente.',
                    'error'
                );
            }
        } finally {
            if (activeRequest === request) {
                repositoryList.setAttribute('aria-busy', 'false');
            }
        }
    }

    repositoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = repositoryInput.value.trim();

        if (!query) {
            showRepositoryStatus('Digite uma palavra-chave antes de pesquisar.', 'error');
            repositoryInput.focus();
            return;
        }

        searchRepositories(query);
    });
}
