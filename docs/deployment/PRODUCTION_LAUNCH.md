# 🚀 **Agent Synergy Production Launch Guide**

## 🎯 **Target Domain: agentsynergy.rastogiventuresllc.com**

### **Phase 1: Database Setup (CRITICAL)**

#### **Step 1: Set Up Supabase**
1. **Create Supabase Project:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project: `agent-synergy-prod`
   - Choose region closest to your users
   - Set strong database password

2. **Get Production Credentials:**
   - Go to Settings → API
   - Copy: Project URL, Anon Key, Service Role Key
   - Save these securely

3. **Create Database Tables:**
   - Go to SQL Editor in Supabase
   - Run the complete SQL schema from `SUPABASE_SETUP.md`
   - This creates all tables with proper relationships

#### **Step 2: Configure Environment Variables**
Create production `.env` file:

```bash
# Production Environment
ENVIRONMENT=production
DEBUG=false

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Security (Generate strong keys)
SECRET_KEY=your-very-strong-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Domain Configuration
ALLOWED_ORIGINS=https://agentsynergy.rastogiventuresllc.com,https://www.agentsynergy.rastogiventuresllc.com

# Optional: OpenAI Integration
OPENAI_API_KEY=your-openai-key-here
```

### **Phase 2: Backend Deployment**

#### **Option A: Vercel (Recommended)**
1. **Connect GitHub Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - Framework Preset: Other
     - Build Command: `cd backend && pip install -r requirements.txt && python run.py`
     - Output Directory: `backend`

2. **Environment Variables:**
   - Add all production environment variables in Vercel dashboard
   - Set `ENVIRONMENT=production`

3. **Custom Domain:**
   - Add custom domain: `api.agentsynergy.rastogiventuresllc.com`
   - Configure DNS records

#### **Option B: Railway/Heroku**
1. **Deploy Backend:**
   - Connect repository to Railway/Heroku
   - Set environment variables
   - Deploy

### **Phase 3: Frontend Deployment**

#### **Deploy Web App to Vercel:**
1. **Connect Repository:**
   - Go to Vercel dashboard
   - Import your repository
   - Set build settings:
     - Framework Preset: Next.js
     - Root Directory: `web-app`
     - Build Command: `npm run build`
     - Output Directory: `.next`

2. **Environment Variables:**
   ```bash
   NEXT_PUBLIC_API_URL=https://api.agentsynergy.rastogiventuresllc.com
   NEXT_PUBLIC_APP_URL=https://agentsynergy.rastogiventuresllc.com
   ```

3. **Custom Domain:**
   - Add domain: `agentsynergy.rastogiventuresllc.com`
   - Configure DNS records

### **Phase 4: Mobile App Deployment**

#### **Android App Store:**
1. **Build Production APK:**
   ```bash
   cd mobile-app
   npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
   cd android && ./gradlew assembleRelease
   ```

2. **Upload to Google Play Console:**
   - Create developer account
   - Upload APK
   - Configure app details
   - Submit for review

#### **iOS App Store:**
1. **Build Production IPA:**
   ```bash
   cd mobile-app/ios
   xcodebuild -workspace TempMobileApp.xcworkspace -scheme TempMobileApp -configuration Release -archivePath TempMobileApp.xcarchive archive
   xcodebuild -exportArchive -archivePath TempMobileApp.xcarchive -exportOptionsPlist exportOptions.plist -exportPath ./build
   ```

2. **Upload to App Store Connect:**
   - Create developer account
   - Upload IPA
   - Configure app details
   - Submit for review

### **Phase 5: Domain & DNS Configuration**

#### **DNS Records Setup:**
```bash
# Main Website
A     agentsynergy.rastogiventuresllc.com     [Vercel IP]
CNAME www.agentsynergy.rastogiventuresllc.com agentsynergy.rastogiventuresllc.com

# API Subdomain
A     api.agentsynergy.rastogiventuresllc.com [Backend IP]
CNAME api.agentsynergy.rastogiventuresllc.com [Backend URL]
```

### **Phase 6: SSL & Security**

#### **SSL Certificates:**
- Vercel provides automatic SSL
- Configure HTTPS redirects
- Set security headers

#### **Security Headers:**
```bash
# Add to Next.js config
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

### **Phase 7: Testing & Monitoring**

#### **Pre-Launch Testing:**
1. **API Testing:**
   ```bash
   # Test production API
   curl https://api.agentsynergy.rastogiventuresllc.com/health
   curl https://api.agentsynergy.rastogiventuresllc.com/docs
   ```

2. **Web App Testing:**
   - Test all features on production domain
   - Verify authentication works
   - Test responsive design

3. **Mobile App Testing:**
   - Test on real devices
   - Verify API connectivity
   - Test all features

#### **Monitoring Setup:**
1. **Vercel Analytics:**
   - Enable Vercel Analytics
   - Monitor performance

2. **Error Tracking:**
   - Set up Sentry for error tracking
   - Monitor API errors

3. **Uptime Monitoring:**
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Monitor API health endpoints

### **Phase 8: Launch Checklist**

#### **Pre-Launch:**
- [ ] Supabase configured and tested
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Domain configured
- [ ] SSL certificates active
- [ ] Mobile apps submitted to stores
- [ ] All features tested
- [ ] Error monitoring active
- [ ] Analytics configured

#### **Launch Day:**
- [ ] Announce on social media
- [ ] Send email to beta users
- [ ] Monitor for issues
- [ ] Respond to user feedback

### **Phase 9: Post-Launch**

#### **Maintenance:**
- Monitor performance
- Fix bugs quickly
- Add new features
- Scale as needed

#### **Marketing:**
- SEO optimization
- Content marketing
- Social media presence
- User testimonials

## 🎯 **Quick Start Commands**

### **1. Test Production Setup:**
```bash
# Test API
curl https://api.agentsynergy.rastogiventuresllc.com/health

# Test Web App
curl https://agentsynergy.rastogiventuresllc.com
```

### **2. Deploy Updates:**
```bash
# Backend updates
git push origin main  # Auto-deploys to Vercel

# Frontend updates
git push origin main  # Auto-deploys to Vercel
```

### **3. Monitor Logs:**
```bash
# Vercel logs
vercel logs

# Supabase logs
# Check Supabase dashboard
```

## 🚀 **Ready to Launch!**

Follow these steps in order, and you'll have a production-ready Agent Synergy application running at `agentsynergy.rastogiventuresllc.com`!
