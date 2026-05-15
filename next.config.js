/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'zgmvxnghelvcnzgcrmfz.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Security headers are consolidated in src/middleware.ts as a single source
  // of truth. Do NOT add CSP or other security headers here or in vercel.json.
  poweredByHeader: false,
}

module.exports = nextConfig
