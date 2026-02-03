"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hero Title Animation
export const AnimatedTitle = ({ children }: { children: React.ReactNode }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.to(titleRef.current, {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={titleRef}
      className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-white"
      style={{ backgroundSize: "200% auto" }}
    >
      {children}
    </h1>
  );
};

// Animated Section (for project cards, etc)
export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

// Staggered List Animation (for project grids)
export const StaggeredGrid = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const columns = gridRef.current?.children;
      if (!columns) return;

      // Animate each column's cards individually as they enter viewport
      Array.from(columns).forEach((column) => {
        const cards = column.children;
        Array.from(cards).forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power2.out",
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
};

// Line Drawing Animation
export const AnimatedLine = ({ className = "" }: { className?: string }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power2.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={lineRef} className={className} />;
};

// Parallax Section
export const ParallaxSection = ({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

// Project Header Animation
export const AnimatedProjectHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".animate-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".animate-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".animate-links",
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, []);

  return <div ref={headerRef}>{children}</div>;
};

// Magnetic Button Effect
export const MagneticButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const magneticRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={className}>
      {children}
    </button>
  );
};

// Animated MDX Content
export const AnimatedMdxContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each heading individually when it enters viewport
      const headings =
        contentRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6") || [];
      headings.forEach((heading) => {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Animate each paragraph individually
      const paragraphs = contentRef.current?.querySelectorAll("p") || [];
      paragraphs.forEach((p) => {
        gsap.from(p, {
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Animate each list item individually
      const listItems = contentRef.current?.querySelectorAll("li") || [];
      listItems.forEach((li) => {
        gsap.from(li, {
          scrollTrigger: {
            trigger: li,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: -15,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      // Animate code blocks individually
      const codeBlocks = contentRef.current?.querySelectorAll("pre") || [];
      codeBlocks.forEach((pre) => {
        gsap.from(pre, {
          scrollTrigger: {
            trigger: pre,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          x: -20,
          duration: 0.7,
          ease: "power2.out",
        });
      });

      // Animate images individually
      const images = contentRef.current?.querySelectorAll("img") || [];
      images.forEach((img) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          ease: "power3.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={contentRef}>{children}</div>;
};
