import React, { useCallback, useMemo, useState } from "react";
import CustomTable from "../CustomTable";
import { Button, TableCell, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";

const List = ({ statements, columns, user, handleArchive, handleEdit, categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleOpenDialog = (row) => {
    setSelectedStatement(row);
    setCategory(row.category_id || '');
    setFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatement(null);
    setCategory('');
    setFile(null);
  };

  const handleSaveChanges = async () => {
    if (selectedStatement) {
      if (category) {
        try {
          await handleEdit(selectedStatement.id, category, file);
          handleCloseDialog();
        } catch (error) {
          setError('Ocorreu um erro ao salvar as alterações.');
        }
      } else {
        setError('Categoria é obrigatória');
      }
    }
  };

  const adminActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button onClick={() => handleArchive(row.id)} size="small" variant="outlined">
        Arquivar
      </Button>
    </TableCell>
  ), [handleArchive]);

  const employeeActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button onClick={() => handleArchive(row.id)} size="small" variant="outlined">
        Arquivar
      </Button>
      <IconButton onClick={() => handleOpenDialog(row)} size="small">
        <Edit />
      </IconButton>
    </TableCell>
  ), [handleArchive, handleOpenDialog]);

  const columnsWithActions = useMemo(() => columns.concat([
    {
      id: 'comprovacao',
      label: 'Comprovação',
      content: (row) => row.comprovacao ? <a href={row.comprovacao} target="_blank" rel="noopener noreferrer">Visualizar</a> : 'Sem Comprovação'
    },
    {
      id: 'actions',
      label: 'Ações',
      content: user.role === 'admin' ? adminActions : employeeActions
    }
  ]), [columns, user.role, adminActions, employeeActions]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <CustomTable columns={columnsWithActions} rows={statements} />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedStatement ? 'Editar Despesa' : 'Novo Registro'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Edit />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={category || ''}
              onChange={(e) => setCategory(e.target.value)}
              error={!!error}
              renderValue={(selected) => (
                <Typography>{categories.find(cat => cat.id === selected)?.name || 'Selecionar Categoria'}</Typography>
              )}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {error && <Typography color="error">{error}</Typography>}
          </FormControl>
          <Button
            component="label"
            variant="contained"
            size="small"
            style={{ marginTop: 20 }}
          >
            Upload Comprovante
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file && <Typography>{file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default List;
