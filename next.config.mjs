/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Render (and most non-Vercel hosts) don't run Next.js Image Optimization API — serve images directly
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
