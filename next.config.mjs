/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dbinsure.co.kr',
        pathname: '/images/**',
      },
    ],
    // unoptimized: true 제거하여 이미지 최적화 활성화
  },
}

export default nextConfig
