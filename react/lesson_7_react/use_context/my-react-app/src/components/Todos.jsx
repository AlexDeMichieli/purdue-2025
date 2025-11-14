import { useContext } from 'react';
import { ThemeContext } from '../App';
import TodoItem from './TodoItem';

const Todos = () => {
  const todosContext = useContext(ThemeContext);
  console.log("Todos from context:", todosContext);

  return (
    <ul>
      {todosContext.map((_, index) => (
        <TodoItem key={index} index={index} />
      ))}
    </ul>
  );
};

export default Todos;
