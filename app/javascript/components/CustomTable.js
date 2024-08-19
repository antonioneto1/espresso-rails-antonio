import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useMemo } from 'react';

const CustomTable = (props) => {
  const { title, columns, rows } = props

  const renderHeaders = useMemo(() => (
    columns.map((column) => (
      <TableCell
        key={column.id}
        align={column.align}
        style={{ minWidth: column.minWidth }}
      >
        {column.label}
      </TableCell>
    ))
  ), [])

  const renderDefaultCell = (column, row) => {
    var value = row[column.id]?.toString()
    return (
      <TableCell key={column.id} align={column.align}>
        { column.mask ? value.replace(column.format, column.mask) : value }
      </TableCell>
    )
  }

  const renderRows = useMemo(() => (
    rows.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
          {
            columns.map((column) => {
              return (column.content && column.content(column, row)) || renderDefaultCell(column, row)
            })
          }
        </TableRow>
    ))
  ), [rows, columns, renderDefaultCell])

  return(
    <React.Fragment>
      <h2>{ title }</h2>
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
    </React.Fragment>
  )
}

export default CustomTable