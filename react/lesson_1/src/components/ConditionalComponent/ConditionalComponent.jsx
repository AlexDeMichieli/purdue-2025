import { useState } from "react";

const ConditionalComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    console.log("State is now", isLoggedIn)
    return (
        <div>
            {
                isLoggedIn ? (
                   <h2>Welcome!</h2> 
                ) : (
                    <h2>Please log in</h2>
                )
            }
            <button onClick={()=>setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? "Logout" : "Login"}</button>
        </div>
    )
}

export default ConditionalComponent;