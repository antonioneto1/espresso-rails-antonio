import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

test('renders Home component with welcome message', () => {
  render(<Home />);

  expect(screen.getByText('Bem-vindo ao Espresso!')).toBeInTheDocument();
});

test('checks if Home component has correct styles', () => {
  const { container } = render(<Home />);

  expect(container.firstChild).toHaveStyle('min-height: 100vh');

  expect(container.firstChild).toHaveStyle('max-width: 1200px');

  expect(container.firstChild).toHaveStyle('margin: auto');
});
