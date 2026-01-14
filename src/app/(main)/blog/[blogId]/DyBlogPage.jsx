"use client"
import React from 'react'
import { blogPosts } from "@/components/Blog/Metadata";
import { useParams } from 'next/navigation';
import { motion } from "framer-motion";
import { metadata } from "@/components/Blog/Metadata";


const Page = () => {
  
 
  console.log(blogPosts);
  
    let blogData = NaN;
    const params = useParams();
    for (let i in blogPosts){
      if (blogPosts[i].id == params.blogId){
        blogData = blogPosts[i];
      }
    }
    const suggestions = blogPosts?.filter(post => post.id !== blogData?.id).slice(0, 3) || [];


  if (!blogData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog not found</h1>
        <p className="text-gray-600">The article you are looking for does not exist or was removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero - unique glass panel with gradient blobs and angled ribbon */}
      <section className="relative">
        {/* Background image */}
        <div className="relative h-[58vh] w-full overflow-hidden">
          <motion.img
            src={blogData.image}
            alt={blogData.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {/* <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-950/40 to-white/0" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
          /> */}

          {/* Blue blurred blobs */}
          {/* <motion.div 
            className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-blue-900/30 blur-3xl" 
            initial={{ opacity: 0, x: -40, y: -20 }} 
            animate={{ opacity: 1, x: 0, y: 0 }} 
            transition={{ duration: 0.9 }}
          />
          <motion.div 
            className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-sky-800/30 blur-3xl" 
            initial={{ opacity: 0, x: 40, y: 20 }} 
            animate={{ opacity: 1, x: 0, y: 0 }} 
            transition={{ duration: 0.9, delay: 0.1 }}
          /> */}
        </div>

        {/* On-image overlay header (replaces floating card) */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full">
            <div className="max-w-6xl mx-auto px-4 pb-8">
              <div className="backdrop-blur-[2px] bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between gap-6 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-600/90 text-white text-[11px] font-bold px-3 py-1">
                      {blogData.category || 'Blog'}
                    </span>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-white/80">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/80" />
                      <span className="font-semibold">Bytewave Blog</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <div className="w-8 h-8 rounded-md bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold">
                      {blogData.author?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="font-medium">{blogData.author}</span>
                  </div>
                </div>
                <motion.h1 
                  className="text-white text-3xl sm:text-5xl font-black leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6 }}
                >
                  {blogData.title}
                </motion.h1>
                {blogData.subtitle && (
                  <motion.p 
                    className="mt-2 text-sky-100 font-medium text-lg"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                  >
                    {blogData.subtitle}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content + sticky author card */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8">
          <div className="prose max-w-none">
            <motion.p 
              className="text-[17px] leading-8 text-gray-700"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <span className="float-left mr-2 text-blue-700 font-black text-6xl leading-[0.8]">{(blogData.desc || blogData.description)?.charAt(0)}</span>
              {(blogData.desc || blogData.description)?.slice(1)}
            </motion.p>
          </div>
        </article>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-blue-700/80 font-semibold mb-2">About the author</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 text-white flex items-center justify-center font-extrabold">
                  {blogData.author?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{blogData.author}</p>
                  <p className="text-xs text-gray-500">Contributor</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5">
              <p className="text-xs uppercase tracking-wider text-blue-900/70 font-semibold mb-2">Category</p>
              <div className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1 shadow-sm">
                {blogData.category || 'Blog'}
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Suggestions rail */}
      {suggestions.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You might also like</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {suggestions.map((s) => (
              <motion.a 
                key={s.id} 
                href={`/blog/${s.id}`} 
                className="snap-start min-w-[280px] group bg-white rounded-2xl border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent" />
                </div>
                <div className="p-4">
                  <span className="text-[11px] uppercase tracking-wide text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {s.category || 'Blog'}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{s.subtitle || s.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Page