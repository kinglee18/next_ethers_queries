import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): any => {
    const difference = +targetDate - +new Date();
    let timeLeft: any = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="">
      {timeLeft.days > 0 && (
        <div className="text-md font-semibold mb-2">
          Time Left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      )}
      {timeLeft.days === 0 && (
        <div className="text-md font-semibold mb-2">
          Time Left: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      )}
      {timeLeft.days === 0 && timeLeft.hours === 0 && (
        <div className="text-md font-semibold mb-2">
          Time Left: {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      )}
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && (
        <div className="text-md font-semibold mb-2">
          Time Left: {timeLeft.seconds}s
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
