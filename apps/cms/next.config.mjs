import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (config, { isServer }) => {
    // Postgres 관련 cloudflare:sockets 문제 해결
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pg-cloudflare': false,
      'cloudflare:sockets': false,
      pg: isServer ? require.resolve('pg') : false,
      'pg-native': false,
    }

    // 추가: pg 모듈 관련 외부 모듈 처리
    if (!isServer) {
      config.externals = [...(config.externals || []), 'pg', 'pg-native', 'pg-cloudflare']
    }

    return config
  },
  // 추가: Next.js 트랜스파일 설정
  transpilePackages: ['@payloadcms/db-postgres'],
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
  // 추가: PayloadCMS 모듈들을 서버에서만 번들링하도록 설정
  payloadBundleServerPackages: ['@payloadcms/db-postgres', 'pg', 'pg-cloudflare'],
})
