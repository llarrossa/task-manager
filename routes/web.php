<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TaskController;
use App\Models\Task;

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::post('/tasks/reorder', [TaskController::class, 'reorder']);
Route::get('/tasks/{task}', [TaskController::class, 'show']);
Route::put('/tasks/{task}', [TaskController::class, 'update']);
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
Route::patch('/tasks/{task}', [TaskController::class, 'toggleFavorite']);

Route::get('/api/tasks', function () {
    $tasks = Task::orderBy('is_favorite', 'desc')
                 ->orderBy('order', 'asc')
                 ->get();

    return response()->json($tasks);
});