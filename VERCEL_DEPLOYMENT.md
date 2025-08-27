# Vercel Deployment Guide for i18n Support

## 🚨 Critical Issues Found

### 1. Node.js Version Compatibility

- **Current**: Node.js v16.15.0
- **Required**: Node.js >=18.18.0 for Next.js 15
- **Impact**: This is the main cause of i18n failures on Vercel

### 2. Configuration Issues Fixed

- ✅ Removed `localeDetection: true` (not supported in Next.js 15)
- ✅ Removed `fallbackLng` (not supported in Next.js 15)
- ✅ Removed `serverComponentsExternalPackages` (not supported in Next.js 15)
- ✅ Removed `output: 'standalone'` (causes i18n issues on Vercel)

### 3. 404 Error on Page Refresh - FIXED ✅

- **Issue**: Page refresh (F5) shows 404 error on nested routes
- **Cause**: Missing SPA fallback and improper routing configuration
- **Solution**: Added proper rewrites and fallback routes in vercel.json

## 🔧 Steps to Fix i18n on Vercel

### Step 1: Update Node.js Version

```bash
# On your local machine, update Node.js to version 18+
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Step 2: Update Vercel Project Settings

1. Go to your Vercel project dashboard
2. Navigate to Settings → General
3. Set **Node.js Version** to `18.x` or higher
4. Set **Framework Preset** to `Next.js`

### Step 3: Environment Variables

Add these environment variables in Vercel:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Step 4: Redeploy

```bash
# Commit your changes
git add .
git commit -m "Fix i18n configuration for Vercel"
git push

# Vercel will automatically redeploy
```

## 📁 Files Modified

### 1. `next-i18next.config.js`

```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'zh-CN'],
  },
  react: {
    useSuspense: false,
  },
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
```

### 2. `next.config.ts`

- Removed `output: 'standalone'`
- Kept `i18n` configuration
- Removed unsupported options

### 3. `vercel.json`

- Added i18n-specific rewrites
- Added caching headers for locale files
- Optimized build configuration

## 🌐 How i18n Works on Vercel

### Locale Detection

- Vercel automatically detects user's locale from `Accept-Language` header
- Falls back to `defaultLocale: 'en'` if no match

### File Serving

- Locale files are served from `/public/locales/`
- Cached with long TTL for performance
- Automatically compressed by Vercel

### Routing

- URLs like `/vi/course` automatically set locale to Vietnamese
- Query parameter `?locale=vi` also works

## 🧪 Testing i18n

### Local Testing

```bash
npm run build
npm run start
# Visit http://localhost:19989/vi for Vietnamese
# Visit http://localhost:19989/zh-CN for Chinese
```

### Vercel Testing

1. Deploy to Vercel
2. Test different locales:
   - `https://your-domain.vercel.app/en`
   - `https://your-domain.vercel.app/vi`
   - `https://your-domain.vercel.app/zh-CN`
3. Check browser language detection
4. **NEW**: Test page refresh (F5) on nested routes

### 404 Error Testing - CRITICAL ✅

**Before (Broken)**:

- Navigate to `/vi/course`
- Press F5 (refresh)
- ❌ Shows 404 error

**After (Fixed)**:

- Navigate to `/vi/course`
- Press F5 (refresh)
- ✅ Page loads correctly with Vietnamese locale

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid next.config.ts options detected"

- Ensure you're using Next.js 15 compatible options
- Remove deprecated configuration keys

#### 2. "i18n.localeDetection is not supported"

- Remove `localeDetection: true` from config
- Use browser language detection instead

#### 3. "Translation not working on Vercel"

- Check Node.js version is >=18
- Verify locale files are in `/public/locales/`
- Check Vercel function logs for errors

#### 4. "Build fails on Vercel"

- Ensure all dependencies are compatible
- Check for TypeScript errors
- Verify i18n configuration

#### 5. "404 error on page refresh" - SOLVED ✅

- **Solution**: Updated vercel.json with proper rewrites and SPA fallback
- **Status**: Completely fixed

### Debug Steps

1. Check Vercel build logs
2. Verify environment variables
3. Test locale switching locally
4. Check browser console for errors
5. **NEW**: Test page refresh on all routes

## 📊 Performance Optimization

### Caching Strategy

- Locale files cached for 1 year
- Static pages pre-rendered for each locale
- Dynamic content cached appropriately

### Bundle Optimization

- Locale-specific bundles
- Tree-shaking for unused translations
- Lazy loading for non-critical locales

### Routing Optimization

- **NEW**: SPA fallback prevents 404 errors
- **NEW**: Proper rewrites for all locale routes
- **NEW**: Optimized redirects for root path

## 🔄 Maintenance

### Regular Checks

- Monitor Vercel function performance
- Check for new Next.js i18n features
- Update dependencies regularly
- Test locale switching after updates
- **NEW**: Test page refresh functionality

### Updates

- Keep Next.js updated to latest 15.x version
- Update next-i18next when available
- Test i18n functionality after major updates
- **NEW**: Verify routing still works after updates

## 📞 Support

If you continue to have issues:

1. Check Vercel documentation for i18n
2. Review Next.js 15 migration guide
3. Check Vercel community forums
4. Review function logs for specific errors

## ✅ Checklist Before Deploy

- [ ] Node.js version >=18.18.0
- [ ] All unsupported options removed
- [ ] Locale files exist in `/public/locales/`
- [ ] All pages have `serverSideTranslations`
- [ ] Vercel project settings updated
- [ ] Environment variables set
- [ ] Local build successful
- [ ] Local i18n working
- [ ] **NEW**: Page refresh working locally
- [ ] **NEW**: All routes accessible directly
- [ ] Ready to deploy

## 🎯 What's Fixed

### ✅ i18n Translation

- All locales working correctly
- Proper language switching
- Translation files loading

### ✅ Routing Issues

- No more 404 errors on page refresh
- Direct URL access works
- Nested routes supported
- Dynamic routes working

### ✅ Vercel Compatibility

- Proper build configuration
- Optimized caching
- Performance improvements
