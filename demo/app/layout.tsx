import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://react-headless-tour-mu.vercel.app";

const TITLE = "react-headless-tour — 4.5 kB fully customizable product tours for React & Next.js";
const DESCRIPTION =
  "The lightest fully-featured React product tour library: ~4.5 kB min+gzip, one dependency, zero animation libraries. Headless and themeable — spotlight, positioning and keyboard navigation built in; style it with CSS variables, class names, or your own components.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · react-headless-tour",
  },
  description: DESCRIPTION,
  keywords: [
    "react tour",
    "product tour",
    "onboarding",
    "react onboarding library",
    "headless ui",
    "walkthrough",
    "user onboarding",
    "nextjs tour",
    "spotlight",
    "react tooltip tour",
    "lightweight react tour",
    "small bundle size",
    "react joyride alternative",
  ],
  authors: [{ name: "react-headless-tour contributors" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "react-headless-tour",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "react-headless-tour",
  description: DESCRIPTION,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: SITE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: "TypeScript",
  keywords: "react, nextjs, product tour, onboarding, headless, walkthrough",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
