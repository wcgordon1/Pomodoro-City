'use client';

import { useState, useEffect } from 'react';
import AudioControl from './components/AudioControl';
import { Howl } from 'howler';
import { MdRestartAlt } from 'react-icons/md';

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

const tingSound = new Howl({
  src: ['/sounds/Ting.mp3'],
  volume: 1.0,
});

const startSound = new Howl({
  src: ['/sounds/start.mp3'],
  volume: 1.0,
});

export default function Pomodoro() {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('pomodoro');
  const [timerEnded, setTimerEnded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ("Notification" in window) {
      checkAndRequestNotificationPermission();
    }
  }, []);

  const checkAndRequestNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } else {
      setNotificationPermission(Notification.permission);
    }
  };

  const sendNotification = () => {
    if (notificationPermission === "granted") {
      let message;
      switch (timerType) {
        case 'pomodoro':
          message = "Pomodoro 25 Minutes is up! Whoo!";
          break;
        case 'shortBreak':
          message = "Short break is over!";
          break;
        case 'longBreak':
          message = "Long break is over. Work time! Come on!";
          break;
        default:
          message = "Timer ended!";
      }
      new Notification("Pomodoro Timer", { body: message });
    }
  };

  const playTingSound = () => {
    let count = 0;
    const playTing = () => {
      tingSound.play();
      count++;
      if (count < 3) {
        setTimeout(playTing, 2000);
      } else {
        setTimerEnded(false);
      }
    };
    playTing();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      if (timerType !== 'pomodoro') {
        startSound.play();
      }
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switch (timerType) {
      case 'pomodoro':
        setTime(POMODORO_TIME);
        break;
      case 'shortBreak':
        setTime(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTime(LONG_BREAK_TIME);
        break;
    }
  };

  const changeTimerType = (type) => {
    setTimerType(type);
    setIsRunning(false);
    switch (type) {
      case 'pomodoro':
        setTime(POMODORO_TIME);
        break;
      case 'shortBreak':
        setTime(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTime(LONG_BREAK_TIME);
        break;
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setTimerEnded(true);
      playTingSound();
      sendNotification();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('/images/loggg.webp')" }}>
      {/* Timer at the top */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-2 shadow-lg mb-6 w-full max-w-[240px] sm:max-w-[350px] mt-[60px]">
        <div className="oldschool-clock bg-black bg-opacity-20 p-4 rounded-lg flex justify-center items-center">
          <div className="text-6xl sm:text-8xl font-mono text-white-400 oldschool-digits">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Timer type selection */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-2xl px-[10px] py-[8px] max-w-[370px] w-full mb-2">
        <div className="flex justify-between items-center text-white text-sm font-bold">
          <div 
            className={`px-4 py-2 rounded cursor-pointer ${timerType === 'pomodoro' ? 'bg-sky-400 rounded-xl' : ''}`}
            onClick={() => changeTimerType('pomodoro')}
          >
            Pomodoro
          </div>
          <div 
            className={`px-4 py-2 rounded cursor-pointer ${timerType === 'shortBreak' ? 'bg-cyan-500 rounded-xl' : ''}`}
            onClick={() => changeTimerType('shortBreak')}
          >
            Short Break
          </div>
          <div 
            className={`px-4 py-2 rounded cursor-pointer ${timerType === 'longBreak' ? 'bg-rose-500 rounded-xl' : ''}`}
            onClick={() => changeTimerType('longBreak')}
          >
            Long Break
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="rounded-xl p-8 shadow-lg mb-8 w-full max-w-md">
        <div className="space-x-4 flex justify-center items-center mb-4">
          <button
            className="bg-white text-indigo-900 hover:text-white rounded-3xl text-2xl hover:bg-transparent hover:border-white border-2 border-transparent font-bold py-1 w-[130px] transition-all duration-300"
            onClick={toggleTimer}
          >
            {isRunning ? 'pause' : 'start'}
          </button>
          <button
            className="text-white hover:text-gray-200 p-2"
            onClick={resetTimer}
          >
            <MdRestartAlt className="h-12 w-12" />
          </button>
        </div>
        {timerType === 'pomodoro' && <AudioControl isRunning={isRunning} timerEnded={timerEnded} />}
      </div>
    </div>
  );
}
