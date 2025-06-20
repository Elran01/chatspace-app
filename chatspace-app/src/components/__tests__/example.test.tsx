import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Simple test component for verification
const TestComponent = () => {
  return (
    <div>
      <h1>Hello ChatSpace</h1>
      <p>This is a test component</p>
    </div>
  );
};

describe('Development Tools Setup', () => {
  it('should render test component correctly', () => {
    render(<TestComponent />);

    expect(screen.getByText('Hello ChatSpace')).toBeInTheDocument();
    expect(screen.getByText('This is a test component')).toBeInTheDocument();
  });

  it('should verify basic functionality', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
