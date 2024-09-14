'use client';

import { useState, useEffect } from 'react';
import AudioControl from './components/AudioControl';
import Header from './components/Header';  // Add this import
import { Howl } from 'howler';
import { MdRestartAlt, MdShuffle } from 'react-icons/md';

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

const backgroundImages = [
  '/images/night.webp',
  '/images/lele.webp',
  '/images/off3.webp',
  '/images/beach.webp',
  '/images/off2.webp',
  '/images/dar.webp',
  '/images/off1.webp',
  '/images/lambo2.webp',
  '/images/off5.webp',
  '/images/bike.webp',
  '/images/off6.webp',
  
  
  // Add all other image paths here
];

export default function Pomodoro() {
  const [time, setTime] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('pomodoro');
  const [timerEnded, setTimerEnded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

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

  const shuffleBackground = () => {
    setCurrentBackgroundIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % backgroundImages.length;
      console.log('New background index:', newIndex); // For debugging
      return newIndex;
    });
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
    <div className="relative flex flex-col items-center min-h-screen bg-cover bg-center py-8">
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1] transition-all duration-500" 
        style={{ backgroundImage: `url('${backgroundImages[currentBackgroundIndex]}')` }}
      ></div>

      {/* Add the Header component here */}
      <Header />

      {/* Timer type selection */}
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-2xl px-[10px] py-[8px] max-w-[370px] w-full mb-10 mt-[120px]">
          <div className="flex justify-between items-center text-white text-sm">
            <div 
              className={`px-4 py-2 rounded cursor-pointer ${timerType === 'pomodoro' ? 'bg-sky-400 rounded-xl' : ''}`}
              onClick={() => changeTimerType('pomodoro')}
            >
              pomodoro
            </div>
            <div 
              className={`px-4 py-2 rounded cursor-pointer ${timerType === 'shortBreak' ? 'bg-cyan-500 rounded-xl' : ''}`}
              onClick={() => changeTimerType('shortBreak')}
            >
              short break
            </div>
            <div 
              className={`px-4 py-2 rounded cursor-pointer ${timerType === 'longBreak' ? 'bg-rose-500 rounded-xl' : ''}`}
              onClick={() => changeTimerType('longBreak')}
            >
              long break
            </div>
          </div>
        </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Timer at the top */}
        <div className= "backdrop-filter rounded-xl p-2 mb-6 w-full max-w-[270px] sm:max-w-[440px] mt-[20px]">
          <div className="oldschool-clock p-5 rounded-lg flex justify-center items-center">
            <div className="text-8xl sm:text-9xl font-mono text-white-400 oldschool-digits">
              {formatTime(time)}
            </div>
          </div>
        </div>


        {/* Main content */}
        <div className="rounded-xl p-8 mb-8 w-full max-w-md">
          <div className="space-x-4 flex justify-center items-center mb-14">
            <button
              className="bg-white text-indigo-900 hover:text-white rounded-3xl text-4xl hover:bg-transparent hover:border-white border-2 border-transparent font-bold py-3 w-[170px] transition-all duration-300"
              onClick={toggleTimer}
            >
              {isRunning ? 'pause' : 'start'}
            </button>
            <div className="flex space-x-2">
              <button
                className="text-white hover:text-gray-200 p-2"
                onClick={resetTimer}
              >
                <MdRestartAlt className="h-10 w-10" />
              </button>
              <button
                className="text-white hover:text-gray-200 p-2"
                onClick={shuffleBackground}
              >
                <MdShuffle className="h-10 w-10" />
              </button>
            </div>
          </div>
          {timerType === 'pomodoro' && <AudioControl isRunning={isRunning} timerEnded={timerEnded} />}
        </div>
      </div>
    </div>
  );
}
