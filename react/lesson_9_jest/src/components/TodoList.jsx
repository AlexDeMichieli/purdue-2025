import { useReducer, useState } from 'react';

// Action Types (constants to avoid typos)
const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
};

// Reducer function - handles all state updates
// Takes current state and action, returns new state
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload.text,
          completed: false,
        },
      ];

    case ACTIONS.TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case ACTIONS.DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload.id);

    case ACTIONS.EDIT_TODO:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );

    case ACTIONS.CLEAR_COMPLETED:
      return state.filter((todo) => !todo.completed);

    default:
      return state;
  }
}

export const TodoList = ({ initialTodos = [] }) => {
  // useReducer hook: [state, dispatch] = useReducer(reducer, initialState)
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({
        type: ACTIONS.ADD_TODO,
        payload: { text: inputValue },
      });
      setInputValue('');
    }
  };

  const handleToggle = (id) => {
    dispatch({
      type: ACTIONS.TOGGLE_TODO,
      payload: { id },
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: ACTIONS.DELETE_TODO,
      payload: { id },
    });
  };

  const handleClearCompleted = () => {
    dispatch({ type: ACTIONS.CLEAR_COMPLETED });
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="todo-list">
      <h2>Todo List with useReducer</h2>

      <form onSubmit={handleAddTodo} data-testid="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          data-testid="todo-input"
        />
        <button type="submit" data-testid="add-btn">
          Add Todo
        </button>
      </form>

      <div className="stats" data-testid="stats">
        <p>Total: {todos.length}</p>
        <p>Active: {activeTodos.length}</p>
        <p>Completed: {completedTodos.length}</p>
      </div>

      <ul data-testid="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} data-testid={`todo-item-${todo.id}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              data-testid={`toggle-${todo.id}`}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
              data-testid={`text-${todo.id}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              data-testid={`delete-${todo.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {completedTodos.length > 0 && (
        <button onClick={handleClearCompleted} data-testid="clear-completed-btn">
          Clear Completed ({completedTodos.length})
        </button>
      )}
    </div>
  );
};

// Export actions for testing
export { ACTIONS };
