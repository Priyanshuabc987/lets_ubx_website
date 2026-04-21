
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SocialPost } from "@/lib/data/socialposts";
import { useIsMobile } from "@/hooks/use-mobile";
import { extractLinkedInID } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const LINKEDIN_EMBED_HEIGHT_DESKTOP = 610;
const INSTAGRAM_EMBED_HEIGHT_DESKTOP = 610;
const LINKEDIN_EMBED_HEIGHT_MOBILE = 510;
const INSTAGRAM_EMBED_HEIGHT_MOBILE = 440;

interface SocialFeedProps {
  initialPosts: SocialPost[];
}

export function SocialFeed({ initialPosts }: SocialFeedProps) {
  const posts = initialPosts || [];
  const linkedinPosts = posts.filter((post) => post.platform === "linkedin");
  const instagramPosts = posts.filter((post) => post.platform === "instagram");
  const youtubePosts = posts.filter((post) => post.platform === "youtube");

  useEffect(() => {
    if (typeof window !== 'undefined' && linkedinPosts.length > 0) {
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
  }, [linkedinPosts]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-2 md:mt-4">
            Stay updated with the latest from CEDAT on social media.
          </p>
        </motion.div>

        {linkedinPosts.length > 0 && (
          <SocialRow
            title="LinkedIn Updates"
            posts={linkedinPosts}
            platform="linkedin"
          />
        )}

        {instagramPosts.length > 0 && (
          <SocialRow
            title="Instagram Highlights"
            posts={instagramPosts}
            platform="instagram"
          />
        )}
        
        {youtubePosts.length > 0 && (
          <SocialRow
            title="YouTube Podcasts"
            posts={youtubePosts}
            platform="youtube"
          />
        )}
      </div>
    </section>
  );
}

function SocialRow({
  title,
  posts,
  platform,
}: {
  title: string;
  posts: SocialPost[];
  platform: "linkedin" | "instagram" | "youtube";
}) {
  const isMobile = useIsMobile();

  const cardBgClass = platform === 'linkedin'
    ? 'bg-[#0A66C2]'
    : platform === 'instagram' 
    ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]'
    : 'bg-[#FF0000]';

  const embedHeight = platform === 'linkedin'
    ? (isMobile ? LINKEDIN_EMBED_HEIGHT_MOBILE : LINKEDIN_EMBED_HEIGHT_DESKTOP)
    : (isMobile ? INSTAGRAM_EMBED_HEIGHT_MOBILE : INSTAGRAM_EMBED_HEIGHT_DESKTOP);

  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold">{title}</h3>
        <ChevronRight className="w-5 h-5" /> 
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 -mx-2 px-4 snap-x snap-mandatory [scrollbar-width:thin]">
        {posts.map((post, index) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.32) }}
              viewport={{ once: true }}
              className={`snap-start shrink-0 w-[90vw] sm:w-[68vw] md:w-[400px] rounded-2xl p-2 sm:p-3 overflow-hidden shadow-lg ${cardBgClass}`}
            >
              <div
                className="bg-background rounded-lg overflow-hidden"
                style={platform === 'youtube' ? { position: 'relative', paddingBottom: '56.25%', height: 0 } : { height: embedHeight }}
              >
                {platform === "instagram" ? (
                  <iframe
                    src={getInstagramEmbedUrl(post.post_url)}
                    height={embedHeight}
                    width="100%"
                    frameBorder="0"
                    scrolling="no"
                    title={`Embedded Instagram post: ${post.id}`}
                    className="w-full border-none"
                  />
                ) : platform === 'youtube' ? (
                    <iframe 
                        src={`https://www.youtube.com/embed/${getYouTubeID(post.post_url)}`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Embedded YouTube video: ${post.id}`}
                        className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                ) : (
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${extractLinkedInID(post.post_url)}?collapsed=1`}
                    height={embedHeight}
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`LinkedIn post by CEDAT: ${post.id}`}
                    className="w-full border-none"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function getInstagramEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/(p|reel|tv)\/([^/?#]+)/i);
    if (match?.[1] && match?.[2]) {
      return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/`;
    }
  } catch { }
  return url.includes('/embed') ? url : `${url.split('?')[0]}embed`;
}

function getYouTubeID(url: string): string {
    const arr = url.split(/(vi\/|v%3D|v= |\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[^0-9a-z_\-]/i)[0] : arr[0];
}
