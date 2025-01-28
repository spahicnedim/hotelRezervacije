/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.lovepik.com",
      },
      {
        protocol: "https",
        hostname: "imageio.forbes.com",
      },
    ],
  },
};

export default nextConfig;
