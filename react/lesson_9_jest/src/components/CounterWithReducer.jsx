import { useReducer } from 'react';

// Reducer function - groups all state update logic in one place
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      const incrementedCount = state.count + action.step;
      return {
        count: incrementedCount,
        history: [...state.history, incrementedCount]
      };

    case 'DECREMENT':
      const decrementedCount = state.count - action.step;
      return {
        count: decrementedCount,
        history: [...state.history, decrementedCount]
      };

    case 'RESET':
      return {
        count: action.initialCount,
        history: [action.initialCount]
      };

    default:
      return state;
  }
};

export const CounterWithReducer = ({ initialCount = 0, step = 1 }) => {
  // useReducer groups count and history together
  const [state, dispatch] = useReducer(counterReducer, {
    count: initialCount,
    history: [initialCount]
  });

  const increment = () => {
    dispatch({ type: 'INCREMENT', step });
  };

  const decrement = () => {
    dispatch({ type: 'DECREMENT', step });
  };

  const reset = () => {
    dispatch({ type: 'RESET', initialCount });
  };

  return (
    <div className="counter">
      <h2>Counter with useReducer</h2>
      <div className="count-display" data-testid="count-display">
        Count: {state.count}
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
      </div>
      <div className="history">
        History: {state.history.join(', ')}
      </div>
    </div>
  );
};
