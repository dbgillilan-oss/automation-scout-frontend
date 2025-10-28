/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_BASE_URL: process.env.API_BASE_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://api.automationscout.com'  
        : 'http://localhost:3003'
    )
  },
  async rewrites() {
    const apiUrl = process.env.API_BASE_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://api.automationscout.com' 
        : 'http://localhost:3003'
    );
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      }
    ];
  },
  images: {
    unoptimized: true
  },
  // Disable problematic optimizations for build
  trailingSlash: false,
  staticPageGenerationTimeout: 60
}

module.exports = nextConfig