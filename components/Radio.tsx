import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';

const songs = [
  { name: "Cats and AI", path: '/audio/Cats and AI.mp3' },
  { name: "Cats and AI Remix", path: '/audio/Cats and AI_2.mp3' },

];

const getRandomSong = () => songs[Math.floor(Math.random() * songs.length)].path;

const Radio: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<string>(getRandomSong);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5); // Default volume set to 0.5
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = selectedSong;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [selectedSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSongChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const songPath = event.target.value;
    setSelectedSong(songPath);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songPath;
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  const playNextSong = useCallback(() => {
    const currentIndex = songs.findIndex(song => song.path === selectedSong);
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex].path);
    setIsPlaying(true);
  }, [selectedSong]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', playNextSong);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', playNextSong);
      }
    };
  }, [selectedSong, playNextSong]);

  return (
    <div className="audioPlayer">
      <select 
        value={selectedSong} 
        onChange={handleSongChange}
        className="songSelector"
      >
        {songs.map((song, index) => (
          <option key={index} value={song.path}>{song.name}</option>
        ))}
      </select>

      <button 
        onClick={togglePlayPause} 
        disabled={!selectedSong}
        className="playPauseButton"
      >
        {isPlaying ? 'End Vibe' : 'Vibe 🎶'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volumeSlider"
      />

      <audio ref={audioRef} className="audioElement" controls style={{ display: 'none' }} />
    </div>
  );
};

export default Radio;
