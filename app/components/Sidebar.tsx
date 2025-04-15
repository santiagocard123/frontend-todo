import React, { useState } from 'react';
import {
  List, ListItem, ListItemText, IconButton, Avatar, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  createTodoList,
  deleteTodoList,
  updateTodoList
} from '@/app/api/api';

type Todo = {
  id: string;
  listId: string;
  name: string;
  description: string;
  state: string;
  dueDate: string;
  completedDate?: string;
};

type TodoList = {
  id: string;
  name: string;
  description: string;
  tasks: Todo[];
};

type User = {
  id: string;
  nameUser: string;
  email: string;
  todoLists: string[];
};

interface SidebarProps {
  user: User;
  handleLogout: () => void;
  todoLists: TodoList[];
  onSelectList: (list: TodoList) => void;
  selectedList: TodoList | null;
  fetchTodoLists: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  handleLogout,
  todoLists,
  onSelectList,
  selectedList,
  fetchTodoLists
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateListName, setUpdateListName] = useState('');
  const [updateListDescription, setUpdateListDescription] = useState('');
  const [listToUpdate, setListToUpdate] = useState<TodoList | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleCreateList = async () => {
    if (newListName.trim()) {
      try {
        await createTodoList(user.id, newListName, newListDescription);
        setNewListName('');
        setNewListDescription('');
        setIsCreateDialogOpen(false);
        fetchTodoLists();
      } catch (error) {
        console.error('Error creating todo list:', error);
      }
    }
  };

  const handleUpdateList = async () => {
    if (listToUpdate) {
      try {
        const updatedList: TodoList = {
          ...listToUpdate,
          name: updateListName || listToUpdate.name,
          description: updateListDescription || listToUpdate.description
        };

        const updatedListFromServer = await updateTodoList(updatedList.id, updatedList);
        setIsUpdateDialogOpen(false);
        setListToUpdate(null);
        setUpdateListName('');
        setUpdateListDescription('');
        fetchTodoLists();
        onSelectList(updatedListFromServer);
      } catch (error) {
        console.error('Error updating todo list:', error);
      }
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteTodoList(listId);
      fetchTodoLists();
    } catch (error) {
      console.error('Error deleting todo list:', error);
    }
  };

  const openUpdateDialog = (list: TodoList) => {
    setListToUpdate(list);
    setUpdateListName(list.name);
    setUpdateListDescription(list.description);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div style={{
      width: isOpen ? '250px' : '90px',
      height: '100vh',
      backgroundColor: '#111811',
      padding: '10px',
      position: 'fixed',
      transition: 'width 0.3s ease',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      top: '0',
      left: '0'
    }}>
      <div>
        <IconButton onClick={toggleSidebar} style={{ color: 'white' }}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {isOpen && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar
              alt={user.nameUser}
              src=""
              style={{ width: '80px', height: '80px', margin: '0 auto' }}
            />
            <h3 className='mt-2'>{user.nameUser}</h3>
          </div>
        )}

        <List>
          <ListItem onClick={() => setIsCreateDialogOpen(true)} component="button">
            <IconButton>
              <AddIcon style={{ color: 'white' }} />
            </IconButton>
            {isOpen && <ListItemText primary="Nueva lista" />}
          </ListItem>

          {isOpen && todoLists.length > 0 ? (
            todoLists.map((list) => (
              <ListItem
                key={list.id}
                onClick={() => onSelectList(list)}
                component="button"
                sx={{
                  backgroundColor: selectedList?.id === list.id ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                }}
              >
                <ListItemText primary={list.name} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openUpdateDialog(list);
                  }}
                >
                  <EditIcon style={{ color: 'white', fontSize: 'small' }} />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                >
                  <DeleteIcon style={{ color: 'white', fontSize: 'small' }} />
                </IconButton>
              </ListItem>
            ))
          ) : (
            isOpen && <ListItem><ListItemText primary="No hay listas disponibles" /></ListItem>
          )}
        </List>
      </div>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<LogoutIcon />}
        fullWidth={isOpen}
        onClick={handleLogout}
        style={{
          display: 'flex',
          justifyContent: isOpen ? 'flex-start' : 'center',
          alignItems: 'center',
          marginBottom: '30px'
        }}
      >
        {isOpen && 'Cerrar sesión'}
      </Button>

      {/* Dialog para crear nueva lista */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#111827', color: 'white' } }}
      >
        <DialogTitle>Crear nueva lista</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateList}>Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para actualizar lista */}
      <Dialog open={isUpdateDialogOpen} onClose={() => setIsUpdateDialogOpen(false)}>
        <DialogTitle>Actualizar lista</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nuevo nombre"
            type="text"
            fullWidth
            value={updateListName}
            onChange={(e) => setUpdateListName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nueva descripción"
            type="text"
            fullWidth
            value={updateListDescription}
            onChange={(e) => setUpdateListDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdateList}>Actualizar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
