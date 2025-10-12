"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import "./Menu.css";

export default function Menu() {
    const menuToggleRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef(false);

    useEffect(() => {
        // Split text into spans
        const splitTextIntoSpans = (selector: string) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                const text = element.textContent || "";
                // Clear the element first to avoid hydration mismatch
                element.textContent = "";
                // Create spans as DOM nodes instead of using innerHTML
                text.split("").forEach((char) => {
                    const span = document.createElement("span");
                    span.textContent = char === " " ? "\u00A0\u00A0" : char;
                    element.appendChild(span);
                });
            });
        };

        splitTextIntoSpans(".header h1");

        const menuToggle = menuToggleRef.current;
        const menu = menuRef.current;

        if (!menuToggle || !menu) return;

        const handleToggle = () => {
            if (isAnimatingRef.current) return;

            const links = document.querySelectorAll(".menu-link");
            const socials = document.querySelectorAll(".socials p");

            if (menuToggle.classList.contains("closed")) {
                menuToggle.classList.remove("closed");
                menuToggle.classList.add("opened");
                menu.classList.add("opened");
                document.body.classList.add("menu-open");
                isAnimatingRef.current = true;

                gsap.to(menu, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    duration: 1.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        isAnimatingRef.current = false;
                    },
                });

                gsap.to(links, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    delay: 0.85,
                    duration: 1,
                    ease: "power3.out",
                });

                gsap.to(socials, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    delay: 0.85,
                    duration: 1,
                    ease: "power3.out",
                });

                gsap.to(".video-wrapper", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    ease: "back.out(1.2)",
                    duration: 1.5,
                    delay: 0.5,
                });

                gsap.to(".header h1 span", {
                    rotateY: 0,
                    stagger: 0.05,
                    delay: 0.75,
                    duration: 1.5,
                    ease: "power4.out",
                });

                gsap.to(".header h1 span", {
                    y: 0,
                    scale: 1,
                    stagger: 0.05,
                    delay: 0.75,
                    duration: 1.5,
                    ease: "power4.out",
                });
            } else {
                menuToggle.classList.remove("opened");
                menuToggle.classList.add("closed");
                menu.classList.remove("opened");
                isAnimatingRef.current = true;

                gsap.to(menu, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        gsap.set(menu, {
                            clipPath:
                                "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                        });
                        gsap.set(links, { y: 30, opacity: 0 });
                        gsap.set(socials, { y: 30, opacity: 0 });
                        gsap.set(".video-wrapper", {
                            clipPath:
                                "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                        });
                        gsap.set(".header h1 span", {
                            y: 50,
                            rotateY: 90,
                            scale: 0.75,
                        });
                        document.body.classList.remove("menu-open");
                        isAnimatingRef.current = false;
                    },
                });
            }
        };

        menuToggle.addEventListener("click", handleToggle);

        return () => {
            menuToggle.removeEventListener("click", handleToggle);
        };
    }, []);

    return (
        <>
            <div className="menu-toggle closed" ref={menuToggleRef}>
                <div className="menu-toggle-icon">
                    <div className="hamburger">
                        <div className="menu-bar" data-position="top"></div>
                        <div className="menu-bar" data-position="bottom"></div>
                    </div>
                </div>
                <div className="menu-copy">
                    <p>Menu</p>
                </div>
            </div>

            <div className="menu" ref={menuRef}>
                <div className="col col-1">
                    <div className="menu-logo">Cyfernova</div>
                    <div className="links">
                        <div className="menu-link">
                            <a href="/projects" className="href">
                                Projects
                            </a>
                        </div>
                        <div className="menu-link">
                            <a href="/expertise" className="href">
                                Expertise
                            </a>
                        </div>
                        <div className="menu-link">
                            <a href="/agency" className="href">
                                Agency
                            </a>
                        </div>
                        <div className="menu-link">
                            <a href="/contact" className="href">
                                Contact
                            </a>
                        </div>
                    </div>
                    <div className="video-wrapper">
                        <video autoPlay muted loop playsInline>
                            <source src="/video.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
                <div className="col col-2">
                    <div className="socials">
                        <div className="sub-col">
                            <p>Cyfernova</p>
                            <p>Lorem ipsum gypsum nipsum quadrpsum</p>
                            <p>West Bengal, India</p>
                            <br />
                            <p>work.cyfernova.in@gmail.com</p>
                            <p>contact.cyfernova.in@gmail.com</p>
                        </div>
                        <div className="sub-col">
                            <p>Instagram</p>
                            <p>LinkedIn</p>
                            <p>X</p>
                            <p>YouTube</p>
                            <br />
                            <p>01 62 31 82 42</p>
                        </div>
                    </div>
                    <div className="header">
                        <h1 suppressHydrationWarning={true}>Cyfernova</h1>
                    </div>
                </div>
            </div>
        </>
    );
}
