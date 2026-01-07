/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed output: 'export' to leverage Vercel's Edge/Server features
    // Removed basePath since Vercel usually deploys to the root domain
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
