import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0); // State to track the number of seconds

  useEffect(() => {
    // useEffect sets up a timer that increments the seconds state every second
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1); // Increment seconds by 1
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <h1>Timer: {seconds} seconds</h1> {/* Display the timer */}
      <button onClick={() => setSeconds(0)}>Reset</button> {/* Reset button */}
    </div>
  );
};

export default Timer;
