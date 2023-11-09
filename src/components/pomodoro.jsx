import React, { useState, useEffect } from "react";
import { useSound } from "use-sound";
import { differenceInMilliseconds } from "date-fns/esm";
import buttonSFX from "../buttonClick.mp3";
import timerSFX from "../timer.mp3";

const POMODORO_TIME = 25 * 60 * 1000; // 25 minutes in milliseconds
const SHORT_BREAK_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const LONG_BREAK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const BREAK_TIME_DURATION = 5 * 60 * 1000; // 5 minutes break time in milliseconds

export default function Pomodoro() {
  const [startTime, setStartTime] = useState(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [onBreak, setOnBreak] = useState(false);
  const [pomodoro, setPomodoro] = useState(0);
  const [buttonClick] = useSound(buttonSFX);
  const [timerDing] = useSound(timerSFX);
  const [isPaused, setIsPaused] = useState(false);
  const [breakTime, setBreakTime] = useState(BREAK_TIME_DURATION);
 
  function getBreakTime() {
    if (pomodoro > 0 && pomodoro % 4 === 0) {
      return LONG_BREAK_TIME;
    }
    return SHORT_BREAK_TIME;
  }

  function displayRemaining(currentTime, startTime) {
    if (!startTime || !currentTime) return "25:00"; // Default to 25 minutes

    let elapsed = differenceInMilliseconds(currentTime, startTime);
    let ms = onBreak ? breakTime - elapsed : POMODORO_TIME - elapsed;
    if (ms < 0) return "00:00";

    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    const format = (value) => (value < 10 ? `0${value}` : value);

    return `${format(minutes)}:${format(seconds)}`;
  }

  function start() {
    buttonClick();
    if (isPaused) {
      // Resume timer
      setIsPaused(false);
    } else {
      setStartTime(new Date());
      setCurrentTime(new Date());
    }
  }

  function pause() {
    buttonClick();
    setIsPaused(true);
  }

  function reset() {
    buttonClick();
    setStartTime(undefined);
    setCurrentTime(new Date());
    setIsPaused(false);
    setBreakTime(BREAK_TIME_DURATION); // Reset the break time
    setOnBreak(false);
  }

  function startBreak(breakType) {
    if (breakType === "short") {
      setBreakTime(SHORT_BREAK_TIME);
    } else if (breakType === "long") {
      setBreakTime(LONG_BREAK_TIME);
    }
    setOnBreak(true);
    setStartTime(new Date());
    buttonClick();
  }

  function resume() {
    buttonClick();
    setIsPaused(false);
  }

  function showTaskAddedMessage() {
    setShowTaskAdded(true);
    setTimeout(() => {
      setShowTaskAdded(false);
    }, 3000); // Display for 3 seconds
  }

  useEffect(() => {
    let interval = null;
    if (startTime && !onBreak && !isPaused) {
      interval = setInterval(() => {
        if (differenceInMilliseconds(new Date(), startTime) > POMODORO_TIME) {
          setStartTime(undefined);
          startBreak(); // Start the break timer
          timerDing();
        } else {
          setCurrentTime(new Date());
        }
      }, 47);
    }

    if (startTime && onBreak && !isPaused) {
      interval = setInterval(() => {
        if (differenceInMilliseconds(new Date(), startTime) > breakTime) {
          setStartTime(undefined);
          setOnBreak(false);
          timerDing();
          setPomodoro((prevPomodoro) => prevPomodoro + 1);
        } else {
          setCurrentTime(new Date());
        }
      }, 47);
    }

    return () => clearInterval(interval);
  }, [startTime, onBreak, isPaused, breakTime]);

  return (
    <div className={`h-screen flex flex-col items-center justify-center ${startTime && !isPaused ? 'bg-green-500' : 'bg-blue-300'}`}>
      <div className="w-1/3 h-1/ bg-black rounded-lg shadow-md p-4">
        <div className="text-2xl font-bold text-white mb-2 text-center">
          Pomodoro Timer {new Array(pomodoro).fill("🍅")}
        </div>
        <div className="text-8xl my-6 text-center text-white">
          {displayRemaining(currentTime, startTime)}
        </div>
        <div className="flex justify-center space-x-4">
          {startTime && isPaused ? (
            <button
              onClick={resume}
              className="p-2 rounded bg-blue-500 text-white"
            >
              Resume
            </button>
          ) : startTime ? (
            <>
              <button
                onClick={pause}
                className="p-2 rounded bg-blue-500 text-white"
              >
                Pause
              </button>
              <button
                onClick={reset}
                className="p-2 rounded bg-red-500 text-white"
              >
                Reset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={start}
                className="p-2 rounded bg-green-500 text-white"
              >
                Start
              </button>
              <button
                onClick={() => startBreak("short")}
                className="p-1 rounded bg-yellow-500 text-white"
              >
                Short Break (5 mins)
              </button>
              <button
                onClick={() => startBreak("long")}
                className="p-2 rounded bg-red-500 text-white"
              >
                Long Break (15 mins)
              </button>
            </>
          )}
        </div>
        {onBreak && (
          <div className="text-red-500 mt-4 text-center text-white">
            Time for a break!
          </div>
        )}
      </div>
    </div>
  );
}
