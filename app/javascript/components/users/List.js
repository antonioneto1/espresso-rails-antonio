import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const Employees = ({ adminCompanyId }) => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleOpen = () => {
    setEditIndex(null);
    setName('');
    setEmail('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (name && email) {
      const newEmployee = {
        name,
        email,
        initials: name.split(' ').map(n => n[0]).join(''),
        role: 'employee',
        company_id: adminCompanyId
      };

      if (editIndex !== null) {
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = newEmployee;
        setEmployees(updatedEmployees);
      } else {
        setEmployees([...employees, newEmployee]);
      }
      setOpen(false);
    } else {
      alert('Nome e Email são obrigatórios');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setName(employees[index].name);
    setEmail(employees[index].email);
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
        {employees.map((employee, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{employee.initials}</Avatar>
            <ListItemText 
              primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{employee.name}</Typography>} 
              secondary={<Typography variant="body2" color="textSecondary">{employee.email}</Typography>} 
            />
            <IconButton onClick={() => handleEdit(index)}>
              <EditIcon />
            </IconButton>
          </ListItem>
        ))}
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
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
