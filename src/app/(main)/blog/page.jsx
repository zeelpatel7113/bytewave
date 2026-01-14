import React from 'react';
import Blogpage from './Blogpage';

// Static metadata
export const metadata = {
  title: "Bytewave Blog",
  description: "Read the latest articles, tips, and news on Bytewave Blog.",
  keywords: ["blog", "technology", "career", "news"],
  authors: [{ name: "Bytewave Team" }],
  openGraph: {
    title: "Bytewave Blog",
    description: "Read the latest articles, tips, and news on Bytewave Blog.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bytewave Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bytewave Blog",
    description: "Read the latest articles, tips, and news on Bytewave Blog.",
    images: ["/images/og-image.jpg"],
  },
};

function Page() {
  return (
    <div>
      <Blogpage />
    </div>
  );
}

export default Page;
