<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::orderBy('is_favorite', 'desc')->orderBy('order', 'asc')->get();

        // return Task::orderBy('is_favorite', 'desc')->orderBy('created_at', 'desc')->get();
        return view('tasks.index', ['tasks' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_favorite' => 'boolean',
            'color'       => 'nullable|string|max:7',
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return $task;
    }

   public function update(Request $request, Task $task)
   {
       $validated = $request->validate([
           'title'       => 'required|string|max:255',
           'description' => 'nullable|string',
           'is_favorite' => 'boolean',
           'color'       => 'nullable|string|max:7',
       ]);

       $task->update($validated);

       return response()->json($task, 200);
   }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }

    public function toggleFavorite(Request $request, $id)
    {
       $task = Task::findOrFail($id);

       $task->is_favorite = $request->input('is_favorite');
       $task->save();

       return response()->json(['success' => true, 'task' => $task]);
    }

    public function reorder(Request $request) {
        $taskOrder = $request->input('taskOrder');
        
        // \Log::info($taskOrder);

        foreach ($taskOrder as $index => $taskId) {
            Task::where('id', $taskId)->update(['order' => $index]);
        }

        return response()->json(['status' => 'success']);
    }
}
