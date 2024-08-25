import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StatementPage from "./StatementPage";

// Mock functions and data
const mockHandleArchive = jest.fn();
const mockHandleUnarchive = jest.fn();
const mockHandleEdit = jest.fn();
const mockFetchCategories = jest.fn();

const mockUser = {
  role: 'admin',
  company_id: 1
};

const mockStatements = [
  { id: 1, merchant: 'Merchant 1', cost: 100, performed_at: '2024-01-01', card: 'Card 1', status: 'Confirmed' },
  { id: 2, merchant: 'Merchant 2', cost: 200, performed_at: '2024-02-01', card: 'Card 2', status: 'Pending' },
];

const mockCompletedStatements = [
  { id: 3, merchant: 'Merchant 3', cost: 300, performed_at: '2024-03-01', card: 'Card 3', status: 'Archived' }
];

const mockOpenStatements = [
  { id: 4, merchant: 'Merchant 4', cost: 400, performed_at: '2024-04-01', card: 'Card 4', status: 'Open' }
];

const mockCategories = [
  { id: 'cat1', name: 'Category 1' },
  { id: 'cat2', name: 'Category 2' },
];

beforeAll(() => {
  // Mock the global fetch function
  global.fetch = jest.fn((url) => {
    if (url.startsWith('/companies/')) {
      return Promise.resolve({
        json: () => Promise.resolve({ categories: mockCategories })
      });
    }
    if (url.startsWith('/statements/archived/')) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'Success' })
      });
    }
    if (url.startsWith('/statements/')) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'Success' })
      });
    }
    return Promise.reject(new Error('Unknown URL'));
  });
});

describe("StatementPage Component", () => {
  test("fetches and displays categories on mount", async () => {
    render(
      <StatementPage
        user={mockUser}
        statements={mockStatements}
        completedStatements={mockCompletedStatements}
        openStatements={mockOpenStatements}
      />
    );

    // Wait for categories to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  test("renders open statements by default", () => {
    render(
      <StatementPage
        user={mockUser}
        statements={mockStatements}
        completedStatements={mockCompletedStatements}
        openStatements={mockOpenStatements}
      />
    );

    // Check if open statements are displayed
    expect(screen.getByText('Merchant 4')).toBeInTheDocument();
  });

  test("changes tabs and displays archived statements", async () => {
    render(
      <StatementPage
        user={mockUser}
        statements={mockStatements}
        completedStatements={mockCompletedStatements}
        openStatements={mockOpenStatements}
      />
    );

    // Click on archived tab
    fireEvent.click(screen.getByText('Arquivadas'));

    // Check if archived statements are displayed
    await waitFor(() => {
      expect(screen.getByText('Merchant 3')).toBeInTheDocument();
    });
  });

  test("handles archive action", async () => {
    render(
      <StatementPage
        user={mockUser}
        statements={mockStatements}
        completedStatements={mockCompletedStatements}
        openStatements={mockOpenStatements}
      />
    );

    // Mock window.alert to test alert messages
    const originalAlert = window.alert;
    window.alert = jest.fn();

    // Trigger archive action
    // Assuming you have an archive button in the List component
    fireEvent.click(screen.getByLabelText('Archive'));

    // Wait for alert to be called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Success');
    });

    // Restore the original alert
    window.alert = originalAlert;
  });

  test("handles unarchive action", async () => {
    render(
      <StatementPage
        user={mockUser}
        statements={mockStatements}
        completedStatements={mockCompletedStatements}
        openStatements={mockOpenStatements}
      />
    );

    // Mock window.alert to test alert messages
    const originalAlert = window.alert;
    window.alert = jest.fn();

    // Trigger unarchive action
    // Assuming you have an unarchive button in the List component
    fireEvent.click(screen.getByLabelText('Unarchive'));

    // Wait for alert to be called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Success');
    });

    // Restore the original alert
    window.alert = originalAlert;
  });
});
