import React, { useState, useEffect } from 'react';

function CountdownTimer({ time, onCountdownEnd }) {
  const [seconds, setSeconds] = useState(time * 60);

  useEffect(() => {
    let interval
    if (seconds > 0){
      interval = setInterval(() => {
        setSeconds(seconds - 1);
        if (seconds === 1) {
          onCountdownEnd(seconds);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [seconds]);

  let style = {};
  if (seconds < 20) {
    style = { color: 'red' };
  }

  return (
    <div style={style}>
      {Math.floor(seconds / 60)}:{('0' + seconds % 60).slice(-2)}
    </div>
  );
}

export default CountdownTimer;