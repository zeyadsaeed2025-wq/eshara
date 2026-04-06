const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Sign Language Dictionary
const signDictionary = {
  letters: {
    'ا': { name: 'الألف', video: '/sgin_letters/ا.mp4' },
    'ب': { name: 'الباء', video: '/sgin_letters/ب.mp4' },
    'ت': { name: 'التاء', video: '/sgin_letters/ت.mp4' },
    'ث': { name: 'الثاء', video: '/sgin_letters/ث.mp4' },
    'ج': { name: 'الجيم', video: '/sgin_letters/ج.mp4' },
    'ح': { name: 'الحاء', video: '/sgin_letters/ح.mp4' },
    'خ': { name: 'الخاء', video: '/sgin_letters/خ.mp4' },
    'د': { name: 'الدال', video: '/sgin_letters/د.mp4' },
    'ذ': { name: 'الذال', video: '/sgin_letters/ذ.mp4' },
    'ر': { name: 'الراء', video: '/sgin_letters/ر.mp4' },
    'ز': { name: 'الزاي', video: '/sgin_letters/ز.mp4' },
    'س': { name: 'السين', video: '/sgin_letters/س.mp4' },
    'ش': { name: 'الشين', video: '/sgin_letters/ش.mp4' },
    'ص': { name: 'الصاد', video: '/sgin_letters/ص.mp4' },
    'ض': { name: 'الضاد', video: '/sgin_letters/ض.mp4' },
    'ط': { name: 'الطاء', video: '/sgin_letters/ط.mp4' },
    'ظ': { name: 'الظاء', video: '/sgin_letters/ظ.mp4' },
    'ع': { name: 'العين', video: '/sgin_letters/ع.mp4' },
    'غ': { name: 'الغين', video: '/sgin_letters/غ.mp4' },
    'ف': { name: 'الفاء', video: '/sgin_letters/ف.mp4' },
    'ق': { name: 'القاف', video: '/sgin_letters/ق.mp4' },
    'ك': { name: 'الكاف', video: '/sgin_letters/ك.mp4' },
    'ل': { name: 'اللام', video: '/sgin_letters/ل.mp4' },
    'م': { name: 'الميم', video: '/sgin_letters/م.mp4' },
    'ن': { name: 'النون', video: '/sgin_letters/ن.mp4' },
    'ه': { name: 'الهاء', video: '/sgin_letters/ه.mp4' },
    'و': { name: 'الواو', video: '/sgin_letters/و.mp4' },
    'ي': { name: 'الياء', video: '/sgin_letters/ي.mp4' }
  },
  phrases: {
    'صباح الخير': { name: 'صباح الخير', video: '/sgin_letters/صباح الخير.mp4' },
    'مساء الخير': { name: 'مساء الخير', video: '/sgin_letters/مساء الخير.mp4' },
    'شكرا': { name: 'شكراً', video: '/sgin_letters/شكرا.mp4' },
    'شكراً': { name: 'شكراً', video: '/sgin_letters/شكرا.mp4' },
    'أهلاً': { name: 'أهلاً', video: '/sgin_letters/أهلاً.mp4' },
    'مرحبا': { name: 'مرحبا', video: '/sgin_letters/مرحبا.mp4' },
    'مع السلامة': { name: 'مع السلامة', video: '/sgin_letters/مع السلامة.mp4' },
    'السلامة': { name: 'السلامة', video: '/sgin_letters/السلامة.mp4' },
    'نعم': { name: 'نعم', video: '/sgin_letters/نعم.mp4' },
    'لا': { name: 'لا', video: '/sgin_letters/لا.mp4' }
  }
};

function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/إ|أ|آ/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function translate(text) {
  const normalized = normalizeArabic(text);
  const signs = [];
  
  if (signDictionary.phrases[normalized]) {
    signs.push({ type: 'phrase', value: normalized, ...signDictionary.phrases[normalized] });
    return { signs, mode: 'phrase' };
  }
  
  const words = normalized.split(' ');
  for (const word of words) {
    if (signDictionary.phrases[word]) {
      signs.push({ type: 'phrase', value: word, ...signDictionary.phrases[word] });
    } else {
      const arabicChars = word.match(/[\u0600-\u06FF]/g) || [];
      for (const char of arabicChars) {
        if (signDictionary.letters[char]) {
          signs.push({ type: 'letter', value: char, ...signDictionary.letters[char] });
        }
      }
    }
  }
  
  return { signs, mode: 'mixed' };
}

app.get('/api', (req, res) => {
  res.json({ status: 'ok', service: 'ESHARA API', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/translate', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    
    const result = translate(text);
    res.json({
      original_text: text,
      translated_signs: result.signs,
      total_signs: result.signs.length,
      translation_mode: result.mode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dictionary', (req, res) => {
  res.json({
    letters: Object.entries(signDictionary.letters).map(([key, value]) => ({ letter: key, ...value })),
    phrases: Object.entries(signDictionary.phrases).map(([key, value]) => ({ word: key, ...value })),
    total_letters: Object.keys(signDictionary.letters).length,
    total_phrases: Object.keys(signDictionary.phrases).length
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
