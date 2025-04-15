import React from 'react';
import { X, Calendar, CheckSquare, Square } from 'lucide-react';

interface Todo {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Todo;
  onUpdate: (updatedTask: Todo) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskDetailModal({ isOpen, onClose, task, onUpdate, onDelete }: TaskDetailModalProps) {
  if (!isOpen) return null;

  const toggleComplete = () => {
    const newState = task.state === 'Completed' ? 'To Do' : 'Completed';
    const updatedTask = {
      ...task,
      state: newState,
      completedDate: newState === 'Completed' ? new Date().toISOString() : undefined
    };
    onUpdate(updatedTask);
  };

function determineStatus (state: string) {
  let stateCurrent: string = "";
  if (state == 'To Do'){
    stateCurrent = 'Por hacer';
  }else if(state == 'In Progress'){
    stateCurrent = 'En proceso';
  }else if(state == 'Completed'){
    stateCurrent = 'Completado';
  }
   return stateCurrent;
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button onClick={toggleComplete} className="text-gray-400 hover:text-white">
              {task.state === 'Completed' ? <CheckSquare size={24} /> : <Square size={24} />}
            </button>
            <h2 className={`text-xl font-semibold ${task.state === 'Completed' ? 'line-through text-gray-500' : ''}`}>
              {task.name}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Descripcion</label>
            <p className="text-gray-300">{task.description || 'No tiene descripcion'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <p className="text-gray-300">{determineStatus(task.state)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de vencimiento</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <p className="text-gray-300">{task.dueDate || 'No tiene fecha de vencimiento'}</p>
            </div>
          </div>

          {task.completedDate && (
            <div>
              <label className="block text-sm font-medium mb-1">Tarea completada</label>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                <p className="text-gray-300">{new Date(task.completedDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}