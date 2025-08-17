/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 13+ 默认启用 app directory，不需要 experimental 配置
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '172.31.48.1'],
}

module.exports = nextConfig