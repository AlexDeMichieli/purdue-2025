import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './features/counter/counterSlice'
import ThemeComponent from './components/ThemeComponent'
import Nav from './components/Nav/Nav'

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const backgroundColor = useSelector((state) => state.theme.backgroundColor)

  return (
    <>
     <Nav />
     <hr></hr>
      <ThemeComponent />
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <p>The background color is {backgroundColor}</p>
      </div>
    </>
  )
}

export default App
