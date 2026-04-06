# 🚀 ESHARA Deployment Instructions

## Step 1: Get Vercel Token

1. Go to: **https://vercel.com/account/tokens**
2. Click **"Create Token"**
3. Name it: `eshara-deploy`
4. Copy the token (starts with `xxxxxxxx`)

---

## Step 2: Add Token to GitHub

1. Go to: **https://github.com/zeyadsaeed2025-wq/eshara/settings/secrets/actions**
2. Click **"New repository secret"**
3. Name: `VERCEL_TOKEN`
4. Paste your token
5. Click **Add secret**

---

## Step 3: Trigger Deployment

1. Go to: **https://github.com/zeyadsaeed2025-wq/eshara/actions**
2. You should see "Deploy Frontend" workflow
3. Click **"Run workflow"**
4. Wait 2-3 minutes

---

## Step 4: Get Your Link!

After deployment completes:
1. Go to Vercel Dashboard: **https://vercel.com/dashboard**
2. Find your project
3. Copy the URL (e.g., `https://eshara.vercel.app`)

---

## 🎉 Your Links:

```
Frontend: https://eshara.vercel.app (or your-custom-url)
GitHub: https://github.com/zeyadsaeed2025-wq/eshara
```

---

## Quick Video Guide:

1. Open: https://vercel.com/account/tokens
2. Create token → Copy
3. Open: https://github.com/zeyadsaeed2025-wq/eshara/settings/secrets/actions
4. New secret → VERCEL_TOKEN → Paste
5. Go to Actions tab → Run workflow
6. Wait and get your link!

---

## ❓ Need Help?

If deployment fails, check:
- Vercel token is correct
- GitHub Actions secrets are set
- Check Actions tab for error logs
