/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  // 환경 변수 디버깅 정보 추가
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log('클라이언트 빌드 환경변수:', {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
