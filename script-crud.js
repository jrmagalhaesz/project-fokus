const btnAddTask = document.querySelector('.app__button--add-task');
const formAddTask = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTasks = document.querySelector('.app__section-task-list');
const paragrafoDescricao = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskSelecionada = null;
let liTaskSelecionada = null;

function atualizarTask () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

function addTask(task) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = task.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const newTask = prompt("Qual é o novo nome da task?");
        if (newTask) {
            paragrafo.textContent = newTask;
            task.descricao = newTask;
            atualizarTask();
        }; 
    };

    const imagemBtn = document.createElement('img');

    imagemBtn.setAttribute('src', '/imagens/edit.png');

    botao.append(imagemBtn);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (task.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
    
            if (taskSelecionada == task) {
                paragrafoDescricao.textContent = '';	
                taskSelecionada = null;
                liTaskSelecionada = null;
                return;
            }; 
    
            taskSelecionada = task;
            liTaskSelecionada = li;
            paragrafoDescricao.textContent = task.descricao;
            
            li.classList.add('app__section-task-list-item-active');
        };
    }

    return li;
};

btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden');
});

formAddTask.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const task = {
        descricao: textarea.value
    }

    tasks.push(task);
    const elementoTask = addTask(task);
    ulTasks.append(elementoTask);

    atualizarTask();

    textarea.value = '';

    formAddTask.classList.add('hidden');
});

tasks.forEach(task => {
    const elementoTask = addTask(task);
    ulTasks.append(elementoTask);
});

document.addEventListener('FocoFinalizado', () => {
    if (taskSelecionada && liTaskSelecionada) {
        liTaskSelecionada.classList.remove('app__section-task-list-item-active');
        liTaskSelecionada.classList.add('app__section-task-list-item-complete');
        liTaskSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        taskSelecionada.completa = true;
        atualizarTask();
    }
});

const removerTasks = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    tasks = somenteCompletas ? tasks.filter(task => !task.completa) : []
    atualizarTask();
}

btnRemoverConcluidas.onclick = () => removerTasks(true);
btnRemoverTodas.onclick = () => removerTasks(false);