/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  output: 'standalone', // 최적화된 독립형 출력 사용
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  },
  // 환경 변수 디버깅 정보 추가
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log('클라이언트 빌드 환경변수:', {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
