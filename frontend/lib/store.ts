/**
 * Global State Management with Zustand
 */

import { create } from 'zustand';
import { SignElement } from './api';

interface TranscriptionState {
  isRecording: boolean;
  audioLevel: number;
  transcript: string;
  error: string | null;
}

interface TranslationState {
  originalText: string;
  signs: SignElement[];
  currentSignIndex: number;
  isPlaying: boolean;
  translationMode: string | null;
  error: string | null;
}

interface AppState {
  // Transcription
  transcription: TranscriptionState;
  startRecording: () => void;
  stopRecording: () => void;
  setAudioLevel: (level: number) => void;
  setTranscript: (text: string) => void;
  setTranscriptionError: (error: string | null) => void;

  // Translation
  translation: TranslationState;
  setOriginalText: (text: string) => void;
  setSigns: (signs: SignElement[], mode: string) => void;
  setCurrentSignIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setTranslationError: (error: string | null) => void;
  resetTranslation: () => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: 'voice' | 'text' | 'camera';
  setActiveTab: (tab: 'voice' | 'text' | 'camera') => void;
  showAvatar: boolean;
  setShowAvatar: (show: boolean) => void;
}

const initialTranscriptionState: TranscriptionState = {
  isRecording: false,
  audioLevel: 0,
  transcript: '',
  error: null,
};

const initialTranslationState: TranslationState = {
  originalText: '',
  signs: [],
  currentSignIndex: 0,
  isPlaying: false,
  translationMode: null,
  error: null,
};

export const useAppStore = create<AppState>((set) => ({
  // Transcription
  transcription: initialTranscriptionState,
  
  startRecording: () => set((state) => ({
    transcription: { ...state.transcription, isRecording: true, error: null }
  })),
  
  stopRecording: () => set((state) => ({
    transcription: { ...state.transcription, isRecording: false }
  })),
  
  setAudioLevel: (level: number) => set((state) => ({
    transcription: { ...state.transcription, audioLevel: level }
  })),
  
  setTranscript: (text: string) => set((state) => ({
    transcription: { ...state.transcription, transcript: text }
  })),
  
  setTranscriptionError: (error: string | null) => set((state) => ({
    transcription: { ...state.transcription, error }
  })),

  // Translation
  translation: initialTranslationState,
  
  setOriginalText: (text: string) => set((state) => ({
    translation: { ...state.translation, originalText: text }
  })),
  
  setSigns: (signs: SignElement[], mode: string) => set((state) => ({
    translation: { ...state.translation, signs, translationMode: mode, currentSignIndex: 0 }
  })),
  
  setCurrentSignIndex: (index: number) => set((state) => ({
    translation: { ...state.translation, currentSignIndex: index }
  })),
  
  setIsPlaying: (playing: boolean) => set((state) => ({
    translation: { ...state.translation, isPlaying: playing }
  })),
  
  setTranslationError: (error: string | null) => set((state) => ({
    translation: { ...state.translation, error }
  })),
  
  resetTranslation: () => set(() => ({
    translation: initialTranslationState
  })),

  // UI State
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  
  activeTab: 'voice',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  showAvatar: false,
  setShowAvatar: (show) => set({ showAvatar: show }),
}));
