import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (config, { isServer }) => {
    // Postgres 관련 cloudflare:sockets 문제 해결
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pg-cloudflare': false,
        'cloudflare:sockets': false,
      }
    }
    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
