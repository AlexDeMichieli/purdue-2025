import { useContext } from 'react';
import { ThemeContext } from '../App';

const TodoItem = ({ index }) => {
  const todos = useContext(ThemeContext);
  console.log("from todoitem component", todos[index]);

  return <li>{todos[index]}</li>;
};

export default TodoItem;
