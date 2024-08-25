import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home'; // ajuste o caminho conforme necessário

test('renders Home component with welcome message', () => {
  render(<Home />);

  // Verifique se o componente renderiza a mensagem de boas-vindas
  expect(screen.getByText('Bem-vindo ao Espresso!')).toBeInTheDocument();
});

test('checks if Home component has correct styles', () => {
  const { container } = render(<Home />);

  // Verifique se o estilo mínimo de altura é aplicado
  expect(container.firstChild).toHaveStyle('min-height: 100vh');

  // Verifique se o estilo máximo de largura é aplicado
  expect(container.firstChild).toHaveStyle('max-width: 1200px');

  // Verifique se o estilo de margem é aplicado
  expect(container.firstChild).toHaveStyle('margin: auto');
});
