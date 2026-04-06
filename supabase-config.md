# Supabase Configuration
# Used for MongoDB replacement with Supabase PostgreSQL

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

# Supabase Setup Instructions

1. Go to https://supabase.com
2. Create a new project
3. Get your URL and keys from Settings > API
4. Update the .env file with your credentials

## Database Schema for Supabase

Run this SQL in Supabase SQL Editor:

```sql
-- Create words table
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(255) NOT NULL UNIQUE,
  translation VARCHAR(255),
  category VARCHAR(100),
  video_path TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create letters table
CREATE TABLE letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  letter VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100),
  category VARCHAR(50),
  video_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translation history table
CREATE TABLE translation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_text TEXT NOT NULL,
  translated_signs JSONB,
  translation_mode VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_category ON words(category);
CREATE INDEX idx_letters_letter ON letters(letter);
CREATE INDEX idx_translation_history_created ON translation_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON words FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON letters FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON translation_history FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON translation_history FOR INSERT WITH CHECK (true);
```

## Seed Data

```sql
-- Insert Arabic letters
INSERT INTO letters (letter, name, category, video_path) VALUES
('ا', 'alif', 'letter', '/media/videos/letters/alif.mp4'),
('ب', 'ba', 'letter', '/media/videos/letters/ba.mp4'),
('ت', 'ta', 'letter', '/media/videos/letters/ta.mp4'),
('ث', 'tha', 'letter', '/media/videos/letters/tha.mp4'),
('ج', 'jeem', 'letter', '/media/videos/letters/jeem.mp4'),
('ح', 'ha', 'letter', '/media/videos/letters/ha.mp4'),
('خ', 'kha', 'letter', '/media/videos/letters/kha.mp4'),
('د', 'dal', 'letter', '/media/videos/letters/dal.mp4'),
('ذ', 'dhal', 'letter', '/media/videos/letters/dhal.mp4'),
('ر', 'ra', 'letter', '/media/videos/letters/ra.mp4'),
('ز', 'zay', 'letter', '/media/videos/letters/zay.mp4'),
('س', 'sin', 'letter', '/media/videos/letters/sin.mp4'),
('ش', 'shin', 'letter', '/media/videos/letters/shin.mp4'),
('ص', 'sad', 'letter', '/media/videos/letters/sad.mp4'),
('ض', 'dad', 'letter', '/media/videos/letters/dad.mp4'),
('ط', 'taa', 'letter', '/media/videos/letters/taa.mp4'),
('ظ', 'zaa', 'letter', '/media/videos/letters/zaa.mp4'),
('ع', 'ain', 'letter', '/media/videos/letters/ain.mp4'),
('غ', 'ghain', 'letter', '/media/videos/letters/ghain.mp4'),
('ف', 'fa', 'letter', '/media/videos/letters/fa.mp4'),
('ق', 'qaf', 'letter', '/media/videos/letters/qaf.mp4'),
('ك', 'kaf', 'letter', '/media/videos/letters/kaf.mp4'),
('ل', 'lam', 'letter', '/media/videos/letters/lam.mp4'),
('م', 'meem', 'letter', '/media/videos/letters/meem.mp4'),
('ن', 'noon', 'letter', '/media/videos/letters/noon.mp4'),
('ه', 'haa', 'letter', '/media/videos/letters/haa.mp4'),
('و', 'waw', 'letter', '/media/videos/letters/waw.mp4'),
('ي', 'ya', 'letter', '/media/videos/letters/ya.mp4');

-- Insert common words
INSERT INTO words (word, translation, category, video_path, description) VALUES
('صباح الخير', 'good_morning', 'greeting', '/media/videos/words/sabah_al_khair.mp4', 'Good morning'),
('مساء الخير', 'good_evening', 'greeting', '/media/videos/words/masaa_al_khair.mp4', 'Good evening'),
('شكراً', 'thank_you', 'expression', '/media/videos/words/shukran.mp4', 'Thank you'),
('أهلاً', 'hello', 'greeting', '/media/videos/words/ahlan.mp4', 'Hello'),
('مرحبا', 'welcome', 'greeting', '/media/videos/words/marhaba.mp4', 'Welcome'),
('مع السلامة', 'goodbye', 'greeting', '/media/videos/words/maa_al_salamah.mp4', 'Goodbye'),
('نعم', 'yes', 'basic', '/media/videos/words/naam.mp4', 'Yes'),
('لا', 'no', 'basic', '/media/videos/words/laa.mp4', 'No'),
('من فضلك', 'please', 'expression', '/media/videos/words/min_fadlak.mp4', 'Please'),
('كيف حالك', 'how_are_you', 'question', '/media/videos/words/kayf_halak.mp4', 'How are you?'),
('أنا بخير', 'i_am_fine', 'response', '/media/videos/words/ana_bekhair.mp4', 'I am fine'),
('أعتذر', 'sorry', 'expression', '/media/videos/words/aatadir.mp4', 'Sorry'),
('أريد المساعدة', 'i_need_help', 'request', '/media/videos/words/ureed_al_musaada.mp4', 'I need help');
