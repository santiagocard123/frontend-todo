import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import TodoModal from './TodoModal';
import TaskDetailModal from './TaskDetailModal';

interface Todo {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

interface TodoList {
  id: string;
  name: string;
  description: string;
  tasks: Todo[];
}

interface MainProps {
  selectedList: TodoList | null;
  onCreateTask: (task: Omit<Todo, 'id'>) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export default function Main({ selectedList, onCreateTask, onUpdateTask, onDeleteTask }: MainProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [localTasks, setLocalTasks] = useState<Todo[]>([]);

  useEffect(() => {
    if (selectedList) {
      setLocalTasks(selectedList.tasks);
    }
  }, [selectedList]);

  const handleSaveTodo = async (todoData: Omit<Todo, 'id'>) => {
    if (editingTask) {
      await onUpdateTask(editingTask.id, todoData);
      setLocalTasks(prevTasks =>
        prevTasks.map(task => task.id === editingTask.id ? { ...task, ...todoData } : task)
      );
    } else {
      await onCreateTask(todoData);
      const newTask = { id: Date.now().toString(), ...todoData };
      setLocalTasks(prevTasks => [...prevTasks, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleTodoState = async (task: Todo) => {
    const newState = task.state === 'Completed' ? 'To Do' : 'Completed';
    const completedDate = newState === 'Completed' ? new Date().toISOString() : undefined;
    
    const updatedTask = { ...task, state: newState, completedDate };
    await onUpdateTask(task.id, updatedTask);
    setLocalTasks(prevTasks =>
      prevTasks.map(t => t.id === task.id ? updatedTask : t)
    );
  };

  if (!selectedList) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Selecciona una lista de tareas ;3
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4 max-w h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{selectedList.name}</h1>
        <p className="text-gray-400">{selectedList.description}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 border border-gray-600 rounded px-4 py-2 hover:bg-gray-800"
        >
          <Plus size={20} className="text-blue-400" />
          <span>Agregar Tarea</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4 text-gray-400 border-b border-gray-700 pb-2">
          <ChevronDown size={20} />
          <span className="flex-grow">Tareas ({localTasks.length})</span>
          <div className="w-32">Acciones</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded mb-4">
        {localTasks.map(task => (
          <div key={task.id} className="flex items-center gap-4 p-2 hover:bg-gray-700 border-b border-gray-700">
            <input
              type="checkbox"
              checked={task.state === 'Completed'}
              onChange={() => toggleTodoState(task)}
              className="w-5 h-5 cursor-pointer"
            />
            <span 
              className={`flex-grow cursor-pointer ${task.state === 'Completed' ? 'line-through text-gray-500' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              {task.name}
            </span>
            <div className="w-35 flex gap-2 ml-auto">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Editar
              </button>
              <button
                onClick={async () => {
                  await onDeleteTask(task.id);
                  setLocalTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isModalOpen && (
        <TodoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTodo}
          initialData={editingTask || undefined}
          toggleTodoState={toggleTodoState} 
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdate={async (updatedTask) => {
            await onUpdateTask(updatedTask.id, updatedTask);
            setLocalTasks(prevTasks =>
              prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
            );
            setSelectedTask(null);
          }}
          onDelete={async (taskId) => {
            await onDeleteTask(taskId);
            setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}