import React, { useCallback, useMemo } from "react";
import CustomTable from "../CustomTable";
import { Button, TableCell } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const List = (props) => {
  const token = document.querySelector('meta[name="csrf-token"]').content
  const { user, open_statements, completed_statements } = props

  const handleArchive = useCallback(async (event) => {
    try {
      const response = await fetch(`/statements/${event.target.id}`,{
         method: "PATCH",
         headers: {
           "X-CSRF-Token": token,
           "Content-Type": "application/json"
         },
         body: JSON.stringify({ statement: { archived: true } })
       })
       const json = await response.json()

       if(response.status === 200) {
         alert(json.message)
       }
       else {
         alert(json.errors)
       }
     }
     catch(error) {
       console.error(error)
     }
  }, [])

  const adminActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button onClick={handleArchive} id={row.id} size="small" variant="outlined">
        Arquivar
      </Button>
    </TableCell>
  ), [])

  const handleAttach = useCallback(async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/statements/${event.target.id}/attach_invoice.json`,{
      method: "PATCH",
      headers: {
        "X-CSRF-Token": token
      },
      body: formData
    })

    if(response.status == 200){
      alert('Anexado com sucesso')
      window.location.reload()
    } else {
      alert('Tente novamente mais tarde')
    }
  }, [])

  const handleSetCategory = useCallback((event) => {
    window.location.href = `/statements/${event.target.id}/edit`
  }, [])

  const employeeActions = useCallback((column, row) => (
    <TableCell key={column.id}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUpload/>}
        size="small"
      >
        Upload file
        <input type="file" onChange={handleAttach} id={row.id} hidden/>
      </Button>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        id={row.id}
        size="small"
        onClick={handleSetCategory}
      >
        Categorizar
      </Button>
    </TableCell>
  ), [])

  const open_columns = useMemo(() => [
    { id: 'id', label: 'ID' },
    { id: 'merchant', label: 'Empresa' },
    { id: 'cost', label: 'Custo', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Gasto em' },
    { id: 'transaction_id', label: 'Transacao' },
    { id: 'actions', content: user.role === 'admin' ? adminActions : employeeActions }
  ], [])

  const completed_columns = useMemo(() => [
    { id: 'id', label: 'ID' },
    { id: 'merchant', label: 'Empresa' },
    { id: 'cost', label: 'Custo', format: /^(.*)(\d{2})$/, mask: "R$ $1,$2" },
    { id: 'performed_at', label: 'Gasto em' },
    { id: 'transaction_id', label: 'Transacao' }
  ], [])

  return(
    <React.Fragment>
      <CustomTable title='Despesas Abertas' columns={open_columns} rows={open_statements}/>
      <CustomTable title='Despesas Fechadas' columns={completed_columns} rows={completed_statements}/>
    </React.Fragment>
  )
}

export default List