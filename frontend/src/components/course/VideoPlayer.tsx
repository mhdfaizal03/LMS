import React, { useRef, useEffect, useState } from 'react';
import { enrollmentApi } from '../../api';
import { useNotification } from '../../context/NotificationContext';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: number;
  initialPosition?: number;
  isCompleted?: boolean;
  onLessonCompleted?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  lessonId,
  initialPosition = 0,
  isCompleted = false,
  onLessonCompleted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { showToast } = useNotification();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(isCompleted);
  const lastSavedTime = useRef<number>(0);

  useEffect(() => {
    setCompleted(isCompleted);
    if (videoRef.current && initialPosition > 0) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [lessonId, initialPosition, isCompleted]);

  // Sync progress every 15 seconds
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = Math.floor(videoRef.current.currentTime);
    setCurrentTime(current);

    if (Math.abs(current - lastSavedTime.current) >= 15) {
      lastSavedTime.current = current;
      enrollmentApi.updateProgress(lessonId, {
        is_completed: completed,
        last_position_seconds: current,
      }).catch(console.error);
    }
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    setCompleted(true);
    try {
      await enrollmentApi.updateProgress(lessonId, {
        is_completed: true,
        last_position_seconds: Math.floor(duration),
      });
      showToast('🎉 Lesson completed!', 'success');
      if (onLessonCompleted) onLessonCompleted();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const target = Number(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000000',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ width: '100%', maxHeight: '550px', display: 'block', cursor: 'pointer' }}
        onClick={togglePlay}
        controls
      />
    </div>
  );
};
