"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SocialPost } from "@/lib/data/socialposts";
import { useIsMobile } from "@/hooks/use-mobile";
import { extractLinkedInID } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- FIXED HEIGHTS ---------------- */

// LinkedIn (separate for post vs video)
const LINKEDIN_POST_HEIGHT_MOBILE = 540;
const LINKEDIN_VIDEO_HEIGHT_MOBILE = 540;

const LINKEDIN_POST_HEIGHT_DESKTOP = 630;
const LINKEDIN_VIDEO_HEIGHT_DESKTOP = 630;

// Instagram
const INSTAGRAM_EMBED_HEIGHT_DESKTOP = 610;
const INSTAGRAM_EMBED_HEIGHT_MOBILE = 440;

/* ---------------- HELPERS ---------------- */

function isLinkedInVideo(url: string): boolean {
  return url.includes("video");
}

interface SocialFeedProps {
  initialPosts: SocialPost[];
  settings?: {
    socialTitle: string;
    socialSubtitle: string;
    linkedinLabel: string;
    instagramLabel: string;
    youtubeLabel: string;
  };
}

export function SocialFeed({ initialPosts, settings }: SocialFeedProps) {
  const posts = initialPosts || [];
  const linkedinPosts = posts.filter((post) => post.platform === "linkedin");
  const instagramPosts = posts.filter((post) => post.platform === "instagram");
  const youtubePosts = posts.filter((post) => post.platform === "youtube");

  useEffect(() => {
    if (typeof window !== "undefined" && linkedinPosts.length > 0) {
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
            {settings?.socialTitle || "Follow Our Journey"}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-2 md:mt-4">
            {settings?.socialSubtitle || "Stay updated with the latest from Let's UBX on social media."}
          </p>
        </motion.div>

        {linkedinPosts.length > 0 && (
          <SocialRow
            title={settings?.linkedinLabel || "LinkedIn Updates"}
            posts={linkedinPosts}
            platform="linkedin"
          />
        )}

        {instagramPosts.length > 0 && (
          <SocialRow
            title={settings?.instagramLabel || "Instagram Highlights"}
            posts={instagramPosts}
            platform="instagram"
          />
        )}

        {youtubePosts.length > 0 && (
          <SocialRow
            title={settings?.youtubeLabel || "YouTube Podcasts"}
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cardBgClass =
    platform === "linkedin"
      ? "bg-[#0A66C2]"
      : platform === "instagram"
        ? "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
        : "bg-[#FF0000]";

  // KEEP EXISTING LOGIC for non-linkedin
  const baseEmbedHeight =
    isMobile
      ? INSTAGRAM_EMBED_HEIGHT_MOBILE
      : INSTAGRAM_EMBED_HEIGHT_DESKTOP;

  const scrollByOneCard = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>(
      "[data-social-card='true']"
    );
    const cardWidth =
      firstCard?.offsetWidth ?? container.clientWidth * 0.9;
    const gap = isMobile ? 16 : 24;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const firstCard = container.querySelector<HTMLElement>(
        "[data-social-card='true']"
      );
      const cardWidth =
        firstCard?.offsetWidth ?? container.clientWidth * 0.9;
      const gap = isMobile ? 16 : 24;
      const step = cardWidth + gap;
      const maxIndex = Math.max(posts.length - 1, 0);
      const activeIndex =
        step > 0 ? Math.round(container.scrollLeft / step) : 0;

      setCanScrollLeft(activeIndex > 0);
      setCanScrollRight(activeIndex < maxIndex);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [posts.length, isMobile]);

  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold">
          {title}
        </h3>

        {/* DESKTOP BUTTONS (UNCHANGED) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <button onClick={() => scrollByOneCard("prev")}>
            <div className="flex -space-x-3 sm:-space-x-4">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
          </button>
          <button onClick={() => scrollByOneCard("next")}>
            <div className="flex -space-x-3 sm:-space-x-4">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* MOBILE BUTTONS (UNCHANGED) */}
        <div className="flex md:hidden items-center gap-2">
          {canScrollLeft && (
            <button onClick={() => scrollByOneCard("prev")}>
              <div className="flex -space-x-3 sm:-space-x-4">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
            </button>
          )}
          {canScrollRight && (
            <button onClick={() => scrollByOneCard("next")}>
              <div className="flex -space-x-3 sm:-space-x-4">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-scroll -mx-2 px-4 snap-x snap-mandatory 
  scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post, index) => {
          // ✅ FIX: dynamic height per LinkedIn post
          const dynamicHeight =
            platform === "linkedin"
              ? isLinkedInVideo(post.post_url)
                ? (isMobile
                  ? LINKEDIN_VIDEO_HEIGHT_MOBILE
                  : LINKEDIN_VIDEO_HEIGHT_DESKTOP)
                : (isMobile
                  ? LINKEDIN_POST_HEIGHT_MOBILE
                  : LINKEDIN_POST_HEIGHT_DESKTOP)
              : baseEmbedHeight;

          return (
            <motion.div
              key={post.id}
              data-social-card="true"
              className={`snap-start shrink-0 w-[90vw] sm:w-[68vw] md:w-[400px] rounded-2xl p-2 sm:p-3 overflow-hidden shadow-lg ${cardBgClass}`}
            >
              <div
                className="bg-background rounded-lg overflow-hidden relative"
                style={
                  platform === "youtube"
                    ? {
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                    }
                    : { height: dynamicHeight }
                }
              >
                {/* INSTAGRAM */}
                {platform === "instagram" ? (
                  <iframe
                    src={getInstagramEmbedUrl(post.post_url)}
                    height={dynamicHeight}
                    width="100%"
                    frameBorder="0"
                    scrolling="no"
                    className="w-full border-none"
                  />
                ) : platform === "youtube" ? (
                  /* YOUTUBE */
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeID(
                      post.post_url
                    )}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  /* LINKEDIN (FIXED) */
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${extractLinkedInID(
                      post.post_url
                    )}?collapsed=1`}
                    height={dynamicHeight}
                    width="100%"
                    className="w-full border-none"
                    scrolling="no"
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

/* ---------------- EXISTING HELPERS ---------------- */

function getInstagramEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/(p|reel|tv)\/([^/?#]+)/i);
    if (match?.[1] && match?.[2]) {
      return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/`;
    }
  } catch { }
  return url.includes("/embed")
    ? url
    : `${url.split("?")[0]}embed`;
}

function getYouTubeID(url: string): string {
  const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return arr[2]
    ? arr[2].split(/[^0-9a-z_\-]/i)[0]
    : arr[0];
}