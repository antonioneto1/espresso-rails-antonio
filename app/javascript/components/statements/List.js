import React, { useCallback, useMemo, useState } from "react";
import CustomTable from "../CustomTable";
import {
  Button, TableCell, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem,
  Select, InputLabel, FormControl, Typography, Box, TableRow, TablePagination
} from "@mui/material";
import { Edit, Visibility, Archive, Unarchive } from "@mui/icons-material";

const List = ({ statements, columns, user, handleArchive, handleUnarchive, handleEdit, categories }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleArchiveConfirmation = (row) => {
    setSelectedStatement(row);
    setOpenConfirmDialog(true);
  };

  const confirmArchive = () => {
    if (selectedStatement) {
      handleArchive(selectedStatement.id);
    }
    setOpenConfirmDialog(false);
    setSelectedStatement(null);
  };

  const adminActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      {row.archived ? (
        <IconButton onClick={() => handleUnarchive(row.id)} size="small" color="primary">
          <Unarchive />
        </IconButton>
      ) : (
        <IconButton onClick={() => handleArchiveConfirmation(row)} size="small" color="primary">
          <Archive />
        </IconButton>
      )}
      {row.invoice_url ? (
        <IconButton onClick={() => window.open(row.invoice_url, '_blank')} size="small" color="primary">
          <Visibility />
        </IconButton>
      ) : null}
    </TableCell>
  ), [handleArchiveConfirmation, handleUnarchive]);

  const employeeActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      {row.invoice_url ? (
        <IconButton onClick={() => window.open(row.invoice_url, '_blank')} size="small" color="primary">
          <Visibility />
        </IconButton>
      ) : null}
      <IconButton onClick={() => handleOpenDialog(row)} size="small">
        <Edit />
      </IconButton>
    </TableCell>
  ), [handleArchiveConfirmation, handleOpenDialog]);

  const columnsWithActions = useMemo(() => columns.concat([
    { id: 'employee', label: 'Funcionário' },
    { id: 'category_id', label: 'Categoria' },
    {
      id: 'actions',
      label: '',
      content: user.role === 'admin' ? adminActions : employeeActions
    }
  ]), [columns, user.role, adminActions, employeeActions]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStatements = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return statements.slice(start, end);
  }, [statements, page, rowsPerPage]);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <CustomTable 
        columns={columnsWithActions} 
        rows={paginatedStatements} 
        renderRow={(row) => (
          <TableRow
            key={row.id}
            sx={{
              backgroundColor: row.invoice_url ? '#d4edda' : '#f8f9fa'
            }}
          >
            {columnsWithActions.map((column) => (
              <TableCell key={column.id}>
                {column.content ? column.content(row) : row[column.id]}
              </TableCell>
            ))}
          </TableRow>
        )}
      />
      <TablePagination
        component="div"
        count={statements.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />

      {/* Dialog de Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedStatement ? 'Editar Despesa' : 'Novo Registro'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
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
                <Typography variant="body1">{categories.find(cat => cat.id === selected)?.name || 'Selecionar Categoria'}</Typography>
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
            sx={{ mt: 2 }}
          >
            Upload Comprovante
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Arquivar despesa</DialogTitle>
        <DialogContent>
          <Typography>
            Ao arquivar a despesa ela será movida para a aba "Arquivadas".
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmArchive} color="primary" variant="contained">
            Arquivar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default List;
