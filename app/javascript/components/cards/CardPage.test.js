import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardPage from './CardPage'; // ajuste o caminho conforme necessário

// Mock fetch API
global.fetch = jest.fn();

// Mock CSRF token
const mockToken = 'dummy-token';
document.querySelector = jest.fn(() => ({ content: mockToken }));

test('renders CardPage and fetches cards and employees', async () => {
  const cards = [
    { id: 1, last4: '1234', employee_id: 1, name: 'Card 1' },
  ];
  const employees = [
    { id: 1, name: 'John Doe' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ cards }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ employees }) })
  );

  render(<CardPage adminCompanyId={1} />);

  // Check if the card is displayed
  expect(await screen.findByText(/card 1/i)).toBeInTheDocument();
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
});

test('handles open and close dialog', async () => {
  const cards = [];
  const employees = [
    { id: 1, name: 'John Doe' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ cards }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ employees }) })
  );

  render(<CardPage adminCompanyId={1} />);

  // Open dialog
  fireEvent.click(screen.getByRole('button', { name: /cadastrar cartão/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Close dialog
  fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('submits a new card successfully', async () => {
  const cards = [];
  const employees = [
    { id: 1, name: 'John Doe' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ cards }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ employees }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true })
  );

  render(<CardPage adminCompanyId={1} />);

  fireEvent.click(screen.getByRole('button', { name: /cadastrar cartão/i }));

  fireEvent.change(screen.getByLabelText(/últimos 4 dígitos/i), {
    target: { value: '5678' },
  });
  fireEvent.change(screen.getByLabelText(/funcionário/i), {
    target: { value: '1' },
  });

  fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`/companies/1/cards`, expect.objectContaining({
      method: 'POST',
      headers: {
        'X-CSRF-Token': mockToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        card: {
          last4: '5678',
          user_id: '1',
        },
      }),
    }));
  });
});

test('shows error if submit fails', async () => {
  const cards = [];
  const employees = [
    { id: 1, name: 'John Doe' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ cards }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ employees }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({ errors: 'Erro ao criar cartão' }) })
  );

  render(<CardPage adminCompanyId={1} />);

  fireEvent.click(screen.getByRole('button', { name: /cadastrar cartão/i }));

  fireEvent.change(screen.getByLabelText(/últimos 4 dígitos/i), {
    target: { value: '5678' },
  });
  fireEvent.change(screen.getByLabelText(/funcionário/i), {
    target: { value: '1' },
  });

  fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/erro ao criar cartão/i)).toBeInTheDocument();
  });
});
