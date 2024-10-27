/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'firebasestorage.googleapis.com',
    ],
  },
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
};

export default nextConfig;
