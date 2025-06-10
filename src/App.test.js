import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const heading = screen.getByText(/Ventilator Management System/i);
  expect(heading).toBeInTheDocument();
});
