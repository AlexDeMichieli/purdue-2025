import "./component.css";

const SimpleComponent = ({ todos }) => {
    console.log("Props received in SimpleComponent:", todos);

    const handleClick = (title) => {
        console.log("you clicked on", title);
    }
    
    return (
        <div>
            <p className="yellow-boat">This is a yellow boat 🚢</p>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} onClick={()=>handleClick(todo.title)}>
                        {todo.title} {todo.completed ? "(Completed)" : "(Not Completed)"}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default SimpleComponent