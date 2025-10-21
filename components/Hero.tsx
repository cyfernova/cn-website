"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

if (typeof window !== "undefined") {
    const img1 = new Image();
    img1.src = "/cyfernova.svg";
    const img2 = new Image();
    img2.src = "/white.png";
}

const DEFAULT_ROWS = 6;
const DEFAULT_COLS = 6;
const BLOCK_SIZE = 50;
const COOLDOWN = 1000;

export default function TileBoard() {
    const boardRef = useRef<HTMLDivElement>(null);
    const blocksRef = useRef<HTMLDivElement>(null);
    const isFlippedRef = useRef(false);
    const blockInfoRef = useRef<{ numCols: number; numBlocks: number } | null>(
        null,
    );
    const gridRef = useRef<{ rows: number; cols: number } | null>(null);

    const getGridConfig = useCallback((): { rows: number; cols: number } => {
        if (typeof window === "undefined")
            return { rows: DEFAULT_ROWS, cols: DEFAULT_COLS };
        const w = window.innerWidth;

        if (w <= 420) return { rows: 6, cols: 3 };
        if (w <= 640) return { rows: 6, cols: 4 };
        if (w <= 820) return { rows: 6, cols: 5 };
        return { rows: DEFAULT_ROWS, cols: DEFAULT_COLS };
    }, []);

    const createTile = useCallback(
        (
            row: number,
            col: number,
            rows: number,
            cols: number,
        ): HTMLDivElement => {
            const tile = document.createElement("div");
            tile.className = "tile flex-1 relative";
            tile.style.transformStyle = "preserve-3d";

            const posX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
            const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;
            const bgSizeX = `${cols * 100}%`;
            const bgSizeY = `${rows * 100}%`;

            // Create tile faces using DOM methods instead of innerHTML
            const tileFront = document.createElement("div");
            tileFront.className =
                "tile-face tile-front absolute w-full h-full rounded-lg overflow-hidden";
            tileFront.style.cssText = `backface-visibility: hidden; background-color: #2f4f4f; --bg-size-x: ${bgSizeX}; --bg-size-y: ${bgSizeY}; --bg-pos-x: ${posX}%; --bg-pos-y: ${posY}%`;

            const tileBack = document.createElement("div");
            tileBack.className =
                "tile-face tile-back absolute w-full h-full rounded-lg overflow-hidden";
            tileBack.style.cssText = `backface-visibility: hidden; background-color: #483d8b; transform: rotateX(180deg); --bg-size-x: ${bgSizeX}; --bg-size-y: ${bgSizeY}; --bg-pos-x: ${posX}%; --bg-pos-y: ${posY}%`;

            tile.appendChild(tileFront);
            tile.appendChild(tileBack);

            return tile;
        },
        [],
    );

    const animateTile = useCallback((tile: HTMLElement, tilety: number) => {
        const isFlipped = isFlippedRef.current;
        gsap.timeline()
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
    }, []);

    const initializeTileAnimations = useCallback(() => {
        const tiles = boardRef.current?.querySelectorAll(".tile");
        if (!tiles) return;
        const numCols = gridRef.current?.cols ?? DEFAULT_COLS;

        tiles.forEach((tile, index) => {
            let lastEnterTime = 0;

            tile.addEventListener("mouseenter", () => {
                const currentTime = Date.now();
                if (currentTime - lastEnterTime > COOLDOWN) {
                    lastEnterTime = currentTime;

                    const colIndex = index % numCols;
                    let tilety: number;
                    if (colIndex === 0) {
                        tilety = -40;
                    } else if (colIndex === numCols - 1) {
                        tilety = 40;
                    } else if (colIndex === 1) {
                        tilety = -20;
                    } else if (colIndex === numCols - 2) {
                        tilety = 20;
                    } else if (colIndex === 2) {
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
        const { rows, cols } = getGridConfig();
        gridRef.current = { rows, cols };

        // Clear children properly to avoid hydration issues
        while (boardRef.current.firstChild) {
            boardRef.current.removeChild(boardRef.current.firstChild);
        }

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < rows; i++) {
            const row = document.createElement("div");
            row.className = "flex-1 flex gap-1";

            for (let j = 0; j < cols; j++) {
                const tile = createTile(i, j, rows, cols);
                row.appendChild(tile);
            }

            fragment.appendChild(row);
        }

        boardRef.current.appendChild(fragment);
        initializeTileAnimations();
    }, [createTile, initializeTileAnimations, getGridConfig]);

    const flipAllTiles = useCallback(() => {
        const tiles = boardRef.current?.querySelectorAll(".tile");
        if (!tiles) return;

        isFlippedRef.current = !isFlippedRef.current;
        const isFlipped = isFlippedRef.current;

        gsap.to(tiles, {
            rotateX: isFlipped ? 180 : 0,
            duration: 1,
            stagger: {
                amount: 0.5,
                from: "random",
            },
            ease: "power2.inOut",
        });
    }, []);

    const createBlocks = useCallback(() => {
        if (!blocksRef.current) return;

        // Clear children properly to avoid hydration issues
        while (blocksRef.current.firstChild) {
            blocksRef.current.removeChild(blocksRef.current.firstChild);
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const numCols = Math.ceil(screenWidth / BLOCK_SIZE);
        const numRows = Math.ceil(screenHeight / BLOCK_SIZE);
        const numBlocks = numCols * numRows;

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

        let rafId: number | null = null;
        const handleMouseMove = (event: MouseEvent) => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                highlightBlock(event);
                rafId = null;
            });
        };

        document.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });

        let resizeTimeout: number | null = null;
        const handleResize = () => {
            if (resizeTimeout) window.clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                const next = getGridConfig();
                const current = gridRef.current;
                if (
                    !current ||
                    current.rows !== next.rows ||
                    current.cols !== next.cols
                ) {
                    createBoard();
                }
            }, 150);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
        };
    }, [createBoard, createBlocks, highlightBlock, getGridConfig]);

    return (
        <main className="hero-root relative w-screen h-screen overflow-hidden">
            <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-8 z-[100] pointer-events-none">
                <Link
                    href="/"
                    className="text-white text-3xl font-bold pointer-events-auto hover:opacity-80 transition-opacity"
                >
                    CyferNova
                </Link>
                <button
                    type="button"
                    onClick={flipAllTiles}
                    className="border-none outline-none text-white bg-black rounded px-4 py-2 uppercase text-xl pointer-events-auto hover:bg-gray-900 transition-colors mr-[160px]"
                >
                    Flip Tiles
                </button>
            </nav>

            <div
                ref={boardRef}
                className="w-screen h-screen p-1 flex flex-col gap-1 bg-black relative z-[1]"
                style={{ perspective: "1000px" }}
                suppressHydrationWarning
            ></div>

            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none z-[2]">
                <div
                    ref={blocksRef}
                    className="w-[105vw] h-screen flex flex-wrap justify-start content-start overflow-hidden"
                    suppressHydrationWarning
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
          background-size: var(--bg-size-x, 600%) var(--bg-size-y, 600%);
          background-position: var(--bg-pos-x, 0%) var(--bg-pos-y, 0%);
          clip-path: inset(0 round 0.25em);
        }
        
        .tile-front::before {
          background-image: url('/cyfernova.svg');
        }
        
        .tile-back::before {
          background-image: url('/white.png');
        }
      `}</style>
        </main>
    );
}
