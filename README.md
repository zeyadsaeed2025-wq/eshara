# Real-Time Sign Language Translator
# مترجم لغة الإشارة في الوقت الفعلي

AI-powered Arabic Sign Language Translation System

## 🎯 Overview

Real-time translation of Arabic text into visual sign language using videos or 3D avatars.

## 🚀 Quick Start

### Docker (Recommended)
```bash
docker-compose up -d
```

### Frontend: http://localhost:3000
### Backend API: http://localhost:8000/api/docs

---

## 📁 Project Structure

```
sign-language-translator/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── models/         # Database & Schemas
│   │   ├── routes/         # API Endpoints
│   │   └── services/        # Business Logic
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                # Next.js Frontend
│   ├── app/                # Pages
│   ├── components/         # UI Components
│   ├── lib/                # API & State
│   ├── package.json
│   └── Dockerfile
│
├── media/                  # Sign Language Videos
│   └── videos/
│       ├── letters/        # Arabic letter videos
│       └── words/          # Word/phrase videos
│
└── docker-compose.yml
```

---

## 🏗️ Architecture

```
Frontend (Next.js)          Backend (FastAPI)
┌─────────────────┐         ┌─────────────────┐
│  Voice Input    │────────▶│  Speech-to-Text │
│  Text Input     │         │  (Whisper)      │
│  3D Avatar      │         └────────┬────────┘
└────────┬────────┘                  │
         │                          ▼
         │                 ┌─────────────────┐
         │                 │   Translation   │
         │                 │    Engine       │
         │                 └────────┬────────┘
         │                          │
         ▼                          ▼
┌─────────────────────────────────────────┐
│           MongoDB                        │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
│  │ words   │ │ letters │ │ history  │  │
│  └─────────┘ └─────────┘ └──────────┘  │
└─────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 Speech to Text | Arabic speech recognition |
| ⌨️ Text Input | Direct Arabic text |
| 🤟 Sign Translation | Dictionary-based |
| 🎬 Video Playback | Sequential display |
| 🤖 3D Avatar | Robot with animations |
| 📱 Responsive | Mobile-friendly |

---

## 🔌 API Endpoints

### POST /api/v1/translate
```json
{
  "text": "صباح الخير",
  "source_language": "ar",
  "split_unknown_words": true
}
```

### Response
```json
{
  "original_text": "صباح الخير",
  "translated_signs": [
    {
      "type": "word",
      "value": "صباح الخير",
      "video_path": "/media/videos/words/sabah_al_khair.mp4"
    }
  ],
  "total_signs": 1
}
```

---

## 📚 Dictionary

### Arabic Letters (28)
```
ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي
```

### Common Phrases
- صباح الخير (Good morning)
- مساء الخير (Good evening)
- شكراً (Thank you)
- أهلاً (Hello)
- مع السلامة (Goodbye)
- نعم / لا (Yes / No)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, TailwindCSS |
| 3D Avatar | Three.js, React Three Fiber |
| Backend | FastAPI, Python 3.11 |
| Database | MongoDB |
| AI | OpenAI Whisper |

---

## 🔮 Future Enhancements

- [ ] ASL (American Sign Language) support
- [ ] Real hand gesture detection
- [ ] NLP sentence improvement
- [ ] User accounts
- [ ] Mobile app

---

## 📄 License

MIT License
