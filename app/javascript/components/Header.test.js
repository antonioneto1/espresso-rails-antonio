import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header'; // ajuste o caminho conforme necessário

// Mock para o token CSRF
const mockToken = 'mock-csrf-token';
document.querySelector = jest.fn(() => ({ content: mockToken }));

// Mock para a função de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      statements: [],
      completed_statements: [],
      open_statements: [],
    }),
  })
);

test('renders Header component', () => {
  const user = { company_id: 1, email: 'user@example.com', id: 1 };
  const company = { name: 'Test Company' };
  const admin = true;

  render(<Header user={user} company={company} admin={admin} />);

  // Verifique se o nome da empresa está sendo exibido
  expect(screen.getByText('Espresso - Test Company')).toBeInTheDocument();

  // Verifique se o email do usuário está sendo exibido
  expect(screen.getByText('user@example.com')).toBeInTheDocument();

  // Verifique se o botão de logout está presente
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});

test('fetches and displays statements on selecting "Despesas"', async () => {
  const user = { company_id: 1, email: 'user@example.com', id: 1 };
  const company = { name: 'Test Company' };
  const admin = true;

  render(<Header user={user} company={company} admin={admin} />);

  // Simule a seleção da opção "Despesas"
  fireEvent.click(screen.getByText('Despesas'));

  // Aguarde o fetch completar e verifique se o conteúdo correto é exibido
  await waitFor(() => {
    expect(screen.getByText('StatementPage Component')).toBeInTheDocument();
  });
});

test('handles logout click', async () => {
  const user = { company_id: 1, email: 'user@example.com', id: 1 };
  const company = { name: 'Test Company' };
  const admin = true;

  render(<Header user={user} company={company} admin={admin} />);

  // Simule o clique no botão de logout
  fireEvent.click(screen.getByRole('button', { name: /logout/i }));

  // Verifique se a função de logout foi chamada
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(`/users/sign_out`, expect.any(Object));
  });
});
