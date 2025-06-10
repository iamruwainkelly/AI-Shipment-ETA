# 🚀 AI Shipment ETA Predictor - Vercel Deployment Guide

## Step 1: Deploy to Vercel

### 1.1 Vercel Dashboard Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New → Project"**
3. Import your `AI-Shipment-ETA` repository from GitHub
4. Configure the following settings:

### 1.2 Project Configuration
- **Framework Preset**: Vue.js
- **Root Directory**: `.` (Leave as root, not /frontend)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 1.3 Environment Variables
Add these environment variables in Vercel Dashboard under **Settings → Environment Variables**:

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_MAP_PROVIDER=openstreetmap
NODE_ENV=production
```

### 1.4 Deploy
Click **"Deploy"** - Vercel will automatically build and deploy your app.

**Expected URL**: `https://ai-shipment-eta-[random].vercel.app`

---

## Step 2: Backend Deployment (Optional)

For a fully functional demo, you'll need to deploy the FastAPI backend. Options:

### 2.1 Vercel Serverless Functions
- Create `api/` folder in root
- Add FastAPI endpoints as serverless functions
- Update CORS settings

### 2.2 Railway/Render/Heroku
- Deploy backend separately
- Update `VITE_API_BASE_URL` to backend URL

### 2.3 Mock API (Quick Demo)
- Use local mock data
- Set `VITE_API_BASE_URL` to a mock API service

---

## Step 3: Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain: `ai-shipment-eta.ruwainkelly.com`
3. Configure DNS settings as instructed

---

## Step 4: Performance Optimization

### 4.1 Build Optimization
The project is already configured with:
- ✅ Vite build optimization
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Tree shaking

### 4.2 Vercel Features
- ✅ Edge Functions enabled
- ✅ Image optimization
- ✅ Static file caching
- ✅ Gzip compression

---

## Step 5: Post-Deployment Testing

### 5.1 Functionality Checklist
- [ ] App loads successfully
- [ ] Navigation works (Dashboard, Shipments, Clients, Vendors)
- [ ] Theme toggle works
- [ ] Maps render correctly
- [ ] Forms are functional
- [ ] Export features work

### 5.2 Performance Checklist
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Fast loading times
- [ ] No console errors

---

## Troubleshooting

### Common Issues

**Build Fails**:
- Check package.json dependencies
- Verify Node.js version (18+)
- Review build logs in Vercel

**Maps Not Loading**:
- Verify Leaflet.js configuration
- Check HTTPS compatibility

**API Errors**:
- Update CORS settings in backend
- Verify environment variables
- Check network requests in DevTools

---

## Live Demo URLs

Once deployed, update these in your portfolio:

- **Demo URL**: `https://ai-shipment-eta-[your-id].vercel.app`
- **GitHub**: `https://github.com/iamruwainkelly/AI-Shipment-ETA`

---

## Deployment Status: Ready ✅

The AI Shipment ETA Predictor is fully configured for Vercel deployment with:
- ✅ Vercel configuration file
- ✅ Build scripts configured
- ✅ Environment variables documented
- ✅ Production optimizations
- ✅ Responsive design
- ✅ Professional documentation
