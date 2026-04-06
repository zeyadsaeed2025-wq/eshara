'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SignElement } from '@/lib/api';

interface SignVideoPlayerProps {
  signs: SignElement[];
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function SignVideoPlayer({
  signs,
  autoPlay = false,
  showControls = true,
  className = '',
}: SignVideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { setCurrentSignIndex, setIsPlaying: storeSetPlaying } = useAppStore();
  
  const currentSign = signs[currentIndex];
  
  // Handle video end
  const handleVideoEnd = useCallback(() => {
    if (currentIndex < signs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSignIndex(nextIndex);
    } else {
      setIsPlaying(false);
      setIsPlaying(false);
      storeSetPlaying(false);
    }
  }, [currentIndex, signs.length, setCurrentSignIndex, storeSetPlaying]);
  
  // Auto-play when signs change
  useEffect(() => {
    if (autoPlay && signs.length > 0 && !isPlaying) {
      setIsPlaying(true);
      storeSetPlaying(true);
    }
  }, [signs, autoPlay, isPlaying, storeSetPlaying]);
  
  // Control video playback
  useEffect(() => {
    if (videoRef.current && currentSign?.video_path) {
      videoRef.current.src = currentSign.video_path;
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [currentIndex, currentSign, isPlaying]);
  
  const play = () => {
    setIsPlaying(true);
    storeSetPlaying(true);
    videoRef.current?.play().catch(console.error);
  };
  
  const pause = () => {
    setIsPlaying(false);
    storeSetPlaying(false);
    videoRef.current?.pause();
  };
  
  const restart = () => {
    setCurrentIndex(0);
    setCurrentSignIndex(0);
    if (currentSign?.video_path) {
      videoRef.current?.play().catch(console.error);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentSignIndex(newIndex);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < signs.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentSignIndex(newIndex);
    }
  };

  if (signs.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center
        bg-slate-100 dark:bg-slate-800
        rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700
        ${className}
      `}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🤟</div>
          <p className="text-slate-500">قم بإدخال النص لعرض لغة الإشارة</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Video Display Area */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video">
        {/* Current Sign Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentSign?.video_path ? (
            <video
              ref={videoRef}
              key={currentIndex}
              className="max-w-full max-h-full object-contain"
              playsInline
              onEnded={handleVideoEnd}
              onLoadedData={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
            >
              <source src={currentSign.video_path} type="video/mp4" />
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <span className="text-8xl font-bold">{currentSign?.value}</span>
              <span className="text-slate-400 mt-2">لا يتوفر فيديو</span>
            </div>
          )}
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Sign Counter Badge */}
        <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {signs.length}
        </div>
        
        {/* Current Sign Label */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 px-4 py-2 rounded-xl">
          <p className="text-white text-lg font-medium text-center">
            {currentSign?.display_name || currentSign?.value}
          </p>
          <p className="text-slate-400 text-sm text-center">
            {currentSign?.type === 'word' ? 'كلمة' : 'حرف'}
          </p>
        </div>
      </div>
      
      {/* Video Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={restart}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="إعادة"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="السابق"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={isPlaying ? pause : play}
            className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            title={isPlaying ? 'إيقاف' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={goToNext}
            disabled={currentIndex === signs.length - 1}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="التالي"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* Sign Sequence Preview */}
      <div className="mt-4">
        <p className="text-sm text-slate-500 mb-2">تسلسل الإشارات:</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {signs.map((sign, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentSignIndex(index);
              }}
              className={`
                flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${index === currentIndex
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
              `}
            >
              {sign.display_name || sign.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
