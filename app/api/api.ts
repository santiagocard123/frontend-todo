import axios from 'axios';

type TodoList = {
  id: string;
  name: string;
  description: string;
  tasks: Todo[];
};

type Todo = {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

interface Task {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
}

const api = axios.create({
  baseURL: 'https://backend-todo-production-56bf.up.railway.app//api',
  headers: {
    'Content-Type': 'application/json',
  },
});

//USER

export const registerUser = async (nameUser: string, email: string, password: string) => {
  const response = await api.post('/users/register', { nameUser, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

//TodoList

export const getTodoLists = async (userId: string) => {
  const response = await api.get(`/todolists/user/${userId}`);
  return response.data;
};

export const createTodoList = async (userId: string, name: string, description: string) => {
  const response = await api.post(`/todolists/${userId}`, { name, description });
  return response.data;
};

export const updateTodoList = async (listId: string, updatedList: TodoList): Promise<TodoList> => {
  const response = await fetch(`https://backend-todo-production-56bf.up.railway.app//api/todolists/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedList),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo list');
  }

  return response.json();
}; 

export const getTodoListById = async (listId: string) => {
  const response = await api.get(`/todolists/${listId}`);
  return response.data;
};

export const deleteTodoList = async (listId: string) => {
  await api.delete(`/todolists/${listId}`);
};

//Task

export const createTask = async (userId: string, listId: string, taskData: Task) => {
  const response = await api.post(
    `/todolists/${listId}/tasks`,
    taskData,
    { params: { userId } }
  );
  return response.data;
};

export const updateTask = async (userId: string, listId: string, taskId: string, taskData: Task) => {
  const response = await api.put(
    `/todolists/${listId}/tasks/${taskId}`,
    taskData,
    { params: { userId } }
  );
  return response.data;
};

export const deleteTask = async (userId: string, listId: string, taskId: string) => {
  const response = await api.delete(`/todolists/${listId}/tasks/${taskId}`, {
    params: { userId }
  });
  return response.data;
};

export default api;

