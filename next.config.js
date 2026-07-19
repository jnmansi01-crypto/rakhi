/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'rakhi-34eda.firebasestorage.app', 'images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
