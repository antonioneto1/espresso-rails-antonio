import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const Employees = ({ adminCompanyId }) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [adminCompanyId]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await fetch(`/companies/${adminCompanyId}/users`);
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, [adminCompanyId]);

  const handleOpen = () => {
    setEditIndex(null);
    setName('');
    setEmail('');
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (name && email) {
      const newEmployee = {
        name,
        email,
        company_id: adminCompanyId,
        role: 'employee',
      };

      try {
        const response = await fetch(`/companies/${adminCompanyId}/users${editIndex !== null ? `/${employees[editIndex].id}` : ''}`, {
          method: editIndex !== null ? 'PATCH' : 'POST',
          headers: {
            "X-CSRF-Token": token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employee: newEmployee }),
        });

        const json = await response.json();

        if (response.ok) {
          fetchEmployees();
          handleClose();
        } else {
          setError(json.errors);
        }
      } catch (error) {
        console.error('Error submitting employee:', error);
        setError('Ocorreu um erro ao salvar o funcionário.');
      }
    } else {
      setError('Nome e Email são obrigatórios');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setName(employees[index].name);
    setEmail(employees[index].email);
    setError('');
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
      <Typography variant="h4">Funcionários</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={handleOpen}
        sx={{ position: 'absolute', right: 16, top: 16 }}
      >
        Cadastrar Novo Funcionário
      </Button>
      <List>
        {employees.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            Até o momento, não há funcionários cadastrados.
            <br />
            <hr style={{ border: '1px solid #e0e0e0', margin: '8px 0', width: '80%' }} />
          </Typography>
        ) : (
          employees.map((employee, index) => (
            <ListItem key={employee.id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{employee.name.split(' ').map(n => n[0]).join('')}</Avatar>
              <ListItemText 
                primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{employee.name}</Typography>} 
                secondary={<Typography variant="body2" color="textSecondary">{employee.email}</Typography>} 
              />
              <IconButton onClick={() => handleEdit(index)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editIndex !== null ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={editIndex === null ? error : ''}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={editIndex === null ? error : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editIndex !== null ? 'Salvar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;
