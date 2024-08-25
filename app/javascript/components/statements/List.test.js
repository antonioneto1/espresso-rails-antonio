import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import List from "./List";

// Mock handlers
const mockHandleArchive = jest.fn();
const mockHandleUnarchive = jest.fn();
const mockHandleEdit = jest.fn();

// Sample data
const mockStatements = [
  { id: 1, category_id: 'cat1', archived: false, invoice_url: 'http://example.com/invoice1.pdf' },
  { id: 2, category_id: 'cat2', archived: true, invoice_url: null },
];

const mockColumns = [
  { id: 'id', label: 'ID' },
  { id: 'category_id', label: 'Categoria' },
];

const mockUser = { role: 'admin' };
const mockCategories = [
  { id: 'cat1', name: 'Categoria 1' },
  { id: 'cat2', name: 'Categoria 2' },
];

describe("List Component", () => {
  test("renders the table with data", () => {
    render(
      <List
        statements={mockStatements}
        columns={mockColumns}
        user={mockUser}
        handleArchive={mockHandleArchive}
        handleUnarchive={mockHandleUnarchive}
        handleEdit={mockHandleEdit}
        categories={mockCategories}
      />
    );

    // Check if table rows are rendered
    expect(screen.getByText('Categoria 1')).toBeInTheDocument();
    expect(screen.getByText('Categoria 2')).toBeInTheDocument();
  });

  test("opens and closes edit dialog", async () => {
    render(
      <List
        statements={mockStatements}
        columns={mockColumns}
        user={mockUser}
        handleArchive={mockHandleArchive}
        handleUnarchive={mockHandleUnarchive}
        handleEdit={mockHandleEdit}
        categories={mockCategories}
      />
    );

    // Open edit dialog
    fireEvent.click(screen.getByLabelText('Edit'));
    expect(screen.getByText('Editar Despesa')).toBeInTheDocument();

    // Close edit dialog
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('Editar Despesa')).not.toBeInTheDocument();
  });

  test("handles save changes in edit dialog", async () => {
    render(
      <List
        statements={mockStatements}
        columns={mockColumns}
        user={mockUser}
        handleArchive={mockHandleArchive}
        handleUnarchive={mockHandleUnarchive}
        handleEdit={mockHandleEdit}
        categories={mockCategories}
      />
    );

    // Open edit dialog
    fireEvent.click(screen.getByLabelText('Edit'));

    // Change category and save
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cat2' } });
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockHandleEdit).toHaveBeenCalledWith(1, 'cat2', null);
    });
  });

  test("handles archive confirmation", async () => {
    render(
      <List
        statements={mockStatements}
        columns={mockColumns}
        user={mockUser}
        handleArchive={mockHandleArchive}
        handleUnarchive={mockHandleUnarchive}
        handleEdit={mockHandleEdit}
        categories={mockCategories}
      />
    );

    // Trigger archive confirmation dialog
    fireEvent.click(screen.getByLabelText('Archive'));
    expect(screen.getByText('Arquivar despesa')).toBeInTheDocument();

    // Confirm archive
    fireEvent.click(screen.getByText('Arquivar'));

    await waitFor(() => {
      expect(mockHandleArchive).toHaveBeenCalledWith(1);
    });
  });
});
