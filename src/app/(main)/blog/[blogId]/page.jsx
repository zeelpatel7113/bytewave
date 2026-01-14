import React from 'react';
import DyBlogPage from './DyBlogPage';
import { blogPosts } from "@/components/Blog/Metadata"; // your posts array

// Dynamic metadata
export async function generateMetadata({ params }) {
  const blogData = blogPosts.find(post => post.id == params.blogId);

  if (!blogData) {
    return {
      title: "Blog Not Found",
      description: "The article you are looking for does not exist.",
      keywords: ["blog", "not found"],
    };
  }

  return {
    title: blogData.title,
    description: blogData.subtitle || blogData.desc || "Read the latest article on Bytewave Blog",
    keywords: [
      blogData.title,
      blogData.category,
      blogData.author,
      ...(blogData.subtitle ? [blogData.subtitle] : []),
    ],
    openGraph: {
      title: blogData.title,
      description: blogData.subtitle || blogData.desc,
      images: [
        {
          url: blogData.image,
          width: 1200,
          height: 630,
          alt: blogData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title,
      description: blogData.subtitle || blogData.desc,
      images: [blogData.image],
    },
  };
}

const Page = ({ params }) => {
  const blogData = blogPosts.find(post => post.id == params.blogId);

  return <DyBlogPage blogData={blogData} />;
};

export default Page;
