import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomTable from './CustomTable'; // ajuste o caminho conforme necessário

test('renders CustomTable with headers and rows', () => {
  const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'age', label: 'Age', align: 'right' }
  ];
  const rows = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 }
  ];

  render(<CustomTable title="Test Table" columns={columns} rows={rows} />);

  // Verifique se o título da tabela está sendo exibido
  expect(screen.getByText('Test Table')).toBeInTheDocument();

  // Verifique se os cabeçalhos das colunas estão sendo exibidos
  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Age')).toBeInTheDocument();

  // Verifique se as linhas da tabela estão sendo exibidas
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();

  // Verifique se os valores das células estão sendo exibidos corretamente
  expect(screen.getByText('30')).toBeInTheDocument();
  expect(screen.getByText('25')).toBeInTheDocument();
});

test('renders table with default cell values', () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'amount', label: 'Amount', mask: '###-##', format: '12345' }
  ];
  const rows = [
    { id: 1, name: 'John Doe', amount: '12345' }
  ];

  render(<CustomTable title="Test Table" columns={columns} rows={rows} />);

  // Verifique se o valor da célula com máscara está sendo exibido corretamente
  expect(screen.getByText('123-45')).toBeInTheDocument(); // Ajuste o valor conforme a máscara
});
