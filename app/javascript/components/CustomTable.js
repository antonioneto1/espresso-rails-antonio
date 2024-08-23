import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useMemo } from 'react';

const CustomTable = ({ title, columns, rows }) => {
  const renderHeaders = useMemo(() => (
    columns.map((column) => (
      <TableCell
        key={column.id}
        align={column.align || 'left'}
        sx={{ minWidth: column.minWidth || 100 }}
      >
        {column.label}
      </TableCell>
    ))
  ), [columns]);

  const renderDefaultCell = (column, row) => {
    const value = row[column.id]?.toString() || '';
    return (
      <TableCell key={column.id} align={column.align || 'left'}>
        {column.mask ? value.replace(column.format, column.mask) : value}
      </TableCell>
    );
  };

  const renderRows = useMemo(() => (
    rows.map((row) => (
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id || row.transaction_id || row.key}>
        {
          columns.map((column) => (
            (column.content && column.content(column, row)) || renderDefaultCell(column, row)
          ))
        }
      </TableRow>
    ))
  ), [rows, columns]);

  return (
    <>
      <h2>{title}</h2>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {renderHeaders}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderRows}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default CustomTable;
