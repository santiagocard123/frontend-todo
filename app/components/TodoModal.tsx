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
  selectedListId: string; 
}

export default function TodoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  selectedListId 
}: TodoModalProps) {
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
        listId: selectedListId, 
        name: '',
        description: '',
        state: 'To Do',
        dueDate: '',
      });
    }
  }, [initialData, selectedListId, isOpen]);

  const handleSave = () => {
    const updatedTodo = { ...todo, listId: selectedListId };

    if (
      updatedTodo.state === 'Completed' &&
      (!initialData || initialData.state !== 'Completed')
    ) {
      updatedTodo.completedDate = new Date().toISOString();
    }

    onSave(updatedTodo);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{initialData ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la tarea"
              value={todo.name}
              onChange={(e) => setTodo({ ...todo, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Descripción"
              value={todo.description}
              onChange={(e) => setTodo({ ...todo, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={todo.dueDate}
                onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })}
                className="border rounded p-1"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
              Cancelar
            </button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
  );
}
