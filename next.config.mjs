const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client", "node-telegram-bot-api"]
  },
  reactStrictMode: true
}

export default nextConfig
