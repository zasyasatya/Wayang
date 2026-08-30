import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Izinkan origin (host) dari preview environment pada saat build/dev.
  // Di production, set WAYANG_BACKEND_URL.
  env: {
    WAYANG_BACKEND_URL:
      process.env.WAYANG_BACKEND_URL ?? "http://localhost:8000/api",
  },
  async rewrites() {
    // Proksi /api ke backend FastAPI agar frontend selalu memakai path relatif.
    // Ini penting di environment preview di mana browser tidak boleh memanggil localhost.
    const backend = process.env.WAYANG_BACKEND_URL ?? "http://localhost:8000/api";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
