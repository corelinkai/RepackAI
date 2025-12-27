/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Disable webpack cache for Cloudflare Pages (25MB limit)
  webpack: (config, { isServer }) => {
    if (process.env.CF_PAGES) {
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig
