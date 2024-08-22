import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CategoryIcon from '@mui/icons-material/Category';
import Employees from './users/Employees';
import StatementPage from './statements/StatementPage';
import Cartoes from './cards/CardPage'; // Importar o componente Cartoes
import Categorias from './categories/CategoryPage'; // Importar o componente Categorias
import Home from './Home';

const Header = ({ user, company, admin }) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [selectedOption, setSelectedOption] = useState('Home'); // Ajuste inicial para Home
  const [openStatements, setOpenStatements] = useState([]);
  const [completedStatements, setCompletedStatements] = useState([]);

  useEffect(() => {
    if (selectedOption === 'Despesas') {
      fetchStatements();
    }
  }, [selectedOption]);
  
  const fetchStatements = async () => {
    try {
      const response = await fetch(`/companies/${user.company_id}/statements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Resposta bruta:', responseText);

      const data = JSON.parse(responseText);
  
      setOpenStatements(data.open_statements || []);
      setCompletedStatements(data.completed_statements || []);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };  

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`/users/sign_out`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": token
        }
      });

      if (response.status === 204) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const renderLogout = useMemo(() => (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
      <Typography sx={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
        <AccountCircleIcon sx={{ marginRight: '5px' }} />
        {user.email}
      </Typography>
      <IconButton onClick={handleLogout} color="inherit">
        <LogoutIcon />
      </IconButton>
    </Box>
  ), [user, handleLogout]);

  const menuItems = [
    { text: 'Despesas', icon: <ReceiptIcon />, link: `/companies/${user.company_id}/statements` },
    ...(admin ? [
      { text: 'Funcionários', icon: <PeopleIcon />, link: `/companies/${user.company_id}/users` },
      { text: 'Cartões', icon: <CreditCardIcon />, link: `/users/${user.id}/cards/new` },
      { text: 'Categorias', icon: <CategoryIcon />, link: `/companies/${user.company_id}/categories` }
    ] : [])
  ];

  const handleMenuItemClick = (itemText) => {
    setSelectedOption(itemText);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Home':
        return <Home />;
      case 'Despesas':
        return (
          <StatementPage
            user={user}
            open_statements={openStatements}
            completed_statements={completedStatements}
          />
        );
      case 'Funcionários':
        return <Employees adminCompanyId={user.company_id} />;
      case 'Cartões':
        return <Cartoes adminCompanyId={user.company_id} />;
      case 'Categorias':
        return <Categorias adminCompanyId={user.company_id} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#007BFF', height: 56, zIndex: 1201 }}>
        <Toolbar sx={{ minHeight: 'unset', px: 2 }}>
          <Typography variant="h6" component="div">
            Espresso - {company.name}
          </Typography>
          {renderLogout}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#007BFF',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Toolbar sx={{ px: 2 }}>
            <Typography variant="h6">Espresso</Typography>
          </Toolbar>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleMenuItemClick(item.text)}
                  selected={selectedOption === item.text}
                  sx={{ color: '#fff' }}
                >
                  <ListItemIcon sx={{ color: '#fff' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, backgroundColor: '#f5f5f5', ml: 0 }}>
        <Toolbar /> {/* Espaço para o AppBar */}
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Header;
