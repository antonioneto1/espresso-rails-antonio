import React, { useState } from 'react';

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

  const styles = {
    body: {
      backgroundColor: '#007BFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
    },
    loginForm: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      width: '300px',
    },
    h2: {
      textAlign: 'center',
      color: '#007BFF',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#333',
    },
    input: {
      borderRadius: '5px',
      padding: '10px',
      width: '90%',
      border: '1px solid #ccc',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginTop: '10px',
    },
    button_login: {
      backgroundColor: '#007BFF',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      color: 'white',
      width: '100%',
      marginTop: '10px',
      cursor: 'pointer',
    },
    button_new: {
      backgroundColor: '#000',
      border: 'none',
      padding: '5px 5px',
      borderRadius: '5px',
      color: 'white',
      width: '100%',
      marginTop: '10px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginForm}>
        <h2 style={styles.h2}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#007BFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Login
            </button>
            <button
              type="button"
              style={{
                backgroundColor: 'white',
                border: '1px solid #007BFF',
                padding: '10px 20px',
                borderRadius: '5px',
                color: '#007BFF',
                cursor: 'pointer',
                flex: 1,
              }}
              onClick={() => window.location.href = '/users/sign_up'}
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
