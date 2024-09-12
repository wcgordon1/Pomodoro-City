'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { Range, getTrackBackground } from 'react-range';
import { FaForward } from 'react-icons/fa';
import { Switch } from '@headlessui/react';

const tracks = [
  { id: 1, src: '/sounds/Dreamy-Love.mp3' },
  { id: 2, src: '/sounds/sloopy-2.mp3' },
];

export default function AudioControlPanel({ isBreak, isRunning }) {
  const [volume, setVolume] = useState([0.5]);
  const [currentTrack, setCurrentTrack] = useState(isBreak ? 1 : 0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const soundRef = useRef(null);

  const playNextTrack = useCallback(() => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length);
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    soundRef.current = new Howl({
      src: [tracks[currentTrack].src],
      volume: volume[0],
      loop: false,
      onend: playNextTrack,
    });

    if (isRunning && isAudioEnabled) {
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [currentTrack, volume, isRunning, playNextTrack, isAudioEnabled]);

  useEffect(() => {
    setCurrentTrack(isBreak ? 1 : 0);
  }, [isBreak]);

  useEffect(() => {
    if (isRunning && isAudioEnabled) {
      soundRef.current?.play();
    } else {
      soundRef.current?.pause();
    }
  }, [isRunning, isAudioEnabled]);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume[0]);
    }
  };

  const handleNextTrack = () => {
    playNextTrack();
    if (isRunning && isAudioEnabled) {
      soundRef.current?.play();
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-lg w-full max-w-md">
      <div className="flex justify-center items-center space-x-4 mb-4">
        <Switch
          checked={isAudioEnabled}
          onChange={setIsAudioEnabled}
          className={`${
            isAudioEnabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable audio</span>
          <span
            className={`${
              isAudioEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <button onClick={handleNextTrack} className="text-blue-500 hover:text-blue-700">
          <FaForward size={24} />
        </button>
      </div>
      <Range
        values={volume}
        step={0.1}
        min={0}
        max={1}
        onChange={handleVolumeChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: volume,
                  colors: ['#548BF4', '#ccc'],
                  min: 0,
                  max: 1
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key}
              {...restProps}
              style={{
                ...restProps.style,
                height: '20px',
                width: '20px',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA'
              }}
            >
              <div
                style={{
                  height: '16px',
                  width: '5px',
                  backgroundColor: isDragged ? '#548BF4' : '#CCC'
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}