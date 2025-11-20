import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

// CORE CONCEPT 1: Basic Test Structure (describe, it/test, expect)
describe('Counter Component', () => {
  
  // CORE CONCEPT 2: Basic Matchers
  test('renders with initial count of 0', () => {
    render(<Counter />);
    const countDisplay = screen.getByTestId('count-display');
    expect(countDisplay).toHaveTextContent('Count: 0');
    expect(countDisplay.textContent).toBe('Count: 0');
  });

  test('renders with custom initial count', () => {
    render(<Counter initialCount={10} />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 10');
  });

  // CORE CONCEPT 3: Testing User Interactions
  test('increments count when increment button is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByTestId('increment-btn');
    const countDisplay = screen.getByTestId('count-display');

    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 1');

    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 2');
  });

  test('decrements count when decrement button is clicked', () => {
    render(<Counter initialCount={5} />);
    const decrementBtn = screen.getByTestId('decrement-btn');
    
    fireEvent.click(decrementBtn);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 4');
  });

  test('uses custom step value', () => {
    render(<Counter step={5} />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
  });

  // CORE CONCEPT 4: Testing with userEvent (more realistic)
  test('resets to initial count', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);
    
    await user.click(screen.getByTestId('increment-btn'));
    await user.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 2');
    
    await user.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
  });

  // CORE CONCEPT 5: Mock Functions
  test('calls onCountChange callback when count changes', () => {
    const mockCallback = jest.fn();
    render(<Counter onCountChange={mockCallback} />);
    
    fireEvent.click(screen.getByTestId('increment-btn'));
    
    expect(mockCallback).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(1);
  });

  test('tracks all count changes in history', () => {
    const mockCallback = jest.fn();
    render(<Counter initialCount={0} onCountChange={mockCallback} />);
    
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('decrement-btn'));
    
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, 1);
    expect(mockCallback).toHaveBeenNthCalledWith(2, 2);
    expect(mockCallback).toHaveBeenNthCalledWith(3, 1);
  });

  // CORE CONCEPT 6: Async Testing
  test('loads remote count asynchronously', async () => {
    render(<Counter />);
    
    fireEvent.click(screen.getByTestId('load-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 42');
    });
  });

  // CORE CONCEPT 7: Snapshot Testing
  test('matches snapshot', () => {
    const { container } = render(<Counter initialCount={5} step={2} />);
    expect(container).toMatchSnapshot();
  });

  // CORE CONCEPT 8: Multiple Assertions & Test Organization
  describe('History functionality', () => {
    test('tracks count history correctly', () => {
      render(<Counter initialCount={0} />);
      
      expect(screen.getByText(/History: 0/)).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('increment-btn'));
      expect(screen.getByText(/History: 0, 1/)).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('increment-btn'));
      expect(screen.getByText(/History: 0, 1, 2/)).toBeInTheDocument();
    });

    test('clears history on reset', () => {
      render(<Counter initialCount={5} />);
      
      fireEvent.click(screen.getByTestId('increment-btn'));
      fireEvent.click(screen.getByTestId('reset-btn'));
      
      expect(screen.getByText(/History: 5$/)).toBeInTheDocument();
    });
  });

  // CORE CONCEPT 9: beforeEach and afterEach hooks
  describe('Lifecycle hooks example', () => {
    let mockCallback;

    beforeEach(() => {
      mockCallback = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('first test with fresh mock', () => {
      render(<Counter onCountChange={mockCallback} />);
      fireEvent.click(screen.getByTestId('increment-btn'));
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('second test with fresh mock', () => {
      render(<Counter onCountChange={mockCallback} />);
      fireEvent.click(screen.getByTestId('increment-btn'));
      expect(mockCallback).toHaveBeenCalledTimes(1); // Still 1, not 2
    });
  });
});
