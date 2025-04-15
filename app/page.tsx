
"use client";

import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from '@/app/components/Sidebar';
import Main from '@/app/components/Main';
import { getTodoLists, loginUser, registerUser, createTask, updateTask, deleteTask } from '@/app/api/api';
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string;
  nameUser: string;
  email: string;
  todoLists: string[];
}

type TodoList = {
  id: string;
  name: string;
  description: string;
  tasks: Todo[];
}

interface Todo {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodoLists();
    }
  }, [user]);

const fetchTodoLists = async () => {
    if (user) {
      try {
        const lists = await getTodoLists(user.id);
        setTodoLists(lists);
      } catch (error) {
        console.error('Error al obtener las listas de tareas:', error);
      }
    }
};

const handleLogin = async (email: string, password: string) => {
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('error de inicio de sesion:', error);
      setError('Error al iniciar sesión. Verifique sus credenciales y vuelva a intentarlo.');
    }
};

const handleRegister = async (nameUser: string, email: string, password: string) => {
    try {
      const newUser = await registerUser(nameUser, email, password);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error en el registro:', error);
      setError('Error en el registro. Inténtalo de nuevo.');
    }
};

const handleLogout = () => {
    setUser(null);
    setTodoLists([]);
    setSelectedList(null);
    localStorage.removeItem('user');
};


// Funciones de tareas 

const handleCreateTask = async (taskData: Omit<Todo, 'id' | 'listId'>) => {
    if (user && selectedList) {
      try {
        const newTask: Todo = {
          id: uuidv4(),
          ...taskData,
          listId: selectedList.id
        };
        
        await createTask(user.id, selectedList.id, newTask);
        
        const updatedLists = todoLists.map(list =>
          list.id === selectedList.id
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        );
  
        setTodoLists(updatedLists);
        setSelectedList(updatedLists.find(list => list.id === selectedList.id) || null);
      } catch (error) {
        console.error('Error creando la tarea:', error);
      }
    }
};
  
const handleUpdateTask = async (taskId: string, updates: Partial<Todo>) => {
    if (user && selectedList) {
      try {
        const updatedTaskData: Todo = {
          id: taskId,
          listId: selectedList.id,
          name: updates.name || '',
          description: updates.description || '',
          state: updates.state || '',
          dueDate: updates.dueDate || '',
          completedDate: updates.completedDate || ''
  
        };
  
        await updateTask(user.id, selectedList.id, taskId, updatedTaskData);
  
        const updatedLists = todoLists.map(list =>
          list.id === selectedList.id
            ? {
                ...list,
                tasks: list.tasks.map(task =>
                  task.id === taskId ? updatedTaskData : task
                )
              }
            : list
        );
  
        setTodoLists(updatedLists);
        setSelectedList(updatedLists.find(list => list.id === selectedList.id) || null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
};

const handleDeleteTask = async (taskId: string) => {
  if (user && selectedList) {
    try {
      await deleteTask(user.id, selectedList.id, taskId);
      
      const updatedLists = todoLists.map(list =>
        list.id === selectedList.id
          ? {
              ...list,
              tasks: list.tasks.filter(task => task.id !== taskId)
            }
          : list
      );
      
      setTodoLists(updatedLists);
      setSelectedList(updatedLists.find(list => list.id === selectedList.id) || null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
};




  if (!user) {
    return isRegistering ? (
      <div className='h-screen bg-black bg-opacity-10 pt-24'>
        <Register onRegister={handleRegister} switchToLogin={() => setIsRegistering(false)} error={error} />
      </div>
    ) : (
      <div className='h-screen bg-black bg-opacity-10 pt-40'>
          <Login onLogin={handleLogin} switchToRegister={() => setIsRegistering(true)} error={error} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <div className='w-64'>
      <Sidebar
        user={user}
        handleLogout={handleLogout}
        todoLists={todoLists}
        onSelectList={setSelectedList}
        selectedList={selectedList}
        fetchTodoLists={fetchTodoLists}
      />
      </div>
      <main className="h-full w-full ml-10">
        <Main
          selectedList={selectedList}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  );
}
