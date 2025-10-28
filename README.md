# AutomationScout Frontend

Modern Next.js frontend for AutomationScout admin portal, optimized for Vercel deployment.

## 🚀 Hybrid Architecture

This frontend is designed to work with containerized backend APIs:
- **Frontend**: Deployed on Vercel (global CDN, instant scaling)
- **Backend APIs**: Containerized (Docker/PM2 on dedicated servers)

## 📁 Structure

```
pages/
├── index.js              # Home page (redirects to login/dashboard)
├── login.js              # Authentication page
├── admin/
│   ├── clients.js        # Scout Master portal (client list)
│   └── clients/[id].js   # Client detail page
└── api/
    └── health.js         # Vercel serverless function

lib/
├── api.js                # API client with auth & error handling
└── useAuth.js            # Authentication hook

components/               # Reusable UI components (future)
```

## 🔧 Configuration

### Environment Variables

**Development:**
- `API_BASE_URL=http://localhost:3003`

**Production:**
- `API_BASE_URL=https://your-api-domain.com`

### API Proxying

Next.js automatically proxies `/api/*` requests to the backend container via `next.config.js`.

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

### Environment Setup
Set these in Vercel dashboard:
- `API_BASE_URL`: Your container API URL
- `NODE_ENV`: production

## 🔐 Authentication

- Uses Bearer tokens stored in localStorage
- Automatic token validation on page load
- API client includes auth interceptors
- Redirects to login on 401 responses

## 📊 Performance Benefits

- **5-10x faster** page loads via Vercel Edge CDN  
- **Global distribution** with 50+ edge locations
- **Instant scaling** for traffic spikes
- **Zero cold starts** for frontend assets

## 🔗 API Integration

All API calls proxy through to your containerized backend:
- `/api/auth/*` → Authentication endpoints
- `/api/clients/*` → Client management  
- `/api/widgets/*` → Widget monitoring
- `/api/workflows/*` → Workflow discovery
- `/api/compliance/*` → SOC2 compliance

Backend runs on port 3003 with full CORS support for Vercel domains.

## 🎯 Features Converted

✅ **Scout Master Portal** (`admin-clients.html` → `pages/admin/clients.js`)
- Client list with metrics
- Add client modal with invite sending
- Health indicators and status badges
- Responsive grid layout

✅ **Client Detail Page** (`admin-client-detail.html` → `pages/admin/clients/[id].js`)  
- Tabbed interface (Overview, Widgets, Workflows, Invites)
- Metric cards and data tables
- Send invite functionality
- Breadcrumb navigation

✅ **Authentication System**
- Secure login with session management
- Token validation and refresh
- Protected route handling

## 🔥 Next Steps

1. Deploy to Vercel staging
2. Configure production API URL
3. Add remaining portal pages
4. Implement real-time updates
5. Add progressive web app features