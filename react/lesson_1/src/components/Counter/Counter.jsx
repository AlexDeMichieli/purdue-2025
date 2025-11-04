import { useState } from "react";

const Counter = () => {
    console.log("app refreshes!,")

    const [count, setCount] = useState(0);
    

    return (
        <>
            <p>The counter is {count}</p>
            <button onClick={()=> setCount(count + 1)} >Update counter</button>
            <button onClick={()=> setCount(0)} >Reset counter</button>
        </>
    )
}

export default Counter;