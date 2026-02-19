# Deployment Guide

## Running on a Subdirectory (e.g., /padel)

If you want to deploy this app on a subdirectory like `https://yourdomain.com/padel`, you need to configure both Next.js and nginx.

### Option 1: Root Domain Deployment (Recommended)

The simplest approach is to deploy on a subdomain or root domain:
- `https://padel.yourdomain.com`
- `https://yourdomain.com`

In this case, use the nginx configuration from `nginx-config.conf` as-is.

### Option 2: Subdirectory Deployment

If you must deploy on a subdirectory like `/padel`, follow these steps:

#### 1. Update Next.js Configuration

Edit `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/padel',
  assetPrefix: '/padel',
};

export default nextConfig;
```

#### 2. Update Nginx Configuration

Use the configuration from `nginx-config.conf`.

#### 3. Build and Deploy

```bash
# Build the production version
npm run build

# Start the production server
npm run start
```

The app will be available at `https://yourdomain.com/padel`

## Development vs Production

### Development (localhost)
```bash
npm run dev
```
Access at: `http://localhost:3131`

### Production
```bash
npm run build
npm run start
```

## Nginx Setup

1. Copy the nginx configuration from `nginx-config.conf`
2. Add it to your nginx server block (usually in `/etc/nginx/sites-available/your-site`)
3. Test the configuration:
   ```bash
   sudo nginx -t
   ```
4. Reload nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## Important Notes

- The app stores all data in browser localStorage (client-side only)
- No database or backend server is required
- The Next.js server only serves the static app
- Make sure port 3131 is not exposed directly to the internet (nginx should proxy to it)
