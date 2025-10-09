"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Preload critical images
if (typeof window !== "undefined") {
  const img1 = new Image();
  img1.src = "/cyfernova.png";
  const img2 = new Image();
  img2.src = "/testimonial.png";
}

const ROWS = 6;
const COLS = 6;
const BLOCK_SIZE = 50;
const COOLDOWN = 1000;

export default function TileBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const blockInfoRef = useRef<{ numCols: number; numBlocks: number } | null>(
    null,
  );

  // Function declarations
  const createTile = useCallback((row: number, col: number): HTMLDivElement => {
    const tile = document.createElement("div");
    tile.className = "tile flex-1 relative";
    tile.style.transformStyle = "preserve-3d";

    const bgPosition = `${col * 20}% ${row * 20}%`;

    tile.innerHTML = `
      <div class="tile-face tile-front absolute w-full h-full rounded-lg overflow-hidden" style="backface-visibility: hidden; background-color: #2f4f4f; background-position: ${bgPosition}"></div>
      <div class="tile-face tile-back absolute w-full h-full rounded-lg overflow-hidden" style="backface-visibility: hidden; background-color: #483d8b; transform: rotateX(180deg); background-position: ${bgPosition}"></div>
    `;

    return tile;
  }, []);

  const animateTile = useCallback(
    (tile: HTMLElement, tilety: number) => {
      gsap
        .timeline()
        .set(tile, { rotateX: isFlipped ? 180 : 0, rotateY: 0 })
        .to(tile, {
          rotateX: isFlipped ? 450 : 270,
          rotateY: tilety,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(
          tile,
          {
            rotateX: isFlipped ? 540 : 360,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.25",
        );
    },
    [isFlipped],
  );

  const initializeTileAnimations = useCallback(() => {
    const tiles = boardRef.current?.querySelectorAll(".tile");
    if (!tiles) return;

    tiles.forEach((tile, index) => {
      let lastEnterTime = 0;

      tile.addEventListener("mouseenter", () => {
        const currentTime = Date.now();
        if (currentTime - lastEnterTime > COOLDOWN) {
          lastEnterTime = currentTime;

          let tilety: number;
          if (index % 6 === 0) {
            tilety = -40;
          } else if (index % 6 === 5) {
            tilety = 40;
          } else if (index % 6 === 1) {
            tilety = -20;
          } else if (index % 6 === 4) {
            tilety = 20;
          } else if (index % 6 === 2) {
            tilety = -10;
          } else {
            tilety = 10;
          }

          animateTile(tile as HTMLElement, tilety);
        }
      });
    });
  }, [animateTile]);

  const createBoard = useCallback(() => {
    if (!boardRef.current) return;

    boardRef.current.innerHTML = "";

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < ROWS; i++) {
      const row = document.createElement("div");
      row.className = "flex-1 flex gap-1";

      for (let j = 0; j < COLS; j++) {
        const tile = createTile(i, j);
        row.appendChild(tile);
      }

      fragment.appendChild(row);
    }

    boardRef.current.appendChild(fragment);
    initializeTileAnimations();
  }, [createTile, initializeTileAnimations]);

  const flipAllTiles = () => {
    const tiles = boardRef.current?.querySelectorAll(".tile");
    if (!tiles) return;

    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);

    gsap.to(tiles, {
      rotateX: newFlipped ? 180 : 0,
      duration: 1,
      stagger: {
        amount: 0.5,
        from: "random",
      },
      ease: "power2.inOut",
    });
  };

  const createBlocks = useCallback(() => {
    if (!blocksRef.current) return;

    blocksRef.current.innerHTML = "";

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const numCols = Math.ceil(screenWidth / BLOCK_SIZE);
    const numRows = Math.ceil(screenHeight / BLOCK_SIZE);
    const numBlocks = numCols * numRows;

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numBlocks; i++) {
      const block = document.createElement("div");
      block.className =
        "w-[50px] h-[50px] border border-transparent transition-colors duration-300";
      block.dataset.index = String(i);
      fragment.appendChild(block);
    }

    blocksRef.current.appendChild(fragment);
    blockInfoRef.current = { numCols, numBlocks };
  }, []);

  const highlightBlock = useCallback((event: MouseEvent) => {
    if (!blocksRef.current || !blockInfoRef.current) return;

    const { numCols } = blockInfoRef.current;
    const rect = blocksRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / BLOCK_SIZE);
    const row = Math.floor(y / BLOCK_SIZE);
    const index = row * numCols + col;
    const block = blocksRef.current.children[index] as HTMLElement;

    if (block) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        block.classList.add("border-white");
        setTimeout(() => {
          requestAnimationFrame(() => {
            block.classList.remove("border-white");
          });
        }, 250);
      });
    }
  }, []);

  useEffect(() => {
    createBoard();
    createBlocks();

    // Throttle mouse move event for better performance
    let rafId: number | null = null;
    const handleMouseMove = (event: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        highlightBlock(event);
        rafId = null;
      });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [createBoard, createBlocks, highlightBlock]);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-8 z-10 pointer-events-none">
        <Link
          href="/"
          className="text-white text-3xl font-bold pointer-events-auto hover:opacity-80 transition-opacity"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          CyferNova
        </Link>
        <button
          type="button"
          onClick={flipAllTiles}
          className="border-none outline-none text-white bg-black rounded px-4 py-2 uppercase text-xl pointer-events-auto hover:bg-gray-900 transition-colors"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Flip Tiles
        </button>
      </nav>

      <div
        ref={boardRef}
        className="w-screen h-screen p-1 flex flex-col gap-1 bg-black relative z-[1]"
        style={{ perspective: "1000px" }}
      ></div>

      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-[2]">
        <div
          ref={blocksRef}
          className="w-[105vw] h-screen flex flex-wrap justify-start content-start overflow-hidden"
        ></div>
      </div>

      <style jsx global>{`
        .tile-front::before,
        .tile-back::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: 600% 600%;
          background-position: inherit;
          clip-path: inset(0 round 0.25em);
        }
        
        .tile-front::before {
          background-image: url('/cyfernova.png');
        }
        
        .tile-back::before {
          background-image: url('/testimonial.png');
        }
      `}</style>
    </main>
  );
}
