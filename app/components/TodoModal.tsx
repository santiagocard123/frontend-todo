import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

interface Todo {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id'>) => void;
  initialData?: Todo;
  toggleTodoState: (task: Todo) => void;
}

export default function TodoModal({ isOpen, onClose, onSave, initialData}: TodoModalProps) {
  const [todo, setTodo] = useState<Omit<Todo, 'id'>>({
    listId: '',
    name: '',
    description: '',
    state: 'To Do',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setTodo(initialData);
    } else {
      setTodo({
        listId: '',
        name: '',
        description: '',
        state: 'To Do',
        dueDate: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    const updatedTodo = { ...todo };
    if (updatedTodo.state === 'Completed' && (!initialData || initialData.state !== 'Completed')) {
      updatedTodo.completedDate = new Date().toISOString();
    } else if (updatedTodo.state !== 'Completed') {
      updatedTodo.completedDate = undefined;
    }
    onSave(updatedTodo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={todo.name}
              onChange={(e) => setTodo({ ...todo, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Nombre de la tarea"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripcion
            </label>
            <textarea
              value={todo.description}
              onChange={(e) => setTodo({ ...todo, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              placeholder="Descripcion de la tarea"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={todo.state}
              onChange={(e) => setTodo({ ...todo, state: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="To Do">Por hacer</option>
              <option value="In Progress">En proceso</option>
              <option value="Completed">Completado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de vencimiento
            </label>
            <div className="relative">
              <input
                type="date"
                value={todo.dueDate}
                onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            {initialData ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}