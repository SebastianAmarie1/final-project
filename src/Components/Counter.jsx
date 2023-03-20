import React, { useState, useEffect, memo } from 'react';

/*Exports teh counter used in the homepage*/
function CountdownTimer({ time, onCountdownEnd }) {

  const [seconds, setSeconds] = useState(time * 60);

  /*UseEffect that counts down from a specific amount of seconts*/
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

export default memo(CountdownTimer);