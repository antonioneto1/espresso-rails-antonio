import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
      <Typography variant="h4">Bem-vindo ao Espresso!</Typography>
    </Box>
  );
};

export default Home;
