/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `formidable` module
    if (!isServer) {
      config.node = {
        formidable: 'empty'
      }
    }

    return config
  }
}

module.exports = nextConfig
