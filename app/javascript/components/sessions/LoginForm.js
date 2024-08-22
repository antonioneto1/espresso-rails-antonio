import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Grid, Box } from '@mui/material';

const LoginForm = ({ csrfToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/users/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
          },
        }),
      });

      if (response.ok) {
        window.location.href = '/users'; // Redireciona para a página de usuários após o login
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container 
      maxWidth="false" 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: '#007BFF' 
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" sx={{ color: '#007BFF', mb: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ maxLength: 16 }}
            />
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ bgcolor: '#007BFF', ':hover': { bgcolor: '#0056b3' } }}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ borderColor: '#007BFF', color: '#007BFF', ':hover': { borderColor: '#0056b3', color: '#0056b3' } }}
                onClick={() => window.location.href = '/users/sign_up'}
              >
                Criar Conta
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
