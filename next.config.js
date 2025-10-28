/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://api.automationscout.com'  // Your production container API
      : 'http://localhost:3003'             // Local development
  },
  async rewrites() {
    return [
      // Proxy all /api requests to the container backend
      {
        source: '/api/:path*',
        destination: `${process.env.NODE_ENV === 'production' 
          ? 'https://api.automationscout.com' 
          : 'http://localhost:3003'}/api/:path*`
      }
    ];
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig