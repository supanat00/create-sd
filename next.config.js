/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: ["https", "http"],
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/da8eemrq8/**",
      },
    ],
  },
};
