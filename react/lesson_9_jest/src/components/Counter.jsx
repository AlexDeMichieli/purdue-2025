import { useState } from 'react';

export const Counter = ({ initialCount = 0, step = 1, onCountChange }) => {
  const [count, setCount] = useState(initialCount);
  const [history, setHistory] = useState([initialCount]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, newCount]);
    onCountChange?.(newCount);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, newCount]);
    onCountChange?.(newCount);
  };

  const reset = () => {
    setCount(initialCount);
    setHistory([initialCount]);
    onCountChange?.(initialCount);
  };

  const fetchRemoteCount = async () => {
    // Simulates an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(42), 100);
    });
  };

  const loadRemoteCount = async () => {
    const remoteCount = await fetchRemoteCount();
    setCount(remoteCount);
    setHistory([...history, remoteCount]);
    onCountChange?.(remoteCount);
  };

  return (
    <div className="counter">
      <h2>Counter Component</h2>
      <div className="count-display" data-testid="count-display">
        Count: {count}
      </div>
      <div className="button-group">
        <button onClick={decrement} data-testid="decrement-btn">
          - {step}
        </button>
        <button onClick={increment} data-testid="increment-btn">
          + {step}
        </button>
        <button onClick={reset} data-testid="reset-btn">
          Reset
        </button>
        <button onClick={loadRemoteCount} data-testid="load-btn">
          Load Remote
        </button>
      </div>
      <div className="history">
        History: {history.join(', ')}
      </div>
    </div>
  );
};
