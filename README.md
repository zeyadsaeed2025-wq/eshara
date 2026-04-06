# 🤟 ESHARA - Arabic Sign Language Translator

AI-powered Real-time Arabic Sign Language Translation with 3D Avatar

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zeyadsaeed2025-wq/eshara)

## 🚀 Live Demo

**Frontend (Vercel)**: https://eshara.vercel.app
**API (Railway/Render)**: Coming soon

## ✨ Features

| Feature | Status |
|---------|--------|
| 🎤 Speech to Text | ✅ |
| ⌨️ Text Input | ✅ |
| 🤟 Sign Translation | ✅ |
| 🤖 3D Robot Avatar | ✅ |
| 📱 Responsive Design | ✅ |
| 🔄 Real-time Translation | ✅ |

## 📁 Project Structure

```
eshara/
├── backend/              # FastAPI Backend (for production)
├── frontend/            # Next.js 14 Frontend
├── eshara.html          # Standalone HTML (Vercel deploy)
├── media/               # Sign videos & dictionary
├── sgin_letters/        # Arabic letter videos
└── supabase-config.md  # Database setup
```

## 🚀 Deployment Guide

### Option 1: Vercel (Fastest - Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy eshara.html:**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Select the repository
   - Deploy `eshara.html` directly

### Option 2: GitHub Pages

1. Enable GitHub Pages in repository settings
2. Select `main` branch and `/root` folder
3. Access at: `https://zeyadsaeed2025-wq.github.io/eshara`

### Option 3: Full Stack (Frontend + Backend)

#### Frontend (Vercel):
1. Deploy `frontend/` to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL`

#### Backend (Railway/Render):
1. Deploy `backend/` to Railway or Render
2. Connect to MongoDB Atlas
3. Update API URL in frontend

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, TailwindCSS, Three.js |
| Backend | FastAPI, Python |
| Database | MongoDB/Supabase |
| AI | Web Speech API, Whisper |
| Deployment | Vercel, GitHub |

## 📚 Dictionary

### Arabic Letters (28)
```
ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي
```

### Common Phrases
| Arabic | English |
|-------|---------|
| صباح الخير | Good morning |
| مساء الخير | Good evening |
| شكراً | Thank you |
| أهلاً | Hello |
| مع السلامة | Goodbye |
| نعم / لا | Yes / No |

## 🔌 API Endpoints

```
POST /api/v1/speech-to-text
POST /api/v1/translate
GET  /api/v1/dictionary
```

## 📦 Media Files

The `sgin_letters/` folder contains:
- 28 Arabic letter videos
- 10+ phrase videos

## 🐳 Docker (Local Development)

```bash
docker-compose up -d
```

## 📄 License

MIT License - Free to use and modify

## 👨‍💻 Author

**Zeyad Saeed**
- GitHub: [@zeyadsaeed2025-wq](https://github.com/zeyadsaeed2025-wq)

---

<div align="center">
  <p>Made with ❤️ for the Deaf & Hard of Hearing community</p>
  <p>🤟 Breaking barriers through technology</p>
</div>
