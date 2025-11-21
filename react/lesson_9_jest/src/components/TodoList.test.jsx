import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';

describe('TodoList Component - useReducer Examples', () => {
  
  // CONCEPT: Testing initial state from useReducer
  describe('Initial State', () => {
    test('renders with empty todo list', () => {
      render(<TodoList />);
      
      expect(screen.getByText('Total: 0')).toBeInTheDocument();
      expect(screen.getByText('Active: 0')).toBeInTheDocument();
      expect(screen.getByText('Completed: 0')).toBeInTheDocument();
    });

    test('renders with initial todos', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Learn useReducer', completed: true },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Learn useReducer')).toBeInTheDocument();
      expect(screen.getByText('Total: 2')).toBeInTheDocument();
    });
  });

  // CONCEPT: Testing ADD_TODO action
  describe('Adding Todos', () => {
    test('adds a new todo when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      const input = screen.getByTestId('todo-input');
      const addButton = screen.getByTestId('add-btn');
      
      await user.type(input, 'Buy groceries');
      await user.click(addButton);
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
      expect(screen.getByText('Active: 1')).toBeInTheDocument();
    });

    test('clears input after adding todo', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      const input = screen.getByTestId('todo-input');
      
      await user.type(input, 'Test todo');
      await user.click(screen.getByTestId('add-btn'));
      
      expect(input).toHaveValue('');
    });

    test('does not add empty todos', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await user.click(screen.getByTestId('add-btn'));
      
      expect(screen.getByText('Total: 0')).toBeInTheDocument();
    });

    test('trims whitespace from todos', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      const input = screen.getByTestId('todo-input');
      
      await user.type(input, '   ');
      await user.click(screen.getByTestId('add-btn'));
      
      expect(screen.getByText('Total: 0')).toBeInTheDocument();
    });
  });

  // CONCEPT: Testing TOGGLE_TODO action
  describe('Toggling Todos', () => {
    test('marks todo as completed when checkbox is clicked', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: false },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      const checkbox = screen.getByTestId('toggle-1');
      fireEvent.click(checkbox);
      
      expect(checkbox).toBeChecked();
      expect(screen.getByText('Active: 0')).toBeInTheDocument();
      expect(screen.getByText('Completed: 1')).toBeInTheDocument();
    });

    test('marks todo as incomplete when clicked again', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: true },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      const checkbox = screen.getByTestId('toggle-1');
      fireEvent.click(checkbox);
      
      expect(checkbox).not.toBeChecked();
      expect(screen.getByText('Active: 1')).toBeInTheDocument();
      expect(screen.getByText('Completed: 0')).toBeInTheDocument();
    });

    test('applies line-through style to completed todos', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: false },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      const textElement = screen.getByTestId('text-1');
      expect(textElement).toHaveStyle({ textDecoration: 'none' });
      
      fireEvent.click(screen.getByTestId('toggle-1'));
      expect(textElement).toHaveStyle({ textDecoration: 'line-through' });
    });
  });

  // CONCEPT: Testing DELETE_TODO action
  describe('Deleting Todos', () => {
    test('removes todo when delete button is clicked', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Learn useReducer', completed: false },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      fireEvent.click(screen.getByTestId('delete-1'));
      
      expect(screen.queryByText('Learn React')).not.toBeInTheDocument();
      expect(screen.getByText('Learn useReducer')).toBeInTheDocument();
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
    });

    test('updates stats after deletion', () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      fireEvent.click(screen.getByTestId('delete-2'));
      
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
      expect(screen.getByText('Active: 1')).toBeInTheDocument();
      expect(screen.getByText('Completed: 0')).toBeInTheDocument();
    });
  });

  // CONCEPT: Testing CLEAR_COMPLETED action
  describe('Clearing Completed Todos', () => {
    test('removes all completed todos', () => {
      const initialTodos = [
        { id: 1, text: 'Active Todo', completed: false },
        { id: 2, text: 'Completed Todo 1', completed: true },
        { id: 3, text: 'Completed Todo 2', completed: true },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      fireEvent.click(screen.getByTestId('clear-completed-btn'));
      
      expect(screen.getByText('Active Todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed Todo 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed Todo 2')).not.toBeInTheDocument();
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
    });

    test('does not show clear button when no completed todos', () => {
      const initialTodos = [
        { id: 1, text: 'Active Todo', completed: false },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      expect(screen.queryByTestId('clear-completed-btn')).not.toBeInTheDocument();
    });

    test('shows clear button with count of completed todos', () => {
      const initialTodos = [
        { id: 1, text: 'Active', completed: false },
        { id: 2, text: 'Completed 1', completed: true },
        { id: 3, text: 'Completed 2', completed: true },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      expect(screen.getByText('Clear Completed (2)')).toBeInTheDocument();
    });
  });

  // CONCEPT: Testing complex state updates (multiple dispatches)
  describe('Complex State Updates', () => {
    test('handles multiple actions in sequence', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      // Add first todo
      await user.type(screen.getByTestId('todo-input'), 'Todo 1');
      await user.click(screen.getByTestId('add-btn'));
      
      // Add second todo
      await user.type(screen.getByTestId('todo-input'), 'Todo 2');
      await user.click(screen.getByTestId('add-btn'));
      
      expect(screen.getByText('Total: 2')).toBeInTheDocument();
      
      // Toggle first todo
      const todos = screen.getAllByRole('checkbox');
      fireEvent.click(todos[0]);
      
      expect(screen.getByText('Completed: 1')).toBeInTheDocument();
      
      // Delete second todo
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[1]);
      
      expect(screen.getByText('Total: 1')).toBeInTheDocument();
    });

    test('maintains correct state after multiple toggles', () => {
      const initialTodos = [
        { id: 1, text: 'Todo 1', completed: false },
      ];
      
      render(<TodoList initialTodos={initialTodos} />);
      
      const checkbox = screen.getByTestId('toggle-1');
      
      // Toggle multiple times
      fireEvent.click(checkbox);
      expect(screen.getByText('Completed: 1')).toBeInTheDocument();
      
      fireEvent.click(checkbox);
      expect(screen.getByText('Completed: 0')).toBeInTheDocument();
      
      fireEvent.click(checkbox);
      expect(screen.getByText('Completed: 1')).toBeInTheDocument();
    });
  });

  // CONCEPT: Snapshot testing with useReducer state
  describe('Snapshot Tests', () => {
    test('matches snapshot with empty list', () => {
      const { container } = render(<TodoList />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with todos', () => {
      const initialTodos = [
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Learn useReducer', completed: true },
      ];
      
      const { container } = render(<TodoList initialTodos={initialTodos} />);
      expect(container).toMatchSnapshot();
    });
  });
});
