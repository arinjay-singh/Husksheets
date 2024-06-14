import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false, // Disable SWC minification if needed
    env: {
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_NAME: process.env.NEXT_PUBLIC_NAME,
        NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
        NEXT_PUBLIC_PUBLISHER: process.env.NEXT_PUBLIC_PUBLISHER,
        NEXT_PUBLIC_SHEET: process.env.NEXT_PUBLIC_SHEET,
    },
};

export default nextConfig;
