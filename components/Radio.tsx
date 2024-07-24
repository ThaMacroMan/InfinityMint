import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';

const songs = [
  { name: "Blo'Gasm (Your Welcome Daddy)", path: '/audio/BloGasm.mp3' },
  { name: "Go'Gasm (Thank you Daddy)", path: '/audio/GoGasm.mp3' },
  { name: "Gro'Gasm (Your Welcome Daddy)", path: '/audio/GroGasm.mp3' },
  { name: "Ho'Gasm (Thank you Daddy)", path: '/audio/HoGasm.mp3' },
  { name: "Io'Gasm (Dont Stop Daddy)", path: '/audio/IoGasm.mp3' },
  { name: "Mo'Gasm (Thank you Daddy)", path: '/audio/MoGasm.mp3' },
  { name: "Po'Gasm (Dont Stop Daddy)", path: '/audio/PoGasm.mp3' },
  { name: "ShadowGasm (Thank you Daddy)", path: '/audio/ShadowGasm.mp3' },
  { name: "Sho'Gasm (Your Welcome Daddy)", path: '/audio/ShoGasm.mp3' },
  { name: "So'Gasm (Thank you Daddy)", path: '/audio/SoGasm.mp3' },
  { name: "Wo'Gasm (Dont Stop Daddy)", path: '/audio/WoGasm.mp3' }
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
        <option value="">Select a song</option>
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

      <audio ref={audioRef} className="audioElement" controls />
    </div>
  );
};

export default Radio;
