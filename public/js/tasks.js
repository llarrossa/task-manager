class TaskManager {
    constructor() {
        this.taskForm = $('#taskForm');
        this.taskList = $('.task-list');
        this.showTaskFormButton = $('#showTaskForm');
        this.editingTaskId = null;
        this.bindEvents();
        this.fetchTasks();
    }

    bindEvents() {
        this.showTaskFormButton.on('click', () => this.toggleTaskForm());
        this.taskForm.on('submit', (e) => this.saveTask(e));
        this.taskList.on('click', '.toggle-favorite', (e) => this.toggleFavorite(e));
        this.taskList.on('click', '.delete-task', (e) => this.deleteTask(e));
        this.taskList.on('click', '.edit-task', (e) => this.editTask(e));
    }

    toggleTaskForm() {
        $('#task-form').toggle();
    }

    async fetchTasks() {
        try {
            const response = await $.ajax({
                url: '/api/tasks',
                method: 'GET'
            });
            this.renderTasks(response);
        } catch (error) {
            console.error('Erro ao buscar as tasks', error);
        }
    }

    renderTasks(tasks) {
        const favoriteTasks = tasks.filter(task => task.is_favorite);
        const nonFavoriteTasks = tasks.filter(task => !task.is_favorite);

        $('#favorite-tasks').empty();
        $('#non-favorite-tasks').empty();

        this.renderTaskList('#favorite-tasks', favoriteTasks);
        this.renderTaskList('#non-favorite-tasks', nonFavoriteTasks);
    }

    renderTaskList(container, tasks) {
        tasks.forEach(task => {
            const favoriteClass = task.is_favorite ? 'fas' : 'far';
            const cardBackgroundColor = task.color || '#f8f9fa';
            $(container).append(`
                <div class="card mb-2" data-id="${task.id}" style="background-color: ${cardBackgroundColor};">
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-between align-items-center">
                            ${task.title}
                            <i class="${favoriteClass} fa-star toggle-favorite" data-id="${task.id}" style="cursor: pointer; color: ${task.is_favorite ? '#FFD700' : '#000'};"></i>
                        </h5>
                        <p class="card-text">${task.description || ''}</p>
                        <button class="edit-task btn btn-sm btn-primary" data-id="${task.id}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="delete-task btn btn-sm btn-danger" data-id="${task.id}">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `);
        });

        $(container).sortable({
            update: (event, ui) => {
                this.updateTaskOrder(container);
            }
        });
    }

    async updateTaskOrder(container) {
        const taskOrder = $(container).sortable('toArray', { attribute: 'data-id' });
        
        // console.log('Nova ordem enviada:', taskOrder);

        try {
            await $.ajax({
                url: '/tasks/reorder',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ taskOrder }),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            this.fetchTasks();
        } catch (error) {
            console.error('Erro ao atualizar a ordem das tasks:', error);
        }
    }

    async saveTask(event) {
        event.preventDefault();
        const formData = this.taskForm.serialize();
        const url = this.editingTaskId ? `/tasks/${this.editingTaskId}` : '/tasks';
        const method = this.editingTaskId ? 'PUT' : 'POST';

        try {
            await $.ajax({
                url: url,
                method: method,
                data: formData
            });
            this.fetchTasks();
            this.taskForm[0].reset();
            $('#task-form').hide();
            this.editingTaskId = null;
        } catch (error) {
            console.error('Erro ao salvar a task:', error);
        }
    }

    async editTask(event) {
        const taskId = $(event.currentTarget).data('id');

        try {
            const task = await $.ajax({
                url: `/tasks/${taskId}`,
                method: 'GET'
            });

            $('#taskForm input[name="title"]').val(task.title);
            $('#taskForm textarea[name="description"]').val(task.description);
            $('#taskForm input[name="color"]').val(task.color);

            this.editingTaskId = taskId;
            $('#task-form').show();
        } catch (error) {
            console.error('Erro ao buscar os dados da task:', error);
        }
    }

    async toggleFavorite(event) {
        console.log("asdasdkhadsa");
        const starIcon = $(event.currentTarget);
        const taskId = starIcon.data('id');
        const isFavorite = starIcon.hasClass('fas');
        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        try {
            await $.ajax({
                url: `/tasks/${taskId}`,
                method: 'PATCH',
                contentType: 'application/json',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                data: JSON.stringify({ is_favorite: !isFavorite })
            });
            this.fetchTasks();
        } catch (error) {
            console.error('Erro ao favoritar ou desfavoritar a task:', error);
        }
    }

    async deleteTask(event) {
        const taskId = $(event.currentTarget).data('id');
        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        try {
            await $.ajax({
                url: `/tasks/${taskId}`,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            this.fetchTasks();
        } catch (error) {
            console.error('Erro ao deletar a task:', error);
        }
    }
}

$(document).ready(() => {
    new TaskManager();
});
