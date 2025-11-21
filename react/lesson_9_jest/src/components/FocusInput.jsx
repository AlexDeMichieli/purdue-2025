import { useRef } from 'react';

/**
 * useRef Hook Explanation:
 *
 * What is useRef?
 * - useRef is a React hook that returns a mutable object with a .current property
 * - This object persists for the entire lifetime of the component
 *
 * Key Characteristics:
 * 1. DOES NOT trigger re-renders when the value changes (unlike useState)
 * 2. Persists across re-renders (the value is maintained)
 * 3. Returns the same object reference on every render
 *
 * Common Use Cases:
 * - Accessing DOM elements directly (like focusing an input)
 * - Storing mutable values that don't need to trigger re-renders
 * - Keeping track of previous values
 * - Storing timers or intervals
 *
 * Syntax: const myRef = useRef(initialValue)
 * - initialValue: The value you want the ref's .current property to be initially
 * - Returns: { current: initialValue }
 */

export function FocusInput() {
  // Create a ref to store the input element
  // Initially set to null, React will set it to the DOM element after mounting
  const inputRef = useRef(null);

  const handleFocusClick = () => {
    // Access the actual DOM element via .current property
    // inputRef.current now points to the <input> element
    // We can call any DOM methods on it (focus, blur, select, etc.)
    inputRef.current.focus();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>useRef Example - Focus Input</h2>
      {/* The ref attribute connects our useRef to this DOM element */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Click the button to focus me"
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={handleFocusClick}>
        Focus the Input
      </button>
    </div>
  );
}
