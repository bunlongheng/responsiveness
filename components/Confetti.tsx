"use client";
import { useRef, useEffect } from "react";

const CONFETTI_COLORS = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#007aff", "#5856d6", "#af52de", "#ff2d55", "#00c7be", "#ff66cc"];

/** A one-shot confetti burst that re-fires whenever `trigger` increments. */
export function Confetti({ trigger }: { trigger: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (trigger === 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        type P = { x: number; y: number; vx: number; vy: number; color: string; rot: number; rotV: number; w: number; h: number; alpha: number; shape: "rect" | "circle" };
        const particles: P[] = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: -10 - Math.random() * 120,
            vx: (Math.random() - 0.5) * 5,
            vy: 2.5 + Math.random() * 4.5,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.22,
            w: 7 + Math.random() * 8,
            h: 4 + Math.random() * 5,
            alpha: 1,
            shape: Math.random() > 0.45 ? "rect" : "circle",
        }));

        const W = canvas.width;
        const H = canvas.height;
        let frame = 0;
        let raf: number;
        function draw() {
            ctx!.clearRect(0, 0, W, H);
            let alive = false;
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.14;
                p.rot += p.rotV;
                if (frame > 55) p.alpha = Math.max(0, p.alpha - 0.013);
                if (p.alpha > 0.01 && p.y < H + 30) alive = true;
                ctx!.save();
                ctx!.globalAlpha = p.alpha;
                ctx!.translate(p.x, p.y);
                ctx!.rotate(p.rot);
                ctx!.fillStyle = p.color;
                if (p.shape === "circle") {
                    ctx!.beginPath();
                    ctx!.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctx!.fill();
                } else {
                    ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                }
                ctx!.restore();
            }
            frame++;
            if (alive) raf = requestAnimationFrame(draw);
        }
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [trigger]);

    return <canvas ref={canvasRef} aria-hidden style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999 }} />;
}
