/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    basePath: '/Student',
    assetPrefix: '/Student',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
