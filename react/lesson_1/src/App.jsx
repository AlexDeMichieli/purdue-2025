import { useState } from "react"

import SimpleComponent from "./components/SimpleComponent/SimpleComponent"
import Counter from "./components/Counter/Counter"
import ConditionalComponent from "./components/ConditionalComponent/ConditionalComponent"

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('');

  // const todos = [
  //   { id: 1, title: 'Learn React', completed: true },
  //   { id: 2, title: 'Build a React App', completed: false },
  //   { id: 3, title: 'Deploy the App', completed: false },
  // ]
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };
  console.log("TODOS", todos)

  return (
    <>
      <input
        type="text"
        placeholder="Add a new todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
      {todos.map((todo, index) => (
          <li
            key={index}
            onClick={() => {
              const newTodos = [...todos]; // Copy the array
              newTodos.splice(index, 1); // Remove the clicked item
              setTodos(newTodos); // Update state
            }}
          >
            {todo}
          </li>
        ))}
      </ul>

   
      {/* <SimpleComponent todos={todos}/> */}
      {/* <Counter />
      <ConditionalComponent /> */}
    </>
  )
}

export default App
