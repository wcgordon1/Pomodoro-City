'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';

const tracks = [
  { id: 1, src: '/sounds/Dreaming.mp3' },
  { id: 2, src: '/sounds/Lost.mp3' },
  { id: 3, src: '/sounds/Magenta.mp3' },
  { id: 4, src: '/sounds/Smooth.mp3' },
  { id: 5, src: '/sounds/Mississippi.mp3' },
  { id: 6, src: '/sounds/Last.mp3' },
];

export default function AudioControl({ isRunning, timerEnded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const soundRef = useRef(null);
  const [tracksLoaded, setTracksLoaded] = useState([false, false, false, false, false, false]);

  useEffect(() => {
    Howler.volume(0.5);
    // Load only the first track initially
    loadTrack(0);

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && !isPlaying) {
      handlePlay();
    } else if (!isRunning && isPlaying) {
      handlePause();
    }
  }, [isRunning]);

  const loadTrack = (trackIndex) => {
    if (!tracksLoaded[trackIndex]) {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      soundRef.current = new Howl({
        src: [tracks[trackIndex].src],
        html5: true,
        onload: () => {
          setTracksLoaded(prev => {
            const newLoaded = [...prev];
            newLoaded[trackIndex] = true;
            return newLoaded;
          });
        },
        onend: () => {
          if (isRunning) {
            handleNextTrack();
          }
        },
      });
      setTracksLoaded(prev => {
        const newLoaded = [...prev];
        newLoaded[trackIndex] = true;
        return newLoaded;
      });
    }
  };

  const handlePlay = () => {
    if (soundRef.current) {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNextTrack = () => {
    const nextTrack = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrack);
    loadTrack(nextTrack);
    if (isPlaying) {
      setTimeout(() => soundRef.current.play(), 0);
    }
  };

  const handlePreviousTrack = () => {
    if (soundRef.current) {
      const currentTime = soundRef.current.seek();
      if (currentTime > 15) {
        soundRef.current.seek(0);
      } else {
        const previousTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        setCurrentTrack(previousTrack);
        loadTrack(previousTrack);
        if (isPlaying) {
          setTimeout(() => soundRef.current.play(), 0);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center space-x-8">
        <div className="p-[8px] rounded-lg bg-transparent border border-white">
          <BackwardIcon className="h-6 w-6 text-sky-100 cursor-pointer" onClick={handlePreviousTrack} />
        </div>
        <div className="p-[8px] rounded-lg bg-transparent border border-white">
          {isPlaying ? (
            <PauseIcon className="h-6 w-6 text-sky-100 cursor-pointer" onClick={handlePause} />
          ) : (
            <PlayIcon className="h-6 w-6 text-sky-100 cursor-pointer" onClick={handlePlay} />
          )}
        </div>
        <div className="p-[8px] rounded-lg bg-transparent border border-white">
          <ForwardIcon className="h-6 w-6 text-sky-100 cursor-pointer" onClick={handleNextTrack} />
        </div>
      </div>
    </div>
  );
}