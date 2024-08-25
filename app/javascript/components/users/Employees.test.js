import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Employees from './Employees';

// Mock functions and data
const mockFetchEmployees = jest.fn();
const mockToken = 'fake-token';

// Mock global fetch
global.fetch = jest.fn((url, options) => {
  if (url.includes('/companies/1/users')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        employees: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
      })
    });
  }
  if (url.includes('/companies/1/users') && options.method === 'POST') {
    return Promise.resolve({
      json: () => Promise.resolve({ message: 'Success' }),
      ok: true
    });
  }
  if (url.includes('/companies/1/users') && options.method === 'PATCH') {
    return Promise.resolve({
      json: () => Promise.resolve({ message: 'Success' }),
      ok: true
    });
  }
  return Promise.reject(new Error('Unknown URL'));
});

describe('Employees Component', () => {
  test('fetches and displays employees', async () => {
    render(<Employees adminCompanyId={1} />);

    // Wait for employees to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('opens and closes the dialog for adding a new employee', async () => {
    render(<Employees adminCompanyId={1} />);

    // Click on "Cadastrar Novo Funcionário" button
    fireEvent.click(screen.getByText('Cadastrar Novo Funcionário'));

    // Check if dialog is open
    expect(screen.getByText('Cadastrar Novo Funcionário')).toBeInTheDocument();

    // Close the dialog
    fireEvent.click(screen.getByLabelText('close'));

    // Check if dialog is closed
    await waitFor(() => {
      expect(screen.queryByText('Cadastrar Novo Funcionário')).not.toBeInTheDocument();
    });
  });

  test('submits new employee data correctly', async () => {
    render(<Employees adminCompanyId={1} />);

    // Open dialog
    fireEvent.click(screen.getByText('Cadastrar Novo Funcionário'));

    // Fill out form
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'New Employee' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });

    // Submit form
    fireEvent.click(screen.getByText('Cadastrar'));

    // Wait for form submission and employee list update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/companies/1/users', expect.objectContaining({
        method: 'POST'
      }));
    });

    // Check if the dialog closes
    expect(screen.queryByText('Cadastrar Novo Funcionário')).not.toBeInTheDocument();
  });

  test('displays error message when required fields are missing', async () => {
    render(<Employees adminCompanyId={1} />);

    // Open dialog
    fireEvent.click(screen.getByText('Cadastrar Novo Funcionário'));

    // Submit form without filling out the fields
    fireEvent.click(screen.getByText('Cadastrar'));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Nome e Email são obrigatórios')).toBeInTheDocument();
    });
  });

  test('opens dialog for editing an existing employee', async () => {
    render(<Employees adminCompanyId={1} />);

    // Click edit icon for the first employee
    fireEvent.click(screen.getAllByLabelText('Edit')[0]);

    // Check if dialog opens with the employee's data
    expect(screen.getByLabelText('Nome').value).toBe('John Doe');
    expect(screen.getByLabelText('Email').value).toBe('john@example.com');
  });

  test('submits edited employee data correctly', async () => {
    render(<Employees adminCompanyId={1} />);

    // Open dialog for editing
    fireEvent.click(screen.getAllByLabelText('Edit')[0]);

    // Change the employee's data
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Updated Name' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'updated@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByText('Salvar'));

    // Wait for form submission and employee list update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/companies/1/users/1', expect.objectContaining({
        method: 'PATCH'
      }));
    });

    // Check if the dialog closes
    expect(screen.queryByText('Editar Funcionário')).not.toBeInTheDocument();
  });
});
