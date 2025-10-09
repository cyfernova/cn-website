"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function TransitionOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ease = "power4.inOut";

    const revealTransition = () =>
      new Promise<void>((resolve) => {
        gsap.set(container.querySelectorAll(".block"), {
          scaleY: 1,
          visibility: "visible",
        });
        gsap.to(container.querySelectorAll(".block"), {
          scaleY: 0,
          duration: 1,
          stagger: {
            each: 0.1,
            from: "start",
            grid: "auto",
            axis: "x",
          },
          ease,
          onComplete: () => resolve(),
        });
      });

    const animateTransition = () =>
      new Promise<void>((resolve) => {
        gsap.set(container.querySelectorAll(".block"), {
          visibility: "visible",
          scaleY: 0,
          transformOrigin: "center",
        });
        gsap.to(container.querySelectorAll(".block"), {
          scaleY: 1,
          duration: 1,
          stagger: {
            each: 0.1,
            from: "start",
            grid: [2, 5],
            axis: "x",
          },
          ease,
          onComplete: () => resolve(),
        });
      });

    revealTransition().then(() => {
      gsap.set(container.querySelectorAll(".block"), { visibility: "hidden" });
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      event.preventDefault();
      animateTransition().then(() => {
        window.location.href = url.pathname + url.search + url.hash;
      });
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="transition pointer-events-none"
      aria-hidden="true"
    >
      <div className="transition-row row-1">
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
      </div>
      <div className="transition-row row-2">
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
      </div>
    </div>
  );
}
