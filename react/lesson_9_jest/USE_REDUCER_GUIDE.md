# useReducer Hook Guide

A comprehensive guide to understanding and using `useReducer` in React.

## Table of Contents

- [What is useReducer?](#what-is-usereducer)
- [When to Use useReducer](#when-to-use-usereducer)
- [Basic Syntax](#basic-syntax)
- [Counter: useState vs useReducer](#counter-usestate-vs-usereducer)
- [Complete Examples](#complete-examples)

## What is useReducer?

`useReducer` is a React Hook for managing complex state logic. It's an alternative to `useState` that gives you more control over state updates.

### Key Concept

Instead of directly setting state, you **dispatch actions** that describe what happened. A **reducer function** then determines how the state should change.

```
Current State + Action → Reducer Function → New State
```

## When to Use useReducer

Use `useReducer` when:

✅ State logic is complex with multiple sub-values  
✅ Next state depends on previous state  
✅ You have multiple ways to update the same state  
✅ State transitions need to be predictable and testable

Use `useState` when:

✅ State is simple (single value)  
✅ State updates are independent  
✅ No complex logic needed

## Basic Syntax

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

**Parameters:**
- `reducer`: Function that determines state changes
- `initialState`: Starting state value

**Returns:**
- `state`: Current state value
- `dispatch`: Function to trigger state changes

## Counter: useState vs useReducer

Let's compare the same counter component using both approaches.

### ❌ useState Version (Counter.jsx)

```javascript
import { useState } from 'react';

export const Counter = ({ initialCount = 0, step = 1 }) => {
  const [count, setCount] = useState(initialCount);
  const [history, setHistory] = useState([initialCount]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, newCount]);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, newCount]);
  };

  const reset = () => {
    setCount(initialCount);
    setHistory([initialCount]);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

**Issues with useState approach:**
- Multiple pieces of related state (`count`, `history`)
- Logic repeated in each function
- Easy to forget updating all related state
- Hard to test state logic

### ✅ useReducer Version (CounterWithReducer.jsx)

```javascript
import { useReducer } from 'react';

// 1. Define action types
const ACTIONS = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  SET_STEP: 'SET_STEP',
};

// 2. Create reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      return {
        ...state,
        count: state.count + state.step,
      };
    
    case ACTIONS.DECREMENT:
      return {
        ...state,
        count: state.count - state.step,
      };
    
    case ACTIONS.RESET:
      return {
        ...state,
        count: state.initialCount,
      };
    
    case ACTIONS.SET_STEP:
      return {
        ...state,
        step: action.payload,
      };
    
    default:
      return state;
  }
}

// 3. Use in component
export const CounterWithReducer = ({ initialCount = 0, initialStep = 1 }) => {
  const [state, dispatch] = useReducer(counterReducer, {
    count: initialCount,
    initialCount: initialCount,
    step: initialStep,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: ACTIONS.INCREMENT })}>
        +{state.step}
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DECREMENT })}>
        -{state.step}
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.RESET })}>
        Reset
      </button>
    </div>
  );
};
```

**Benefits of useReducer:**
- ✅ All related state in one object
- ✅ Logic centralized in reducer function
- ✅ Actions clearly describe intent
- ✅ Easier to test (test reducer separately)
- ✅ More predictable state updates

## Complete Examples

### Example 1: Simple Counter

See `CounterWithReducer.jsx` for a complete example with:
- INCREMENT action
- DECREMENT action  
- RESET action
- SET_STEP action (dynamic step value)

### Example 2: Todo List

See `TodoList.jsx` for a more complex example managing an array with:
- ADD_TODO action
- TOGGLE_TODO action
- DELETE_TODO action
- CLEAR_COMPLETED action

## Key Takeaways

1. **Reducer**: Pure function that calculates new state
2. **Actions**: Objects describing what happened
3. **Dispatch**: Function to send actions to reducer
4. **Benefits**: Predictable, testable, centralized logic
5. **Use When**: State is complex or has multiple update patterns

Run the tests to see how useReducer works:

```bash
npm test CounterWithReducer
npm test TodoList
```
