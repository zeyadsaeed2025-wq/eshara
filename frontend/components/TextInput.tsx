'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translationApi } from '@/lib/api';

interface TextInputProps {
  placeholder?: string;
  onTranslation?: (signs: any[]) => void;
}

export default function TextInput({ 
  placeholder = 'اكتب النص هنا...',
  onTranslation 
}: TextInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { setOriginalText, setSigns, setTranslationError } = useAppStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setOriginalText(text);
    
    try {
      // Try backend API first
      const response = await translationApi.translate({
        text: text,
        source_language: 'ar',
        split_unknown_words: true,
      });
      
      setSigns(response.translated_signs, response.translation_mode);
      onTranslation?.(response.translated_signs);
      
    } catch (err) {
      console.error('Translation error:', err);
      
      // Fallback: client-side translation with local dictionary
      const fallbackSigns = translateLocally(text);
      setSigns(fallbackSigns, 'mixed');
      onTranslation?.(fallbackSigns);
    } finally {
      setIsLoading(false);
    }
  };

  const translateLocally = (inputText: string) => {
    // Local dictionary for demo (same as backend)
    const dictionary: Record<string, { video_path: string; name: string }> = {
      'صباح الخير': { video_path: '/media/videos/words/sabah_al_khair.mp4', name: 'صباح الخير' },
      'مساء الخير': { video_path: '/media/videos/words/masaa_al_khair.mp4', name: 'مساء الخير' },
      'شكرا': { video_path: '/media/videos/words/shukran.mp4', name: 'شكراً' },
      'أهلاً': { video_path: '/media/videos/words/ahlan.mp4', name: 'أهلاً' },
      'مع السلامة': { video_path: '/media/videos/words/maa_al_salamah.mp4', name: 'مع السلامة' },
      'نعم': { video_path: '/media/videos/words/naam.mp4', name: 'نعم' },
      'لا': { video_path: '/media/videos/words/laa.mp4', name: 'لا' },
    };
    
    const letters: Record<string, string> = {
      'ا': '/media/videos/letters/alif.mp4',
      'ب': '/media/videos/letters/ba.mp4',
      'ت': '/media/videos/letters/ta.mp4',
      'ث': '/media/videos/letters/tha.mp4',
      'ج': '/media/videos/letters/jeem.mp4',
      'ح': '/media/videos/letters/ha.mp4',
      'خ': '/media/videos/letters/kha.mp4',
      'د': '/media/videos/letters/dal.mp4',
      'ذ': '/media/videos/letters/dhal.mp4',
      'ر': '/media/videos/letters/ra.mp4',
      'ز': '/media/videos/letters/zay.mp4',
      'س': '/media/videos/letters/sin.mp4',
      'ش': '/media/videos/letters/shin.mp4',
      'ص': '/media/videos/letters/sad.mp4',
      'ض': '/media/videos/letters/dad.mp4',
      'ط': '/media/videos/letters/taa.mp4',
      'ظ': '/media/videos/letters/zaa.mp4',
      'ع': '/media/videos/letters/ain.mp4',
      'غ': '/media/videos/letters/ghain.mp4',
      'ف': '/media/videos/letters/fa.mp4',
      'ق': '/media/videos/letters/qaf.mp4',
      'ك': '/media/videos/letters/kaf.mp4',
      'ل': '/media/videos/letters/lam.mp4',
      'م': '/media/videos/letters/meem.mp4',
      'ن': '/media/videos/letters/noon.mp4',
      'ه': '/media/videos/letters/haa.mp4',
      'و': '/media/videos/letters/waw.mp4',
      'ي': '/media/videos/letters/ya.mp4',
    };
    
    const normalizedText = text.trim().toLowerCase();
    const signs: any[] = [];
    
    // Check for complete phrase
    if (dictionary[normalizedText]) {
      signs.push({
        type: 'word',
        value: normalizedText,
        video_path: dictionary[normalizedText].video_path,
        display_name: dictionary[normalizedText].name,
      });
      return signs;
    }
    
    // Split into words and letters
    const words = normalizedText.split(' ');
    
    for (const word of words) {
      if (dictionary[word]) {
        signs.push({
          type: 'word',
          value: word,
          video_path: dictionary[word].video_path,
          display_name: dictionary[word].name,
        });
      } else {
        // Split into letters
        const arabicLetters = word.match(/[\u0600-\u06FF]/g) || [];
        for (const letter of arabicLetters) {
          signs.push({
            type: 'letter',
            value: letter,
            video_path: letters[letter] || null,
            display_name: letter,
          });
        }
      }
    }
    
    return signs;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full p-4 pr-12 rounded-xl
            bg-white dark:bg-slate-800
            border-2 border-slate-200 dark:border-slate-700
            focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
            resize-none outline-none
            text-slate-900 dark:text-white
            placeholder-slate-400
            transition-all duration-200
          "
          rows={2}
        />
        
        <button
          onClick={handleTranslate}
          disabled={!text.trim() || isLoading}
          className="
            absolute left-2 bottom-2
            w-10 h-10 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-blue-500 hover:bg-blue-600
            text-white
          "
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      
      <p className="mt-2 text-xs text-slate-400">
        اضغط Enter للترجمة أو Shift+Enter لسطر جديد
      </p>
    </div>
  );
}
