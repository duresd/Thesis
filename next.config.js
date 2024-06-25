/** @type {import('next').NextConfig} */
const nextConfig = {
    // async redirects() {
    //     return [
    //       {
    //         source: '/',
    //         destination: '/auth/login',
    //         permanent: false,
    //       },
    //     ];
    //   },
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
