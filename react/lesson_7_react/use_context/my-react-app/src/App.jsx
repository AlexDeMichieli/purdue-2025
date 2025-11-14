import { createContext } from 'react';
import Todos from './components/Todos';

const ThemeContext = createContext(null);

const App = () => {
  const todos = ['Learn React', 'Build a project', 'Master Context API'];

  return (
    <ThemeContext.Provider value={todos}>
      <Todos todos={todos}/>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export default App;
