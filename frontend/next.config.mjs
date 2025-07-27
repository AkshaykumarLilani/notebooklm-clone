/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [new URL('https://akshaylilani.com/**')],
    },
};

export default nextConfig;
