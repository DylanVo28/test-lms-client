# Vercel i18n Deployment Guide - FIXED

## 🚨 Problem Identified
- **Issue**: Routes like `/vi/platform` return 404 on Vercel
- **Root Cause**: Incorrect vercel.json configuration conflicting with Next.js i18n
- **Solution**: Simplified vercel.json + Next.js built-in rewrites

## 🔧 Configuration Changes Made

### 1. vercel.json (Simplified)
```json
{
  "rewrites": [
    {
      "source": "/:locale(en|vi|zh-CN)/:path*",
      "destination": "/:path*?locale=:locale"
    }
  ]
}
```

### 2. next.config.ts (Added rewrites)
```typescript
async rewrites() {
  return [
    {
      source: '/:locale(en|vi|zh-CN)/:path*',
      destination: '/:path*?locale=:locale',
    },
  ];
}
```

### 3. next-i18next.config.js (Enabled detection)
```javascript
{
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'zh-CN'],
    localeDetection: true,  // ← Enabled
  }
}
```

## 🚀 Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix i18n routing for Vercel deployment"
git push
```

### Step 2: Verify Vercel Build
- Check Vercel dashboard for build status
- Ensure no build errors
- Verify deployment completes

### Step 3: Test Routes
- ✅ `/` → Should redirect to `/en`
- ✅ `/en` → English homepage
- ✅ `/vi` → Vietnamese homepage
- ✅ `/zh-CN` → Chinese homepage
- ✅ `/vi/platform` → Vietnamese platform page
- ✅ `/en/course` → English course page
- ✅ `/vi/course` → Vietnamese course page

## 🧪 Testing Checklist

### Basic Routes
- [ ] `/en` loads correctly
- [ ] `/vi` loads correctly  
- [ ] `/zh-CN` loads correctly

### Nested Routes
- [ ] `/en/platform` loads correctly
- [ ] `/vi/platform` loads correctly
- [ ] `/zh-CN/platform` loads correctly

### Dynamic Routes
- [ ] `/en/course/123` loads correctly
- [ ] `/vi/course/123` loads correctly
- [ ] `/zh-CN/course/123` loads correctly

### Page Refresh (F5)
- [ ] Navigate to `/vi/platform`
- [ ] Press F5
- [ ] Should NOT show 404
- [ ] Should maintain Vietnamese locale

## 🐛 Troubleshooting

### Still Getting 404?
1. **Check Vercel build logs** for errors
2. **Verify Node.js version** is >=18
3. **Clear Vercel cache** and redeploy
4. **Check function logs** for runtime errors

### Common Issues
- **Build fails**: Check for TypeScript errors
- **Routes not working**: Verify vercel.json syntax
- **Locale switching fails**: Check i18n configuration

## ✅ Expected Results

After deployment:
- All locale routes should work
- No more 404 errors on nested routes
- Page refresh should work correctly
- Direct URL access should work
- Locale switching should be smooth

## 🔄 Next Steps

1. Deploy with new configuration
2. Test all routes thoroughly
3. Verify page refresh works
4. Monitor for any remaining issues
5. Update documentation if needed
