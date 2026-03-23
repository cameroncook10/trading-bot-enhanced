# Deployment Guide - Vercel

This guide covers deploying the TradeBot dashboard to Vercel.

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- GitHub account with the repository
- API backend running and accessible

## Deployment Options

### Option 1: Deploy from Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: TradeBot dashboard"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following variables:

   **Production**
   ```
   VITE_API_BASE_URL=https://your-api.example.com
   VITE_WS_URL=wss://your-api.example.com/ws
   VITE_ENVIRONMENT=production
   ```

   **Preview/Staging**
   ```
   VITE_API_BASE_URL=https://staging-api.example.com
   VITE_WS_URL=wss://staging-api.example.com/ws
   VITE_ENVIRONMENT=staging
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Option 2: Manual Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

   For staging:
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   During deployment, Vercel will prompt for environment variables, or set them afterwards in the dashboard.

## Build Configuration

The `vercel.json` file configures:
- Build command: `npm run build`
- Development command: `npm run dev`
- Framework: Vite
- Environment variable prefix: `VITE_`

## Optimization Tips

### 1. Enable Caching
Vercel automatically caches build artifacts. Builds after the first deployment are faster.

### 2. Custom Domain
To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)

### 3. Monitoring
Enable analytics in Vercel dashboard:
- Real User Monitoring (RUM)
- Edge function insights
- Performance metrics

## Environment Configuration

### API Endpoint Configuration

**Local Development**
```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

**Staging**
```
VITE_API_BASE_URL=https://staging-api.yourcompany.com
VITE_WS_URL=wss://staging-api.yourcompany.com/ws
```

**Production**
```
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_WS_URL=wss://api.yourcompany.com/ws
```

## CORS Configuration

Ensure your backend API has CORS configured to allow requests from your Vercel domain:

```javascript
// Backend CORS setup example
const corsOptions = {
  origin: [
    'https://trading-bot-dashboard.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
};
```

## WebSocket Configuration

For WebSocket connections to work:
1. Ensure backend accepts WebSocket upgrades
2. Use `wss://` (secure WebSocket) in production
3. Handle reconnection with exponential backoff (implemented in `useWebSocket` hook)

## Continuous Deployment

### Auto-Deploy on Push
By default, Vercel automatically deploys on push to main:
1. Any commit to main → Production deployment
2. PR → Preview deployment
3. Other branches → No auto-deploy

### Disable Auto-Deploy
In Vercel Project Settings → Git, you can disable auto-deploy and manually trigger deployments.

## Rollback

To rollback to a previous deployment:
1. Go to Vercel Dashboard → Deployments
2. Find the deployment to rollback to
3. Click the three dots menu
4. Select "Promote to Production"

## Performance Optimization

### 1. Check Bundle Size
```bash
npm run build
# Check the .vercel/output directory
```

### 2. Analyze Dependencies
```bash
npm list
```

### 3. Enable Image Optimization
Update `vite.config.ts` for optimal asset loading.

### 4. Caching Headers
Vercel automatically sets optimal caching headers for:
- HTML files (no-cache)
- Static assets (1 year cache)
- API responses (based on backend headers)

## Troubleshooting

### Build Fails
Check the Vercel build logs:
1. Go to Deployments
2. Click the failed deployment
3. Scroll to "Build Output"
4. Look for error messages

Common issues:
- Missing environment variables
- Incorrect TypeScript types
- Missing dependencies

### API Connection Issues
1. Check CORS configuration in backend
2. Verify WebSocket URL is correct
3. Check browser DevTools Network tab
4. Review backend logs

### Slow Performance
1. Check bundle size (should be < 500KB gzipped)
2. Review API response times
3. Check for console errors
4. Verify network waterfall in DevTools

## Monitoring

### Error Tracking
Vercel integrates with error tracking services:
- Sentry
- Rollbar
- LogRocket

To enable:
1. Create account on service
2. Add integration in Vercel Settings
3. Configure frontend SDK

### Analytics
Add Google Analytics or similar:
```typescript
// In App.tsx or main.tsx
import { GoogleAnalytics } from '@next/bundle-analyzer'
```

## Security

### Environment Variables
- Never commit `.env` files
- Use Vercel's encrypted environment variables
- Rotate API keys regularly

### HTTPS
- Vercel provides free SSL/TLS for all deployments
- Automatic certificate renewal
- HTTP → HTTPS redirect enabled by default

### API Security
- Validate all API requests
- Implement rate limiting
- Use API keys/JWT authentication
- Implement CORS properly

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] API endpoints tested and working
- [ ] WebSocket connection tested
- [ ] Error handling implemented
- [ ] Performance tested (< 3s load time)
- [ ] Mobile responsive design verified
- [ ] Dark mode verified
- [ ] Build passes without errors
- [ ] No console warnings or errors
- [ ] API rate limits configured
- [ ] CORS properly configured
- [ ] Security headers configured
- [ ] SSL certificate valid
- [ ] Monitoring/analytics configured
- [ ] Rollback plan ready

## Support

For Vercel-specific issues:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Discord Community](https://vercel.com/discord)
- [GitHub Issues](https://github.com/vercel/vercel)

For app-specific issues:
- Check README.md
- Review component documentation
- Check API integration guide
