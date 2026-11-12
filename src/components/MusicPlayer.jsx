import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';

export default function MusicPlayer({ audioSrc = '/music.mp3' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setLoadError(false);
    setErrorMessage('');

    const handleCanPlay = () => setLoadError(false);
    const handleError = () => {
      setLoadError(true);
      setErrorMessage("Place 'music.mp3' in /public folder");
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      try {
        audio.pause();
        setIsPlaying(false);
      } catch (err) {}
    } else {
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setLoadError(false);
        }
      } catch (err) {
        setIsPlaying(false);
        if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || audio.error) {
          setLoadError(true);
          setErrorMessage("Add 'music.mp3' to /public");
        }
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-5 right-4 z-50">
      <audio ref={audioRef} src={audioSrc} preload="metadata" loop playsInline />

      <div className="relative group">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all duration-300 shadow-apple-pill border ${
            isPlaying
              ? 'bg-[#1d1d1f] text-white border-transparent'
              : 'bg-white/90 backdrop-blur-md text-[#1d1d1f] border-black/[0.08] hover:border-black/[0.18]'
          }`}
        >
          {/* Animated Equalizer */}
          <div className="relative flex items-center justify-center w-4 h-4">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-white animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-white/70 animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-2/3" />
                <span className="w-0.5 bg-white animate-[pulse_0.8s_ease-in-out_infinite_0.4s] h-4/5" />
              </div>
            ) : (
              <Music className="w-3.5 h-3.5 text-[#1d1d1f]" />
            )}
          </div>

          <span className="text-xs font-medium tracking-tight">
            {isPlaying ? 'Playing' : 'Play Music'}
          </span>

          {isPlaying && (
            <button
              onClick={toggleMute}
              className="p-0.5 hover:opacity-80 transition-opacity ml-0.5"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
            </button>
          )}
        </button>

        {loadError && (
          <div className="absolute top-12 right-0 w-60 p-3 rounded-2xl bg-white border border-black/[0.08] text-xs text-[#1d1d1f] shadow-apple-card-hover backdrop-blur-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#6e6e73]">
                <strong className="text-[#1d1d1f] block">Music Ready:</strong>
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
