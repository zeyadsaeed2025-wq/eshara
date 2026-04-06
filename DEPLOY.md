# 🚀 DEPLOYMENT GUIDE - ESHARA

## 📦 Quick Deploy (3 Steps)

---

## STEP 1: Deploy Frontend to Vercel (5 minutes)

### Option A: Deploy eshara.html (Fastest - RECOMMENDED)

1. Go to: **https://vercel.com/new**
2. Click **"Import Third-Party Git Repository"**
3. OR: Just drag & drop the `eshara.html` file

### Option B: Deploy Next.js Frontend

1. Go to: **https://vercel.com/new**
2. Import from GitHub: `zeyadsaeed2025-wq/eshara`
3. Select `frontend/` folder
4. Deploy!

---

## STEP 2: Deploy Backend to Railway (10 minutes)

1. Go to: **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Select `eshara` repository
5. Select `backend/` folder
6. Add Environment Variables:
   - `MONGO_URL=mongodb://localhost:27017`
   - OR connect to MongoDB Atlas

7. Click **Deploy**

---

## STEP 3: Get Your Links!

### After deployment, you'll have:

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Vercel) | `https://eshara.vercel.app` | 🚀 LIVE |
| Backend API (Railway) | `https://eshara-api.railway.app` | 🚀 LIVE |

---

## 🔧 Alternative: Supabase for Backend

### 1. Create Supabase Project
1. Go to: **https://supabase.com**
2. Create new project
3. Get your **Project URL** and **anon/public key** from Settings → API

### 2. Run SQL in Supabase SQL Editor
```sql
-- Create tables
CREATE TABLE letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  letter VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100),
  video_path TEXT
);

CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word VARCHAR(255) NOT NULL UNIQUE,
  translation VARCHAR(255),
  category VARCHAR(100),
  video_path TEXT
);

-- Insert letters
INSERT INTO letters (letter, name, video_path) VALUES
('ا', 'alif', '/sgin_letters/ا.mp4'),
('ب', 'ba', '/sgin_letters/ب.mp4'),
('ت', 'ta', '/sgin_letters/ت.mp4'),
-- ... (add all 28 letters)
('ي', 'ya', '/sgin_letters/ي.mp4');

-- Insert words
INSERT INTO words (word, translation, category, video_path) VALUES
('صباح الخير', 'good_morning', 'greeting', '/sgin_letters/صباح الخير.mp4'),
('مساء الخير', 'good_evening', 'greeting', '/sgin_letters/مساء الخير.mp4'),
('شكرا', 'thank_you', 'expression', '/sgin_letters/شكرا.mp4'),
('أهلاً', 'hello', 'greeting', '/sgin_letters/أهلاً.mp4'),
('مع السلامة', 'goodbye', 'greeting', '/sgin_letters/مع السلامة.mp4'),
('نعم', 'yes', 'basic', '/sgin_letters/نعم.mp4'),
('لا', 'no', 'basic', '/sgin_letters/لا.mp4');
```

### 3. Update Frontend API URL
In `frontend/lib/api.ts`, update:
```typescript
const API_BASE_URL = 'https://your-supabase-url.supabase.co/functions/v1';
```

---

## 📁 Final Links Format

```
Frontend (Vercel):    https://eshara.vercel.app
Backend API (Railway): https://eshara-api.railway.app
Docs:                 https://eshara-api.railway.app/docs
```

---

## 🎉 That's It!

Your ESHARA app is now live!

```diff
+ Frontend: https://eshara.vercel.app
+ Backend:  https://eshara-api.railway.app (or your URL)
+ GitHub:   https://github.com/zeyadsaeed2025-wq/eshara
```

---

## ❓ Troubleshooting

### Vercel Error?
- Make sure `frontend/` has `package.json`
- Check build logs in Vercel dashboard

### Backend Error?
- Check Railway logs
- Verify MongoDB connection string
- Enable CORS in FastAPI

### Videos Not Loading?
- Videos are in `sgin_letters/` folder
- Move videos to `public/sgin_letters/` for Vercel
