import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX,
  Maximize, Minimize, Settings, PictureInPicture, Music, Video as VideoIcon, ExternalLink
} from 'lucide-react';
import { resolveMediaUrl, getYouTubeEmbedUrl, getVimeoEmbedUrl, detectMediaType } from '../../utils/media';

interface UniversalPlayerProps {
  url?: string | null;
  title?: string;
  poster?: string | null;
  autoPlay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

export const UniversalPlayer: React.FC<UniversalPlayerProps> = ({
  url,
  title,
  poster,
  autoPlay = false,
  onEnded,
  onTimeUpdate,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hasMediaError, setHasMediaError] = useState<boolean>(false);
  const controlsTimeoutRef = useRef<any>(null);

  const resolvedUrl = resolveMediaUrl(url);
  const youtubeEmbed = getYouTubeEmbedUrl(url);
  const vimeoEmbed = getVimeoEmbedUrl(url);
  const mediaType = detectMediaType(url);

  const isAudio = mediaType === 'audio';
  const isEmbed = !!youtubeEmbed || !!vimeoEmbed;

  // Reset states when URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasMediaError(false);
  }, [url]);

  // Handle Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayPause = () => {
    const el = isAudio ? audioRef.current : videoRef.current;
    if (!el) return;

    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    const el = isAudio ? audioRef.current : videoRef.current;
    if (el) {
      el.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    const el = isAudio ? audioRef.current : videoRef.current;
    if (el) {
      el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    const el = isAudio ? audioRef.current : videoRef.current;
    if (el) {
      el.volume = vol;
      el.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    const el = isAudio ? audioRef.current : videoRef.current;
    if (!el) return;
    if (isMuted) {
      el.muted = false;
      el.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      el.muted = true;
      setIsMuted(true);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    const el = isAudio ? audioRef.current : videoRef.current;
    if (el) {
      el.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (e) {
        console.error('PiP failed', e);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  if (!url) {
    return (
      <div className={`w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6 ${className}`}>
        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <VideoIcon className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-300 mb-1">{title || 'No Media Selected'}</p>
        <p className="text-xs text-slate-500">Instructor will upload lecture stream here.</p>
      </div>
    );
  }

  // YouTube Embed Player
  if (youtubeEmbed) {
    return (
      <div className={`w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative ${className}`}>
        <iframe
          src={youtubeEmbed}
          title={title || 'Course Lecture Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Vimeo Embed Player
  if (vimeoEmbed) {
    return (
      <div className={`w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative ${className}`}>
        <iframe
          src={vimeoEmbed}
          title={title || 'Course Lecture Video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Dedicated Audio Player
  if (isAudio) {
    return (
      <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl ${className}`}>
        <audio
          ref={audioRef}
          src={resolvedUrl}
          autoPlay={autoPlay}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 0);
              onTimeUpdate?.(audioRef.current.currentTime, audioRef.current.duration || 0);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration || 0);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
        />

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Music className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              High-Fidelity Audio Lecture
            </span>
            <h4 className="text-base font-bold text-white truncate mt-1">{title || 'Audio Lesson'}</h4>
          </div>
        </div>

        {/* Audio scrub progress bar */}
        <div className="space-y-1.5 mb-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSkip(-10)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer font-bold"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
            </button>
            <button
              onClick={() => handleSkip(10)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fast Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 py-1 w-24 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 divide-y divide-slate-800">
                  {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRateChange(r)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 transition-colors ${
                        playbackRate === r ? 'text-emerald-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {r}x {r === 1 ? '(Normal)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-slate-400 hover:text-white cursor-pointer">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no URL or media failed to load, show rich interactive preview card
  if (!resolvedUrl || hasMediaError) {
    return (
      <div
        className={`relative w-full aspect-video bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        {poster && (
          <img
            src={resolveMediaUrl(poster)}
            alt={title || 'Course Lecture'}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xs"
          />
        )}
        <div className="relative z-10 max-w-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-xl">
            <VideoIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1">{title || 'Lecture Video Module'}</h4>
            <p className="text-xs text-slate-400">
              {hasMediaError
                ? 'External media stream temporarily unavailable or source removed.'
                : 'Video lecture stream is ready for this curriculum module.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                setHasMediaError(false);
                setIsPlaying(true);
                onEnded?.();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mark Video Watched</span>
            </button>
            {hasMediaError && (
              <button
                onClick={() => setHasMediaError(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Retry Stream
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Native HTML5 Video Stream Player (Cloudinary, Local Uploads, Direct MP4)
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`group relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none ${className}`}
    >
      <video
        ref={videoRef}
        src={resolvedUrl}
        poster={poster ? resolveMediaUrl(poster) : undefined}
        autoPlay={autoPlay}
        playsInline
        crossOrigin="anonymous"
        onError={() => setHasMediaError(true)}
        onClick={handlePlayPause}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
            onTimeUpdate?.(videoRef.current.currentTime, videoRef.current.duration || 0);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration || 0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Button when paused */}
      {!isPlaying && (
        <div
          onClick={handlePlayPause}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Floating Control Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="relative mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 p-1 rounded-md transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => handleSkip(-10)}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2">
              <button onClick={toggleMute} className="text-slate-300 hover:text-white cursor-pointer">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-xs text-slate-300 font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback speed selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-0.5 text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 rounded-md border border-white/10 transition-colors cursor-pointer"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 py-1 w-24 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 divide-y divide-slate-800">
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRateChange(r)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 transition-colors ${
                        playbackRate === r ? 'text-blue-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {r}x {r === 1 ? '(Normal)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            {document.pictureInPictureEnabled && (
              <button
                onClick={togglePiP}
                className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                title="Picture in Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
