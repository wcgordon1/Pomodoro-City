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

export default function Pomodoro() {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('pomodoro');
  const [timerEnded, setTimerEnded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        console.log("Notification permission:", permission);
        return permission;
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return 'denied';
      }
    }
    return 'unsupported';
  };

  const sendNotification = async (type = timerType) => {
    let permission = notificationPermission;
    if (permission === 'default') {
      permission = await requestNotificationPermission();
    }

    if (permission === "granted") {
      let message;
      switch (type) {
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
    } else if (permission === "denied") {
      console.log("Notification permission denied");
      // You might want to show a message to the user here
    }
  };

  const sendTestNotification = async () => {
    let permission = notificationPermission;
    if (permission === 'default') {
      permission = await requestNotificationPermission();
    }

    if (permission === "granted") {
      new Notification("Test Notification", { body: "testing 854-4514" });
      console.log("Test notification sent");
    } else if (permission === "denied") {
      console.log("Notification permission denied");
      alert("Notification permission denied. Please enable notifications in your browser settings.");
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

  const resetTimer = (type) => {
    setIsRunning(false);
    setTimerType(type);
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('/images/loggg.webp')" }}>
      {/* Timer at the top */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-1 shadow-lg mb-8 w-full max-w-[190px] sm:max-w-[350px] mt-[30px]">
        <div className="oldschool-clock bg-black p-4 rounded-lg flex justify-center items-center">
          <div className="text-5xl sm:text-8xl font-mono text-white-400 oldschool-digits">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Timer type selection */}
      <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-3xl px-[6px] py-[6px] max-w-[300px] w-full mb-4">
        <div className="flex justify-between items-center text-white text-sm font-bold">
          <div 
            className={`p-2 rounded cursor-pointer ${timerType === 'pomodoro' ? 'bg-indigo-800 bg-opacity-70 rounded-2xl' : ''}`}
            onClick={() => resetTimer('pomodoro')}
          >
            Pomodoro
          </div>
          <div 
            className={`p-2 rounded cursor-pointer ${timerType === 'shortBreak' ? 'bg-cyan-500 bg-opacity-70 rounded-2xl' : ''}`}
            onClick={() => resetTimer('shortBreak')}
          >
            Short Break
          </div>
          <div 
            className={`p-2 rounded cursor-pointer ${timerType === 'longBreak' ? 'bg-rose-500 bg-opacity-70 rounded-2xl' : ''}`}
            onClick={() => resetTimer('longBreak')}
          >
            Long Break
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="rounded-xl p-8 shadow-lg mb-8 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold italic mb-4 text-white text-center">Pomodoro Timer</h1>
        <div className="space-x-4 flex justify-center items-center mb-4">
          <button
            className="bg-white text-indigo-900 hover:text-white rounded-3xl text-2xl hover:bg-transparent hover:border-white border-2 border-transparent font-bold py-1 w-[130px] transition-all duration-300"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'pause' : 'start'}
          </button>
          <button
            className="text-white hover:text-gray-200 p-2"
            onClick={() => resetTimer(timerType)}
          >
            <MdRestartAlt className="h-12 w-12" />
          </button>
        </div>
        <AudioControl isRunning={isRunning} timerEnded={timerEnded} />
      </div>

      {/* Test notification and permission buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={sendTestNotification}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Send Test Notification
        </button>
        <button 
          onClick={requestNotificationPermission} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Request Notification Permission
        </button>
      </div>

      {/* Notification permission status */}
      <div className="mt-4 text-white">
        <p>Notification Permission: {notificationPermission}</p>
      </div>
    </div>
  );
}
