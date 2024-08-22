import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import {
  Container,
  Box,
  Typography,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';

const SignupForm = ({ csrfToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            name: name,
          },
          company: {
            name: companyName,
            cnpj: cnpj,
          },
        }),
      });

      if (response.ok) {
        window.location.href = '/users'; // Redireciona após o signup
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#007BFF',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            bgcolor: 'white',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Criar Conta
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="companyName">Nome da Empresa</InputLabel>
              <OutlinedInput
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                label="Nome da Empresa"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="cnpj">CNPJ</InputLabel>
              <InputMask
                mask="99.999.999/9999-99"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              >
                {(inputProps) => (
                  <OutlinedInput
                    id="cnpj"
                    {...inputProps}
                    label="CNPJ"
                  />
                )}
              </InputMask>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Email"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="name">Nome Completo</InputLabel>
              <OutlinedInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                label="Nome Completo"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="password">Senha</InputLabel>
              <OutlinedInput
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={16}
                label="Senha"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="passwordConfirmation">Confirme a Senha</InputLabel>
              <OutlinedInput
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                maxLength={16}
                label="Confirme a Senha"
              />
            </FormControl>

            {error && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{error}</Typography>}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: '100%' }}
            >
              Criar Conta
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupForm;
