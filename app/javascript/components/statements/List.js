import React, { useCallback, useMemo } from "react";
import CustomTable from "../CustomTable";
import { Button, TableCell } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const List = ({ statements, columns, user, handleArchive, handleAttach, handleSetCategory }) => {
  const adminActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button onClick={() => handleArchive(row.id)} size="small" variant="outlined">
        Arquivar
      </Button>
    </TableCell>
  ), [handleArchive]);

  const employeeActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUpload />}
        size="small"
      >
        Upload file
        <input type="file" onChange={(e) => handleAttach(e, row.id)} hidden />
      </Button>
      <Button
        role={undefined}
        variant="contained"
        tabIndex={-1}
        size="small"
        onClick={() => handleSetCategory(row.id)}
      >
        Categorizar
      </Button>
    </TableCell>
  ), [handleAttach, handleSetCategory]);

  const columnsWithActions = useMemo(() => columns.concat({
    id: 'actions',
    label: 'Ações',
    content: user.role === 'admin' ? adminActions : employeeActions
  }), [columns, user.role, adminActions, employeeActions]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <CustomTable columns={columnsWithActions} rows={statements} />
    </div>
  );
};

export default List;
