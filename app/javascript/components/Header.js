import React, { useCallback, useMemo } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

const Header = (props) => {
  const { user, company } = props
  const token = document.querySelector('meta[name="csrf-token"]').content

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`/users/sign_out`,{
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token
        }
      })

      if(response.status === 204) {
        window.location.reload()
      }
    }
    catch(error) {
      console.error(error)
    }
  }, [token])

  const renderLogout = useMemo(() => (
    <Toolbar>
      <Typography>{user.name}</Typography>
      <Button onClick={handleLogout} color="info" variant="contained" size="small">Logout</Button>
    </Toolbar>
  ), [user, handleLogout])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Espresso - { company.name }
          </Typography>
          <Button variant='contained' color='info' size='small' onClick={() => window.location.href = `/companies/${user.company_id}/statements`}>Despesas</Button>
          <Button variant='contained' color='info' size='small' onClick={() => window.location.href = `/users/new`}>Novo Usuário</Button>
          <Button variant='contained' color='info' size='small' onClick={() => window.location.href = `/companies/new`}>Nova Empresa</Button>
          <Button variant='contained' color='info' size='small' onClick={() => window.location.href = `/users/${user.id}/cards/new`}>Novo Cartão</Button>
          { renderLogout }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header