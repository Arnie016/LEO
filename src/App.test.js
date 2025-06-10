import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  global.BroadcastChannel = class {
    postMessage() {}
    addEventListener() {}
    removeEventListener() {}
    close() {}
  };
});

test('renders Ventilator Management System heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Ventilator Management System/i);
  expect(headingElement).toBeInTheDocument();
});
