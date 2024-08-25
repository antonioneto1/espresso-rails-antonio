import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryPage from './CategoryPage'; // ajuste o caminho conforme necessário

// Mock fetch API
global.fetch = jest.fn();

// Mock CSRF token
const mockToken = 'dummy-token';
document.querySelector = jest.fn(() => ({ content: mockToken }));

test('renders CategoryPage and fetches categories', async () => {
  const categories = [
    { id: 1, name: 'Category 1' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ categories }) })
  );

  render(<CategoryPage adminCompanyId={1} />);

  expect(await screen.findByText(/category 1/i)).toBeInTheDocument();
});

test('handles open and close dialog', async () => {
  const categories = [];
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ categories }) })
  );

  render(<CategoryPage adminCompanyId={1} />);

  // Open dialog
  fireEvent.click(screen.getByRole('button', { name: /adicionar nova categoria/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Close dialog
  fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('submits a new category successfully', async () => {
  const categories = [];
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ categories }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Categoria criada com sucesso!' }) })
  );

  render(<CategoryPage adminCompanyId={1} />);

  fireEvent.click(screen.getByRole('button', { name: /adicionar nova categoria/i }));

  fireEvent.change(screen.getByLabelText(/nome da categoria/i), {
    target: { value: 'New Category' },
  });

  fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`/companies/1/categories`, expect.objectContaining({
      method: 'POST',
      headers: {
        'X-CSRF-Token': mockToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: { name: 'New Category', company_id: 1 } }),
    }));
    expect(screen.getByText(/categoria criada com sucesso!/i)).toBeInTheDocument();
  });
});

test('shows error if submit fails', async () => {
  const categories = [];
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ categories }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({ errors: 'Erro ao criar categoria' }) })
  );

  render(<CategoryPage adminCompanyId={1} />);

  fireEvent.click(screen.getByRole('button', { name: /adicionar nova categoria/i }));

  fireEvent.change(screen.getByLabelText(/nome da categoria/i), {
    target: { value: 'New Category' },
  });

  fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

  await waitFor(() => {
    expect(screen.getByText(/erro ao criar categoria/i)).toBeInTheDocument();
  });
});

test('handles edit category', async () => {
  const categories = [
    { id: 1, name: 'Old Category' },
  ];

  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve({ categories }) })
  );
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Categoria atualizada com sucesso!' }) })
  );

  render(<CategoryPage adminCompanyId={1} />);

  fireEvent.click(screen.getByRole('button', { name: /editar/i }));

  fireEvent.change(screen.getByLabelText(/nome da categoria/i), {
    target: { value: 'Updated Category' },
  });

  fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(`/companies/1/categories`, expect.objectContaining({
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': mockToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: { name: 'Updated Category', company_id: 1 } }),
    }));
    expect(screen.getByText(/categoria atualizada com sucesso!/i)).toBeInTheDocument();
  });
});
