"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
    const workSectionRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);
    const lettersCanvasRef = useRef<HTMLCanvasElement>(null);
    const cardsCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!workSectionRef.current || !textContainerRef.current) return;

        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        const _workSection = workSectionRef.current;
        const textContainer = textContainerRef.current;

        const lerp = (start: number, end: number, t: number) =>
            start + (end - start) * t;

        // Grid Canvas Setup
        const gridCanvas = gridCanvasRef.current;
        const gridCtx = gridCanvas?.getContext("2d");

        if (!gridCanvas || !gridCtx) return;

        const resizeGridCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            gridCanvas.width = window.innerWidth * dpr;
            gridCanvas.height = window.innerHeight * dpr;
            gridCanvas.style.width = `${window.innerWidth}px`;
            gridCanvas.style.height = `${window.innerHeight}px`;
            gridCtx.scale(dpr, dpr);
        };
        resizeGridCanvas();

        const drawGrid = (scrollProgress = 0) => {
            gridCtx.fillStyle = "black";
            gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
            gridCtx.fillStyle = "#f5f5f0";
            const [dotSize, spacing] = [0.75, 20];
            const [rows, cols] = [
                Math.ceil(gridCanvas.height / spacing),
                Math.ceil(gridCanvas.width / spacing) + 15,
            ];
            const offset = (scrollProgress * spacing * 10) % spacing;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    gridCtx.beginPath();
                    gridCtx.arc(
                        x * spacing - offset,
                        y * spacing,
                        dotSize,
                        0,
                        Math.PI * 2,
                    );
                    gridCtx.fill();
                }
            }
        };

        // Define interfaces to replace any types
        interface ExtendedLine extends THREE.Line {
            curve: THREE.CatmullRomCurve3;
            letterElements: HTMLElement[];
        }

        // Three.js Setup
        const lettersScene = new THREE.Scene();
        const cardsScene = new THREE.Scene();

        const createCamera = () =>
            new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
            );

        const lettersCamera = createCamera();
        const cardsCamera = createCamera();

        const lettersRenderer = new THREE.WebGLRenderer({
            canvas: lettersCanvasRef.current || undefined,
            antialias: true,
            alpha: true,
        });
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        lettersRenderer.setClearColor(0x000000, 0);
        lettersRenderer.setPixelRatio(window.devicePixelRatio);

        const cardsRenderer = new THREE.WebGLRenderer({
            canvas: cardsCanvasRef.current || undefined,
            antialias: true,
            alpha: true,
        });
        cardsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        cardsRenderer.setSize(window.innerWidth, window.innerHeight);
        cardsRenderer.setClearColor(0x000000, 0);

        const createTextAnimationPath = (yPos: number, amplitude: number) => {
            const points = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                points.push(
                    new THREE.Vector3(
                        -25 + 50 * t,
                        yPos + Math.sin(t * Math.PI) * -amplitude,
                        (1 - (Math.abs(t - 0.5) * 2) ** 2) * -5,
                    ),
                );
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
                new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 }),
            );
            (line as unknown as ExtendedLine).curve = curve;
            return line;
        };

        const paths = [
            createTextAnimationPath(10, 2),
            createTextAnimationPath(3.5, 1),
            createTextAnimationPath(-3.5, -1),
            createTextAnimationPath(-10, -2),
        ];
        paths.forEach((line) => {
            lettersScene.add(line);
        });

        const letterPositions = new Map<
            HTMLElement,
            {
                current: { x: number; y: number };
                target: { x: number; y: number };
            }
        >();
        paths.forEach((line, i) => {
            (line as unknown as ExtendedLine).letterElements = Array.from(
                { length: 15 },
                () => {
                    const el = document.createElement("div");
                    el.className = "letter";
                    el.textContent = ["W", "O", "R", "K"][i] ?? "";
                    textContainer.appendChild(el);
                    letterPositions.set(el, {
                        current: { x: 0, y: 0 },
                        target: { x: 0, y: 0 },
                    });
                    return el;
                },
            );
        });

        const loadImage = (num: number) =>
            new Promise<THREE.Texture>((resolve) => {
                const _texture = new THREE.TextureLoader().load(
                    `/assets/img${num}.jpg`,
                    (loadedTexture) => {
                        Object.assign(loadedTexture, {
                            generateMipmaps: true,
                            minFilter: THREE.LinearMipmapLinearFilter,
                            magFilter: THREE.LinearFilter,
                            anisotropy:
                                cardsRenderer.capabilities.getMaxAnisotropy(),
                        });
                        resolve(loadedTexture);
                    },
                );
            });

        Promise.all([1, 2, 3, 4, 5, 6, 7].map(loadImage)).then((images) => {
            const textureCanvas = document.createElement("canvas");
            const ctx = textureCanvas.getContext("2d");
            if (!ctx) return;
            textureCanvas.width = 4096;
            textureCanvas.height = 2048;

            const drawCardsOnCanvas = (offset = 0) => {
                ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
                const [cardWidth, cardHeight] = [
                    textureCanvas.width / 3,
                    textureCanvas.height / 2,
                ];
                const spacing = textureCanvas.width / 2.5;
                images.forEach((img, i) => {
                    if (img?.image) {
                        ctx.drawImage(
                            img.image,
                            i * spacing +
                                (0.35 - offset) * textureCanvas.width * 5 -
                                cardWidth,
                            (textureCanvas.height - cardHeight) / 2,
                            cardWidth,
                            cardHeight,
                        );
                    }
                });
            };

            const cardsTexture = new THREE.CanvasTexture(textureCanvas);
            Object.assign(cardsTexture, {
                generateMipmaps: true,
                minFilter: THREE.LinearMipmapLinearFilter,
                magFilter: THREE.LinearFilter,
                anisotropy: cardsRenderer.capabilities.getMaxAnisotropy(),
                wrapS: THREE.RepeatWrapping,
                wrapT: THREE.RepeatWrapping,
            });

            const cardsPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(30, 15, 50, 1),
                new THREE.MeshBasicMaterial({
                    map: cardsTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 1,
                    depthTest: false,
                    depthWrite: false,
                }),
            );
            cardsScene.add(cardsPlane);

            const positionsAttr = cardsPlane.geometry.attributes
                .position as THREE.BufferAttribute;
            for (let i = 0; i < positionsAttr.count; i++) {
                positionsAttr.setZ(i, (positionsAttr.getX(i) / 15) ** 2 * 5);
            }
            positionsAttr.needsUpdate = true;

            [lettersCamera, cardsCamera].forEach((camera) => {
                camera.position.setZ(20);
            });

            const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
            const updateTargetPositions = (scrollProgress = 0) => {
                paths.forEach((line, lineIndex) => {
                    (line as unknown as ExtendedLine).letterElements.forEach(
                        (element: HTMLElement, i: number) => {
                            const speed = lineSpeedMultipliers[lineIndex] ?? 1;
                            const point = (
                                line as unknown as ExtendedLine
                            ).curve.getPoint(
                                (i / 14 + scrollProgress * speed) % 1,
                            );
                            const vector = point.clone().project(lettersCamera);
                            const pos = letterPositions.get(element);
                            if (!pos) return;
                            pos.target = {
                                x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
                                y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
                            };
                        },
                    );
                });
            };

            const updateLetterPositions = () => {
                letterPositions.forEach((positions, element) => {
                    const distX = positions.target.x - positions.current.x;
                    if (Math.abs(distX) > window.innerWidth * 0.7) {
                        [positions.current.x, positions.current.y] = [
                            positions.target.x,
                            positions.target.y,
                        ];
                    } else {
                        positions.current.x = lerp(
                            positions.current.x,
                            positions.target.x,
                            0.07,
                        );
                        positions.current.y = lerp(
                            positions.current.y,
                            positions.target.y,
                            0.07,
                        );
                    }
                    element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
                });
            };

            const animate = () => {
                updateLetterPositions();
                lettersRenderer.render(lettersScene, lettersCamera);
                cardsRenderer.render(cardsScene, cardsCamera);
                requestAnimationFrame(animate);
            };

            ScrollTrigger.create({
                trigger: ".work",
                start: "top top",
                end: "+=700%",
                pin: true,
                pinSpacing: true,
                scrub: 1,
                onUpdate: (self) => {
                    updateTargetPositions(self.progress);
                    drawCardsOnCanvas(self.progress);
                    drawGrid(self.progress);
                    cardsTexture.needsUpdate = true;
                },
            });

            drawGrid(0);
            animate();
            updateTargetPositions(0);

            const handleResize = () => {
                resizeGridCanvas();
                drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
                [lettersCamera, cardsCamera].forEach((camera) => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                });
                [lettersRenderer, cardsRenderer].forEach((renderer) => {
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
                cardsRenderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2),
                );
                updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
            };

            window.addEventListener("resize", handleResize);
        });

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill();
            });
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
    }, []);

    return (
        <>
            <style jsx global>{`
        .letter {
          position: absolute;
          font-family: "Bigger", sans-serif;
          font-size: 14rem;
          font-weight: bold;
          color: #f5f5f0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          opacity: 1;
          z-index: 2;
          transform-origin: center;
          transform-style: preserve-3d;
          will-change: transform;
        }
      `}</style>

            <section className="w-screen h-screen flex items-center justify-center bg-[#f5f5f0] text-black relative">
                <div className="max-w-5xl px-6 md:px-10">
                    <h1 className="text-3xl md:text-5xl leading-tight font-light italic">
                        “Being your own boss means you have no one to blame but
                        yourself — and that’s the best motivation there is.”
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl tracking-wide">
                        — Sophia Amoruso
                    </p>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-black/60 text-xs md:text-sm tracking-wider flex flex-col items-center select-none">
                    <span>Scroll down</span>
                    <span className="animate-bounce mt-1">↓</span>
                </div>
            </section>

            <section
                ref={workSectionRef}
                className="work relative w-screen h-screen bg-black overflow-hidden"
            >
                <canvas
                    ref={gridCanvasRef}
                    className="absolute top-0 left-0 z-0"
                />
                <canvas
                    ref={lettersCanvasRef}
                    className="absolute top-0 left-0 z-[1]"
                />
                <canvas
                    ref={cardsCanvasRef}
                    className="absolute top-0 left-0 z-[10]"
                />
                <div
                    ref={textContainerRef}
                    className="w-full h-full absolute top-0 left-0 z-[2] pointer-events-none"
                    style={{
                        perspective: "2500px",
                        perspectiveOrigin: "center",
                    }}
                />
            </section>

            <section className="w-screen h-screen flex items-center justify-center bg-[#f5f5f0] text-black relative -top-[0.125em]">
                <div className="max-w-5xl px-6 md:px-10">
                    <h1 className="text-3xl md:text-5xl leading-tight font-light italic">
                        “If you want to fly, you have to give up the things that
                        weigh you down.”
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl tracking-wide">
                        — Toni Morrison
                    </p>
                </div>
            </section>
        </>
    );
}
