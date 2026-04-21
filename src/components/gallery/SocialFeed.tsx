
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SocialPost } from "@/lib/data/socialposts";
import { useIsMobile } from "@/hooks/use-mobile";
import { extractLinkedInID } from "@/lib/utils";

const LINKEDIN_EMBED_HEIGHT_DESKTOP = 620;
const LINKEDIN_EMBED_HEIGHT_MOBILE = 400;

interface SocialFeedProps {
  posts: SocialPost[];
}

export function SocialFeed({ posts }: SocialFeedProps) {

  useEffect(() => {
    if (typeof window !== 'undefined' && posts.length > 0) {
      if ((window as any).IN) {
        (window as any).IN.parse();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.linkedin.com/in.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, [posts]);

  if (posts.length === 0) {
    return <div className="text-center py-10">No LinkedIn videos to display.</div>;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <SocialRow posts={posts} />
      </div>
    </section>
  );
}

function SocialRow({
  posts,
}: {
  posts: SocialPost[];
}) {
  const isMobile = useIsMobile();
    
  const cardBgClass = 'bg-[#0A66C2]';
    
  const embedHeight = isMobile ? LINKEDIN_EMBED_HEIGHT_MOBILE : LINKEDIN_EMBED_HEIGHT_DESKTOP;

  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      {/* <div className="text-center mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold">LinkedIn Videos</h3>
      </div> */}

      <div className="flex flex-wrap justify-around gap-4 sm:gap-6">
        {posts.map((post, index) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.32) }}
              viewport={{ once: true }}
              className={`rounded-2xl p-2 sm:p-3 overflow-hidden shadow-lg ${cardBgClass}`}
            >
                <div 
                  className="bg-background rounded-lg overflow-hidden"
                  style={{ height: embedHeight }}
                >
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${extractLinkedInID(post.post_url)}?compact=1`}
                    height={embedHeight}
                    width="110%"
                    frameBorder="0"
                    allowFullScreen
                    title={`LinkedIn video by CEDAT: ${post.id}`}
                    className="w-full border-none"
                  />
                </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
