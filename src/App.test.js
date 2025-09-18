import { render, screen } from '@testing-library/react';
import App from './App';

class MockBroadcastChannel {
  constructor() {}
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

beforeAll(() => {
  global.BroadcastChannel = MockBroadcastChannel;
});

afterAll(() => {
  delete global.BroadcastChannel;
});

test('renders application header', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /ventilator management system/i });
  expect(heading).toBeInTheDocument();
});
