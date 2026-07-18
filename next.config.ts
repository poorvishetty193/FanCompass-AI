import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://api.anthropic.com;
  frame-src 'none';
  object-src 'none';
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
