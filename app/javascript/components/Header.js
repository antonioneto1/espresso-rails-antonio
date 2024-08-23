import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Stack from '@mui/material/Stack';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CategoryIcon from '@mui/icons-material/Category';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Employees from './users/Employees';
import StatementPage from './statements/StatementPage';
import Cartoes from './cards/CardPage';
import Categorias from './categories/CategoryPage';
import Home from './Home';

const Header = ({ user, company, admin }) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  const [selectedOption, setSelectedOption] = useState('Home');
  const [statements, setStatements] = useState([]);
  const [completedStatements, setCompletedStatements] = useState([]);
  const [openStatements, setOpenStatements] = useState([]);
  const [open, setOpen] = useState(true);

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

      const data = await response.json();
      setStatements(data.statements || []);
      setCompletedStatements(data.completed_statements || []);
      setOpenStatements(data.open_statements || []);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`/users/sign_out`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': token
        }
      });

      if (response.status === 204) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  }, [token]);

  const renderLogout = useMemo(() => (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
      <Stack direction="column" sx={{display: 'flex', alignItems: 'right'}}>
        <Typography>
          Espresso App
        </Typography>
        <Typography sx={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
        <AccountCircleIcon sx={{ marginRight: '7px'}} />
          {user.email}
        </Typography>
      </Stack>
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
            statements={statements}
            completedStatements={completedStatements}
            openStatements={openStatements}
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
      <AppBar position="fixed" sx={{ backgroundColor: '#007BFF', height: 66, zIndex: 2000, boxShadow: 0 }}>
        <Toolbar sx={{ minHeight: 'unset', px: 2 }}>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            {open ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div">
            Espresso - {company.name}
          </Typography>
          {renderLogout}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 60,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? 240 : 60,
            boxSizing: 'border-box',
            color: '#000000',
            transition: 'width 0.3s',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Toolbar sx={{ px: 2 }}>
          </Toolbar>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => handleMenuItemClick(item.text)}
                  selected={selectedOption === item.text}
                  sx={{ color: '#000000' }}
                >
                  <ListItemIcon sx={{ color: '#000000' }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
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
