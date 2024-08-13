@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-md-8 mx-auto">
        <h1 class="mb-4">Task Manager</h1>
        <div class="mb-3">
            <button class="btn btn-primary" id="showTaskForm"><i class="fa-solid fa-plus"></i> New Task</button>
        </div>
        <div id="task-form" style="display: none;">
            <form id="taskForm">
                @csrf
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" name="title" required>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" name="description"></textarea>
                </div>
                <div class="mb-3">
                    <label for="color" class="form-label">Color</label>
                    <input type="color" class="form-control" id="color" name="color">
                </div>
                <button type="submit" class="btn btn-success mb-3">Save Task</button>
            </form>
        </div>
        <!-- <div id="task-list"></div> -->
        <div id="favorite-tasks" class="task-list"></div>
        <div id="non-favorite-tasks" class="task-list"></div>
    </div>
</div>
@endsection