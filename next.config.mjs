/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    basePath: '/Student',
    assetPrefix: '/Student/',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
