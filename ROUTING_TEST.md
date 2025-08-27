# i18n Routing Test Guide

## Test Cases to Verify

### 1. Basic Locale Access
- [ ] /en - English homepage
- [ ] /vi - Vietnamese homepage  
- [ ] /zh-CN - Chinese homepage

### 2. Nested Routes
- [ ] /en/course - English course page
- [ ] /vi/course - Vietnamese course page
- [ ] /zh-CN/course - Chinese course page

### 3. Dynamic Routes
- [ ] /en/course/123 - English course detail
- [ ] /vi/course/123 - Vietnamese course detail
- [ ] /zh-CN/course/123 - Chinese course detail

### 4. Page Refresh (F5) Test
- [ ] Navigate to /vi/course
- [ ] Press F5 (refresh)
- [ ] Should NOT show 404
- [ ] Should maintain Vietnamese locale

### 5. Direct URL Access
- [ ] Type /vi/course directly in browser
- [ ] Should load correctly
- [ ] Should show Vietnamese content

## Common 404 Issues & Solutions

### Issue 1: Page refresh shows 404
**Solution**: Check vercel.json rewrites configuration

### Issue 2: Direct URL access fails
**Solution**: Ensure proper redirects are configured

### Issue 3: Locale switching doesn't work
**Solution**: Verify i18n configuration in next-i18next.config.js

### Issue 4: Dynamic routes fail
**Solution**: Check that all dynamic routes have proper i18n support

## Debugging Steps

1. Check browser console for errors
2. Check Vercel function logs
3. Verify locale files exist in /public/locales/
4. Test with different browsers
5. Check network tab for failed requests

## Expected Behavior

✅ All locale routes should work
✅ Page refresh should maintain locale
✅ Direct URL access should work
✅ Locale switching should be smooth
✅ No 404 errors on valid routes
