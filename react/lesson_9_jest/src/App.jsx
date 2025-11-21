import { TodoList } from "./components/TodoList";
import { Counter } from "./components/Counter";
import { FocusInput } from "./components/FocusInput";

function App() {

  return (
    <div>
      <FocusInput />
      <TodoList />
      <Counter />
    </div>
  );
}

export default App;
