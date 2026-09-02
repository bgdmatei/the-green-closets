import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * `script-src` allows inline scripts because every route is prerendered at
 * build time. Nonce-based CSP requires per-request rendering, which would trade
 * the static shell (and its TTFB) for a stricter policy we do not need here:
 * the site takes no user input, loads no third-party script, and passes all
 * rich content through `sanitizeRichHtml`.
 *
 * `unsafe-eval` is dev-only — React uses `eval` there to rebuild server error
 * stacks in the browser, and neither React nor Next need it in production.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com",
  "font-src 'self'",
  "media-src 'self'",
  "manifest-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // Do not advertise the framework and its version.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Product imagery is served from each brand's own store, the same way
        // the live product feed will supply it once the backend exists.
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: isDev
          ? securityHeaders
          : [
              ...securityHeaders,
              {
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
              },
            ],
      },
      {
        // Files in `public/` are not content-hashed, so Next serves them with a
        // conservative default. These are stable assets — cache them hard.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
