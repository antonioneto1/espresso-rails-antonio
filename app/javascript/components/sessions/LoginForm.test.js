import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from '../components/sessions/LoginForm'; // Ajuste o caminho conforme necessário

describe('LoginForm', () => {
  const csrfToken = 'dummy-token';

  test('renders LoginForm component', () => {
    render(<LoginForm csrfToken={csrfToken} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );

    render(<LoginForm csrfToken={csrfToken} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));
    
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/users/sign_in', expect.any(Object)));
    expect(window.location.href).toBe('/');
  });

  test('shows error message with invalid credentials', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid email or password' }),
      })
    );

    render(<LoginForm csrfToken={csrfToken} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/login/i));
    
    await waitFor(() => expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument());
  });

  test('handles fetch error', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(<LoginForm csrfToken={csrfToken} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));
    
    await waitFor(() => expect(screen.getByText(/an error occurred. please try again./i)).toBeInTheDocument());
  });
});
