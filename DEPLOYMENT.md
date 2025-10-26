# 🌐 Deployment Guide

## Deployment Options

### 1. Vercel (Recommended) ⭐

Vercel is the easiest option since it's made by the Next.js team.

**Steps:**

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Configure settings:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add environment variables (if using cloud OCR):
   ```
   GOOGLE_CLOUD_VISION_API_KEY=your_key
   OCR_SPACE_API_KEY=your_key
   ```

6. Click "Deploy"

**Features:**
- ✅ Automatic deployments on git push
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Serverless functions support
- ✅ Preview deployments for PRs

**URL:** Your app will be at `your-project.vercel.app`

---

### 2. Netlify

**Steps:**

1. Push code to GitHub

2. Go to [netlify.com](https://netlify.com)

3. Click "Add new site" → "Import from Git"

4. Select your repository

5. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`

6. Add environment variables in Site Settings

7. Deploy

**Note:** May require additional configuration for Next.js App Router.

---

### 3. Railway

**Steps:**

1. Go to [railway.app](https://railway.app)

2. Click "New Project" → "Deploy from GitHub"

3. Select your repository

4. Railway auto-detects Next.js

5. Add environment variables

6. Deploy

**Features:**
- Simple deployment
- Free tier available
- Good for full-stack apps

---

### 4. Docker Container

**Create `Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Create `.dockerignore`:**

```
node_modules
.next
.git
.env.local
```

**Build and run:**

```bash
docker build -t bill-split .
docker run -p 3000:3000 bill-split
```

**Deploy to:**
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform

---

### 5. Self-Hosted (VPS)

**Requirements:**
- Node.js 18+
- PM2 or similar process manager
- Nginx reverse proxy

**Steps:**

1. SSH into your server

2. Clone repository:
   ```bash
   git clone <your-repo>
   cd bill-split
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build:
   ```bash
   npm run build
   ```

5. Install PM2:
   ```bash
   npm install -g pm2
   ```

6. Start with PM2:
   ```bash
   pm2 start npm --name "bill-split" -- start
   pm2 save
   pm2 startup
   ```

7. Configure Nginx:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. Enable SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Environment Variables

### Production Environment Variables

```env
# Optional: Cloud OCR Services
GOOGLE_CLOUD_VISION_API_KEY=your_key_here
OCR_SPACE_API_KEY=your_key_here

# Optional: Database (Future Enhancement)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Pre-Deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Build locally: `npm run build`
- [ ] Check for TypeScript errors: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Review environment variables
- [ ] Update README with your domain
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics (optional)
- [ ] Enable HTTPS
- [ ] Test on mobile devices

---

## Post-Deployment

### 1. Test Core Features

- Upload image
- OCR scanning
- Item editing
- People management
- Split calculation
- Export functionality

### 2. Performance Optimization

**Next.js Optimizations:**
- Images are automatically optimized
- Code splitting is automatic
- Static assets are cached

**Additional optimizations:**
- Enable compression in server
- Use CDN for static assets
- Consider edge functions for API routes

### 3. Monitoring

**Recommended tools:**
- Vercel Analytics (free with Vercel)
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

---

## Scaling Considerations

### For High Traffic

1. **CDN**: Use Cloudflare or similar
2. **Database**: Add persistent storage (Supabase/PostgreSQL)
3. **Caching**: Implement Redis for session data
4. **Load Balancing**: Use multiple instances
5. **OCR**: Switch to server-side OCR for consistency

### Cost Optimization

- **Vercel**: Free tier supports hobby projects
- **OCR**: Tesseract.js is free (client-side)
- **Storage**: Only needed if adding user accounts
- **Database**: Supabase free tier sufficient for most use cases

---

## Troubleshooting Deployment

### Build Fails

```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .next
npm run build
```

### Runtime Errors

- Check environment variables are set
- Verify Node.js version (18+)
- Check server logs
- Test locally with production build

### Slow Performance

- Enable Next.js compression
- Optimize images
- Use CDN
- Check bundle size: `npm run build` shows sizes

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **API Keys**: Rotate regularly
3. **HTTPS**: Always use SSL in production
4. **CORS**: Configure if using separate frontend/backend
5. **Rate Limiting**: Add if using paid OCR APIs
6. **Input Validation**: Already implemented in forms

---

## Updating Deployed App

### Vercel/Netlify
- Push to main branch → Auto-deploys

### Docker
```bash
docker build -t bill-split:latest .
docker push your-registry/bill-split:latest
```

### VPS
```bash
cd bill-split
git pull
npm install
npm run build
pm2 restart bill-split
```

---

## Domain Configuration

### Custom Domain

1. Buy domain from registrar (Namecheap, GoDaddy, etc.)

2. Add domain in deployment platform

3. Update DNS records:
   ```
   A Record: @ → Your server IP
   CNAME: www → your-app.vercel.app
   ```

4. Wait for DNS propagation (up to 48 hours)

5. Enable SSL certificate

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Test production build locally first
- Open GitHub issue if persistent problems

---

**Ready to deploy!** 🚀
