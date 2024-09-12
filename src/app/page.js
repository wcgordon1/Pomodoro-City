'use client';

import { useState, useEffect } from 'react';
import AudioControlPanel from './components/AudioControlPanel';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function Pomodoro() {
  const [time, setTime] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setIsBreak(!isBreak);
      setTime(isBreak ? WORK_TIME : BREAK_TIME);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isBreak]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const resetTimer = () => {
    setTime(WORK_TIME);
    setIsRunning(false);
    setIsBreak(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('/images/yes1.webp')" }}>
      {/* Timer at the top */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-4 shadow-lg mb-8 w-full max-w-[300px] mt-[30px]">
        <div className="text-2xl mb-2 text-indigo-600 text-center">{isBreak ? 'Break Time' : 'Work Time'}</div>
        <div className="oldschool-clock bg-black p-4 rounded-lg flex justify-center">
          <div className="text-6xl font-mono text-green-400 oldschool-digits">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg mb-8 w-full max-w-md">
        <h1 className="text-5xl font-extrabold italic mb-4 text-indigo-600 text-center">Pomodoro City</h1>
        <div className="space-x-4 flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </div>
      
      <AudioControlPanel isBreak={isBreak} isRunning={isRunning} />
    </div>
  );
}
