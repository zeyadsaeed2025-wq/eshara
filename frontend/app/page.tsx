'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Video, 
  Settings, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import dynamic from 'next/dynamic';
import VoiceRecorder from '@/components/VoiceRecorder';
import TextInput from '@/components/TextInput';
import SignVideoPlayer from '@/components/SignVideoPlayer';
import { useAppStore } from '@/lib/store';
import { SignElement } from '@/lib/api';

// Dynamic import for 3D Avatar (heavy component)
const Avatar3D = dynamic(() => import('@/components/Avatar3D'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">جارِ تحميل الشخصية ثلاثية الأبعاد...</p>
      </div>
    </div>
  ),
});

type TabType = 'voice' | 'text' | 'camera';
type ViewMode = 'video' | 'avatar';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('voice');
  const [viewMode, setViewMode] = useState<ViewMode>('video');
  const [transcript, setTranscript] = useState('');
  const [signs, setSigns] = useState<SignElement[]>([]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef('');
  
  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          translateText(finalTranscript);
          lastTranscriptRef.current = finalTranscript;
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);
  
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Already started');
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const translateText = (text: string) => {
    // Local dictionary translation
    const dictionary: Record<string, { video_path: string; name: string }> = {
      'صباح الخير': { video_path: '/media/videos/words/sabah_al_khair.mp4', name: 'صباح الخير' },
      'مساء الخير': { video_path: '/media/videos/words/masaa_al_khair.mp4', name: 'مساء الخير' },
      'شكرا': { video_path: '/media/videos/words/shukran.mp4', name: 'شكراً' },
      'شكراً': { video_path: '/media/videos/words/shukran.mp4', name: 'شكراً' },
      'أهلاً': { video_path: '/media/videos/words/ahlan.mp4', name: 'أهلاً' },
      'مرحبا': { video_path: '/media/videos/words/marhaba.mp4', name: 'مرحبا' },
      'مع السلامة': { video_path: '/media/videos/words/maa_al_salamah.mp4', name: 'مع السلامة' },
      'السلامة': { video_path: '/media/videos/words/maa_al_salamah.mp4', name: 'السلامة' },
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
    const translatedSigns: SignElement[] = [];
    
    // Check for complete phrase
    if (dictionary[normalizedText]) {
      translatedSigns.push({
        type: 'word',
        value: normalizedText,
        video_path: dictionary[normalizedText].video_path,
        display_name: dictionary[normalizedText].name,
      });
      setSigns(translatedSigns);
      setCurrentSignIndex(0);
      setIsPlaying(true);
      return;
    }
    
    // Split into words
    const words = normalizedText.split(' ');
    
    for (const word of words) {
      if (dictionary[word]) {
        translatedSigns.push({
          type: 'word',
          value: word,
          video_path: dictionary[word].video_path,
          display_name: dictionary[word].name,
        });
      } else {
        // Split into letters
        const arabicLetters = word.match(/[\u0600-\u06FF]/g) || [];
        for (const letter of arabicLetters) {
          translatedSigns.push({
            type: 'letter',
            value: letter,
            video_path: letters[letter] || null,
            display_name: letter,
          });
        }
      }
    }
    
    setSigns(translatedSigns);
    setCurrentSignIndex(0);
    setIsPlaying(true);
  };
  
  const handleTranslation = (newSigns: SignElement[]) => {
    setSigns(newSigns);
    setCurrentSignIndex(0);
    setIsPlaying(true);
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤟</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  مترجم لغة الإشارة
                </h1>
                <p className="text-sm text-slate-500">Real-Time Sign Language Translator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'video' ? 'avatar' : 'video')}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${viewMode === 'video'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }
                `}
              >
                {viewMode === 'video' ? (
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    فيديو
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    روبوت 3D
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sign Display */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              {viewMode === 'video' ? (
                <SignVideoPlayer
                  signs={signs}
                  autoPlay={isPlaying}
                  className="p-4"
                />
              ) : (
                <div className="p-4">
                  <Avatar3D
                    signs={signs}
                    currentIndex={currentSignIndex}
                    isPlaying={isPlaying}
                    className="h-96"
                  />
                </div>
              )}
            </div>
            
            {/* Quick Phrases */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                عبارات سريعة
              </h3>
              <div className="flex flex-wrap gap-2">
                {['صباح الخير', 'مساء الخير', 'شكراً', 'أهلاً', 'مع السلامة', 'نعم', 'لا'].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => translateText(phrase)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Input Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    ${activeTab === 'voice'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Mic className="w-4 h-4" />
                    صوتي
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    ${activeTab === 'text'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    نص
                  </span>
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'voice' && (
                  <div className="space-y-4">
                    <VoiceRecorder />
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        النص المكتشف:
                      </label>
                      <textarea
                        value={transcript}
                        readOnly
                        placeholder="الكلام سيظهر هنا..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-lg resize-none text-slate-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={startListening}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Mic className="w-4 h-4" />
                          ابدأ الاستماع
                        </span>
                      </button>
                      <button
                        onClick={stopListening}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <MicOff className="w-4 h-4" />
                          إيقاف
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <TextInput
                      placeholder="اكتب النص للترجمة..."
                      onTranslation={handleTranslation}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Instructions */}
            {showInstructions && (
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-2">كيفية الاستخدام</h4>
                    <ol className="text-sm space-y-1 opacity-90">
                      <li>1. اختر إدخال صوتي أو نص</li>
                      <li>2. اضغط على الميكروفون أو اكتب</li>
                      <li>3. شاهد الترجمة بلغة الإشارة</li>
                      <li>4. استخدم الروبوت 3D للتبديل</li>
                    </ol>
                  </div>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                قاعدة البيانات
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-500">28</div>
                  <div className="text-xs text-slate-500">حرف عربي</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-500">20+</div>
                  <div className="text-xs text-slate-500">كلمة وجملة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>مترجم لغة الإشارة - AI Sign Language Translator</p>
          <p className="mt-1">دعم اللغة العربية - Arabic Sign Language Support</p>
        </div>
      </footer>
    </main>
  );
}
