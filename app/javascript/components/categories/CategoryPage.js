import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List as MUIList, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const CategoryPage = ({ adminCompanyId }) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/companies/${adminCompanyId}/categories`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = () => {
    setEditIndex(null);
    setCategoryName('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/companies/${adminCompanyId}/categories`, {
        method: editIndex !== null ? 'PATCH' : 'POST',
        headers: {
          "X-CSRF-Token": token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: { name: categoryName, company_id: adminCompanyId } }),
      });

      const json = await response.json();

      if (response.ok) {
        alert(json.message);
        fetchCategories();
        handleClose();
      } else {
        alert(json.errors);
      }
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const handleEdit = (index) => {
    const category = categories[index];
    setEditIndex(index);
    setCategoryName(category.name);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4">Categorias</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        onClick={handleOpen}
        sx={{ position: 'absolute', right: 16, top: 16 }}
      >
        Adicionar Nova Categoria
      </Button>
      
      {categories.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          Até o momento, não há categorias cadastradas.
          <br />
          <hr style={{ border: '1px solid #e0e0e0', margin: '8px 0', width: '80%' }} />
        </Typography>
      ) : (
        <MUIList>
          {categories.map((category, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <ListItemText 
                primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{category.name}</Typography>} 
              />
              <IconButton onClick={() => handleEdit(index)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </MUIList>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editIndex !== null ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
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
            label="Nome da Categoria"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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

export default CategoryPage;
