import React, { useState } from 'react';

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

  const styles = {
    body: {
      backgroundColor: '#007BFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0,
      padding: '20px',
    },
    signupForm: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px',
    },
    h2: {
      textAlign: 'left',
      color: '#333',
      marginBottom: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontSize: '14px',
    },
    input: {
      borderRadius: '5px',
      padding: '12px',
      width: '100%',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
      fontSize: '14px',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    inputFocus: {
      borderColor: '#007BFF',
      boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
      outline: 'none',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginTop: '10px',
    },
    button: {
      backgroundColor: 'white',
      border: '1px solid #007BFF',
      color: '#007BFF',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      textAlign: 'left',
      display: 'block',
      marginTop: '10px',
      transition: 'background-color 0.3s, color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#007BFF',
      color: 'white',
    },
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = styles.inputFocus.borderColor;
    e.target.style.boxShadow = styles.inputFocus.boxShadow;
    e.target.style.outline = styles.inputFocus.outline;
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = styles.input.borderColor;
    e.target.style.boxShadow = styles.input.boxShadow;
    e.target.style.outline = styles.input.outline;
  };

  return (
    <div style={styles.body}>
      <div style={styles.signupForm}>
        <h2 style={styles.h2}>Criar Conta</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="companyName">Nome da Empresa</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="passwordConfirmation">Confirme a Senha</label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              style={styles.input}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            onMouseOver={(e) => e.target.style.color = styles.buttonHover.color}
            onMouseOut={(e) => e.target.style.color = styles.button.color}
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
