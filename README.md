# LMS-FE

## **Manual build VPS**

1. **Connect to VPS**
   - ssh
2. **Go to LMS FE**
   - cd lms
   - cd lms-fe
3. **Pull code**
   - git pull
   - enter username/pass gitlab
4. **Build new code**
   - npm run build/yarn build
5. **Remove old version service**
   - pm2 delete lms-web
6. **Create & apply new version service**
   - pm2 start "npm run start" --name lms-web
   - pm2 save
   - pm2 startup
