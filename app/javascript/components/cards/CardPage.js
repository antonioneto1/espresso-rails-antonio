import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Avatar, TextField, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const CardPage = ({ adminCompanyId }) => {
  const [cards, setCards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastDigits, setLastDigits] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const token = document.querySelector('meta[name="csrf-token"]').content;

  useEffect(() => {
    fetchCards();
    fetchEmployees();
  }, [adminCompanyId]);

  const fetchCards = async () => {
    try {
      const response = await fetch(`/companies/${adminCompanyId}/cards`);
      const data = await response.json();
      setCards(data.cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/companies/${adminCompanyId}/users`);
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleOpen = () => {
    setEditIndex(null);
    setLastDigits('');
    setSelectedEmployee('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!lastDigits || !selectedEmployee) {
      alert('Todos os campos são obrigatórios');
      return;
    }
  
    try {
      const response = await fetch(`/companies/${adminCompanyId}/cards`, {
        method: editIndex !== null ? 'PATCH' : 'POST',
        headers: {
          "X-CSRF-Token": token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card: {
            last4: lastDigits,
            user_id: selectedEmployee,
          },
        }),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        fetchCards();
        handleClose();
      } else {
        alert(json.errors);
      }
    } catch (error) {
      console.error('Error submitting card:', error);
    }
  };  

  const handleEdit = (index) => {
    const card = cards[index];
    setEditIndex(index);
    setLastDigits(card.last4);
    setSelectedEmployee(card.employee_id);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
      <Typography variant="h4">Cartões</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={handleOpen}
        sx={{ position: 'absolute', right: 16, top: 16 }}
      >
        Cadastrar Cartão
      </Button>
      
      {cards.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          Até o momento, não há cartões cadastrados.
          <br />
          <hr style={{ border: '1px solid #e0e0e0', margin: '8px 0', width: '80%' }} />
        </Typography>
      ) : (
        <List>
          {cards.map((card, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {employees.find(emp => emp.id === card.employee_id)?.name[0] || 'N'}
              </Avatar>
              <ListItemText 
                primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{card.name || 'Desconhecido'}</Typography>} 
                secondary={<Typography variant="body2" color="textSecondary">**** **** **** {card.last4}</Typography>} 
              />
              <IconButton onClick={() => handleEdit(index)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editIndex !== null ? 'Editar Cartão' : 'Cadastrar Cartão'}
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
            label="Últimos 4 dígitos"
            type="text"
            fullWidth
            variant="outlined"
            value={lastDigits}
            onChange={(e) => setLastDigits(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Funcionário</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Funcionário"
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default CardPage;
