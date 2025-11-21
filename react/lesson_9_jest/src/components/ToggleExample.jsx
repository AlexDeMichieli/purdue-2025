import { useToggle } from '../hooks/useToggle';

/**
 * Component demonstrating how to use a custom hook
 *
 * Notice how clean this component is - all the toggle logic
 * is abstracted away in the useToggle hook!
 */
export function ToggleExample() {
  // Use our custom hook just like you'd use useState
  // We get back the current value and a function to toggle it
  const [isOn, toggle] = useToggle(false);

  // You can use the same custom hook multiple times in one component
  // Each one has its own independent state
  const [isVisible, toggleVisibility] = useToggle(true);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Custom Hook Example - useToggle</h2>

      {/* First toggle example */}
      <div style={{ marginBottom: '20px' }}>
        <p>The light is: <strong>{isOn ? 'ON' : 'OFF'}</strong></p>
        <button onClick={toggle}>
          Toggle Light {isOn ? '💡' : '⚫'}
        </button>
      </div>

      {/* Second toggle example - shows independence */}
      <div>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Hide' : 'Show'} Message
        </button>
        {isVisible && (
          <p style={{ marginTop: '10px', color: 'green' }}>
            This message can be toggled independently!
          </p>
        )}
      </div>
    </div>
  );
}
