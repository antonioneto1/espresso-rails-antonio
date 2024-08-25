import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from './SignupForm'; // ajuste o caminho conforme necessário

test('renders SignupForm and handles successful signup', async () => {
  // Mock fetch to simulate a successful signup response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
    })
  );

  const csrfToken = 'dummy-token';
  render(<SignupForm csrfToken={csrfToken} />);

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/nome da empresa/i), {
    target: { value: 'My Company' },
  });
  fireEvent.change(screen.getByLabelText(/cnpj/i), {
    target: { value: '12.345.678/0001-95' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/nome completo/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/confirme a senha/i), {
    target: { value: 'password123' },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/criar conta/i));

  // Check that fetch was called with correct parameters
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({
      user: {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        name: 'John Doe',
      },
      company: {
        name: 'My Company',
        cnpj: '12.345.678/0001-95',
      },
    }),
  })));
});

test('renders error message on signup failure', async () => {
  // Mock fetch to simulate a failed signup response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Erro ao criar conta' }),
    })
  );

  const csrfToken = 'dummy-token';
  render(<SignupForm csrfToken={csrfToken} />);

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/nome da empresa/i), {
    target: { value: 'My Company' },
  });
  fireEvent.change(screen.getByLabelText(/cnpj/i), {
    target: { value: '12.345.678/0001-95' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/nome completo/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/confirme a senha/i), {
    target: { value: 'password123' },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/criar conta/i));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText(/erro ao criar conta/i)).toBeInTheDocument();
  });
});

test('handles network errors', async () => {
  // Mock fetch to simulate a network error
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  const csrfToken = 'dummy-token';
  render(<SignupForm csrfToken={csrfToken} />);

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/nome da empresa/i), {
    target: { value: 'My Company' },
  });
  fireEvent.change(screen.getByLabelText(/cnpj/i), {
    target: { value: '12.345.678/0001-95' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/nome completo/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText(/confirme a senha/i), {
    target: { value: 'password123' },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/criar conta/i));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByText(/ocorreu um erro. tente novamente/i)).toBeInTheDocument();
  });
});
