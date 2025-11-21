import { useState } from 'react';

/**
 * CUSTOM HOOKS EXPLANATION:
 *
 * What is a Custom Hook?
 * - A custom hook is a JavaScript function that starts with "use"
 * - It can use other React hooks inside it (useState, useEffect, useRef, etc.)
 * - Custom hooks let you extract and reuse stateful logic between components
 *
 * Why Create Custom Hooks?
 * 1. Reusability - Share logic across multiple components
 * 2. Organization - Keep components clean by moving complex logic out
 * 3. Separation of Concerns - Separate UI from business logic
 * 4. Testability - Easier to test logic in isolation
 *
 * Rules for Custom Hooks:
 * 1. MUST start with "use" (e.g., useToggle, useCounter, useFetch)
 * 2. Can call other hooks inside them
 * 3. Must follow the same rules as built-in hooks (only call at top level)
 *
 * How They Work:
 * - Each component that uses a custom hook gets its OWN independent state
 * - The hook logic is shared, but the state is NOT shared between components
 */

/**
 * useToggle - A simple custom hook for boolean toggle logic
 *
 * @param {boolean} initialValue - Starting value for the toggle (default: false)
 * @returns {[boolean, function]} - Returns [current value, toggle function]
 */
export function useToggle(initialValue = false) {
  // This hook uses useState internally
  // Each component that calls useToggle gets its own independent state
  const [value, setValue] = useState(initialValue);

  // Function to flip the boolean value
  const toggle = () => {
    setValue(currentValue => !currentValue);
  };

  // Return both the current value and the toggle function
  // This is a common pattern: return [value, updater function]
  return [value, toggle];
}
