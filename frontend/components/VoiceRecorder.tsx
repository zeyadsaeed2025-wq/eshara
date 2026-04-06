'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface VoiceRecorderProps {
  onTranscriptChange?: (text: string) => void;
  continuous?: boolean;
}

export default function VoiceRecorder({ 
  onTranscriptChange,
  continuous = false 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { 
    startRecording: storeStartRecording, 
    stopRecording: storeStopRecording,
    setTranscript,
    setTranscriptionError
  } = useAppStore();

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedLevel = Math.min(100, (average / 128) * 100);
    
    setAudioLevel(normalizedLevel);
    
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });

      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const audioBase64 = base64data.split(',')[1];
          
          try {
            // In production, send to backend API
            // const response = await speechApi.toText({
            //   audio_data: audioBase64,
            //   language: 'ar',
            //   sample_rate: 16000,
            // });
            
            // For MVP demo, we'll use Web Speech API directly
            // This is handled separately in the component
            console.log('Audio data ready for processing');
          } catch (error) {
            console.error('Speech processing error:', error);
            setTranscriptionError('فشل في معالجة الصوت');
          } finally {
            setIsProcessing(false);
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      storeStartRecording();
      updateAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
      setTranscriptionError('فشل في الوصول إلى الميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      storeStopRecording();
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Recording Button */}
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 transform
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 recording' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            shadow-lg hover:shadow-xl
          `}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Audio Level Indicator */}
        {isRecording && (
          <div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            style={{ width: `${Math.max(20, audioLevel)}%` }}
          >
            <div className="h-1 bg-green-400 rounded-full transition-all duration-100" />
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        {isProcessing ? (
          <p className="text-sm text-gray-500 animate-pulse">جارِ المعالجة...</p>
        ) : isRecording ? (
          <p className="text-sm text-red-500 font-medium animate-pulse">
            جارِ التسجيل...
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            اضغط للتسجيل
          </p>
        )}
      </div>

      {/* Visual Audio Waveform (simplified) */}
      {isRecording && (
        <div className="flex items-center gap-1 h-12">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-blue-500 rounded-full transition-all duration-75"
              style={{
                height: `${Math.random() * 40 + 10}%`,
                opacity: audioLevel > i * 5 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
