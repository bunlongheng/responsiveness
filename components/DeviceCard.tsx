"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { type Device, CAT_COLOR, CAT_TEXT } from "@/lib/devices";
import { getScreenSize } from "@/lib/responsive";
import { playPop } from "@/lib/sound";

function Placeholder({ hasUrl, loading }: { hasUrl: boolean; loading?: boolean }) {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#f7f7f9 0%,#efeff4 100%)", gap: 6 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: loading ? "rgba(0,122,255,0.08)" : hasUrl ? "rgba(255,59,48,0.08)" : "rgba(142,142,147,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loading ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }} aria-hidden>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                ) : hasUrl ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="1.8" aria-hidden>
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.8" aria-hidden>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                )}
            </div>
            <p style={{ margin: 0, fontSize: 9, color: loading ? "#007aff" : hasUrl ? "#ff3b30" : "#6e6e73", fontFamily: "system-ui", textAlign: "center", lineHeight: 1.5, padding: "0 8px" }}>{loading ? "Loading…" : hasUrl ? "Blocked by site" : "Enter a URL"}</p>
        </div>
    );
}

function LiveFrame({ device, url, urlKey, scale, onSuccess }: { device: Device; url: string; urlKey: number; scale: number; onSuccess?: () => void }) {
    const [state, setState] = useState<"idle" | "loading" | "loaded" | "blocked">("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!url) {
            setState("idle");
            return;
        }
        setState("loading");
        timerRef.current = setTimeout(() => setState("blocked"), 5000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [url, urlKey]);

    const handleLoad = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setState("loaded");
        onSuccess?.();
    }, [onSuccess]);

    if (state === "idle") return <Placeholder hasUrl={false} />;
    if (state === "blocked") return <Placeholder hasUrl={true} />;

    return (
        <>
            {state === "loading" && (
                <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
                    <Placeholder hasUrl={false} loading />
                </div>
            )}
            <iframe key={`${urlKey}-${device.id}`} src={url} onLoad={handleLoad} loading="lazy" style={{ width: device.viewport.width, height: device.viewport.height, transform: `scale(${scale})`, transformOrigin: "top left", border: "none", display: "block" }} title={`${device.name} preview`} />
        </>
    );
}

function PhoneFrame({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const { w, h, scale } = getScreenSize(device);
    const topB = device.homeButton ? 64 : device.dynamicIsland ? 44 : 42;
    const botB = device.homeButton ? 84 : 22;
    const sideB = device.homeButton ? 11 : 9;
    const radius = device.homeButton ? 28 : device.dynamicIsland ? 40 : 34;

    return (
        <div style={{ width: w + sideB * 2, height: h + topB + botB, borderRadius: radius, background: "white", border: "1.5px solid #e0e0e6", position: "relative", flexShrink: 0, transition: "box-shadow 0.2s ease" }}>
            <div style={{ position: "absolute", left: -2, top: device.homeButton ? 86 : topB + 46, width: 2, height: 20, background: "#c7c7cc", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", left: -2, top: device.homeButton ? 114 : topB + 76, width: 2, height: 20, background: "#c7c7cc", borderRadius: "2px 0 0 2px" }} />
            {device.homeButton && <div style={{ position: "absolute", left: -2, top: 62, width: 2, height: 12, background: "#c7c7cc", borderRadius: "2px 0 0 2px" }} />}
            <div style={{ position: "absolute", right: -2, top: device.homeButton ? 94 : topB + 60, width: 2, height: device.homeButton ? 20 : 44, background: "#c7c7cc", borderRadius: "0 2px 2px 0" }} />
            <div style={{ position: "absolute", top: topB, left: sideB, width: w, height: h, overflow: "hidden", background: "#f2f2f7", borderRadius: device.homeButton ? 2 : 5 }}>
                {device.dynamicIsland && <div style={{ position: "absolute", top: Math.round(8 * scale), left: "50%", transform: "translateX(-50%)", width: Math.round(118 * scale), height: Math.round(32 * scale), background: "#000", borderRadius: 999, zIndex: 10, pointerEvents: "none" }} />}
                {device.isPixel && <div style={{ position: "absolute", top: Math.round(8 * scale), left: "50%", transform: "translateX(-50%)", width: Math.round(12 * scale), height: Math.round(12 * scale), background: "#000", borderRadius: "50%", zIndex: 10, pointerEvents: "none" }} />}
                {device.homeButton && (
                    <>
                        <div style={{ position: "absolute", top: Math.round(6 * scale), left: "50%", transform: "translateX(-50%)", width: Math.round(6 * scale), height: Math.round(6 * scale), background: "#bbb", borderRadius: "50%", zIndex: 10, pointerEvents: "none" }} />
                        <div style={{ position: "absolute", top: Math.round(18 * scale), left: "50%", transform: "translateX(-50%)", width: Math.round(44 * scale), height: Math.round(4 * scale), background: "#ccc", borderRadius: 3, zIndex: 10, pointerEvents: "none" }} />
                    </>
                )}
                <LiveFrame device={device} url={url} urlKey={urlKey} scale={scale} onSuccess={onSuccess} />
            </div>
            {device.homeButton && (
                <div style={{ position: "absolute", bottom: Math.round(botB / 2) - 18, left: "50%", transform: "translateX(-50%)", width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #d1d1d6", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 11, height: 11, borderRadius: 2.5, border: "1.5px solid #d1d1d6" }} />
                </div>
            )}
            {!device.homeButton && <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 76, height: 3, background: "#3c3c43", borderRadius: 2, opacity: 0.2 }} />}
        </div>
    );
}

function TabletFrame({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const { w, h, scale } = getScreenSize(device);
    return (
        <div style={{ width: w + 28, height: h + 36, borderRadius: 18, background: "white", border: "1.5px solid #e0e0e6", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: -2, right: 44, width: 20, height: 2, background: "#c7c7cc", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", top: -2, right: 72, width: 16, height: 2, background: "#c7c7cc", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", top: -2, right: 96, width: 16, height: 2, background: "#c7c7cc", borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, background: "#c8c8cc", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: 18, left: 14, width: w, height: h, overflow: "hidden", background: "#f2f2f7", borderRadius: 2 }}>
                <LiveFrame device={device} url={url} urlKey={urlKey} scale={scale} onSuccess={onSuccess} />
            </div>
        </div>
    );
}

function DesktopFrame({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const { w, h, scale } = getScreenSize(device);
    const isIMac = !!device.isIMac;
    const topB = isIMac ? 8 : 10;
    const chin = isIMac ? 38 : 16;
    const sideB = isIMac ? 8 : 10;
    const standH = isIMac ? 72 : 46;
    const neckW = isIMac ? 44 : 26;
    const baseW = isIMac ? 140 : 110;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: w + sideB * 2, height: h + topB + chin, borderRadius: isIMac ? 13 : 6, background: isIMac ? "#f5f5f7" : "white", border: "1.5px solid #e0e0e6", position: "relative" }}>
                <div style={{ position: "absolute", top: topB, left: sideB, width: w, height: h, overflow: "hidden", background: "#f2f2f7", borderRadius: isIMac ? 2 : 1 }}>
                    <LiveFrame device={device} url={url} urlKey={urlKey} scale={scale} onSuccess={onSuccess} />
                </div>
                {isIMac && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: chin - 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="11" height="14" viewBox="0 0 814 1000" style={{ opacity: 0.18 }} aria-hidden>
                            <path
                                d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-33.4-155.8-105.7C198.1 772.5 156 651.2 156 536c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                )}
                {!isIMac && <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, background: "#c8c8cc", borderRadius: "50%" }} />}
            </div>
            <div style={{ position: "relative", width: baseW, height: standH, flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: `${neckW / 2}px solid transparent`, borderRight: `${neckW / 2}px solid transparent`, borderTop: `${standH - 8}px solid #d1d1d6` }} />
                <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: baseW, height: 8, background: "linear-gradient(to bottom,#d1d1d6,#c7c7cc)", borderRadius: 4 }} />
            </div>
        </div>
    );
}

function WatchFrame({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const { w, h, scale } = getScreenSize(device);
    const sideB = 7,
        topB = 9,
        botB = 11,
        lugH = 22;
    const caseR = Math.round(Math.min(w + sideB * 2, h + topB + botB) * 0.24);
    const screenR = Math.round(caseR * 0.7);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: w - 4, height: lugH, background: "#d1d1d6", borderRadius: "6px 6px 0 0" }} />
            <div style={{ position: "relative", width: w + sideB * 2, height: h + topB + botB, borderRadius: caseR, background: "white", border: "1.5px solid #e0e0e6", flexShrink: 0 }}>
                <div style={{ position: "absolute", right: -5, top: "26%", width: 5, height: 16, background: "#c7c7cc", borderRadius: "0 4px 4px 0" }} />
                <div style={{ position: "absolute", right: -5, top: "52%", width: 5, height: 10, background: "#c7c7cc", borderRadius: "0 3px 3px 0" }} />
                <div style={{ position: "absolute", top: topB, left: sideB, width: w, height: h, overflow: "hidden", background: "#f2f2f7", borderRadius: screenR }}>
                    <LiveFrame device={device} url={url} urlKey={urlKey} scale={scale} onSuccess={onSuccess} />
                </div>
            </div>
            <div style={{ width: w - 4, height: lugH, background: "#d1d1d6", borderRadius: "0 0 6px 6px" }} />
        </div>
    );
}

function TVFrame({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const { w, h, scale } = getScreenSize(device);
    const bezel = 12;
    return (
        <div style={{ width: w + bezel * 2, height: h + bezel * 2, background: "white", border: "1.5px solid #e0e0e6", borderRadius: 5, position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: bezel, left: bezel, width: w, height: h, overflow: "hidden", background: "#f2f2f7", borderRadius: 2 }}>
                <LiveFrame device={device} url={url} urlKey={urlKey} scale={scale} onSuccess={onSuccess} />
            </div>
            <div style={{ position: "absolute", bottom: Math.round(bezel / 2) - 1, right: bezel + 2, width: 4, height: 4, borderRadius: "50%", background: "#d1d1d6" }} />
        </div>
    );
}

function Chip({ label, value, hovered, color, textColor }: { label: string; value: string; hovered: boolean; color: string; textColor: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: hovered ? `${color}12` : "#f5f5f7", borderRadius: 8, padding: "5px 9px", transition: "background 0.2s ease" }}>
            <span style={{ fontSize: 8, color: hovered ? textColor : "#6e6e73", fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap", transition: "color 0.2s ease" }}>{label}</span>
            <span style={{ fontSize: 11, color: "#1d1d1f", fontWeight: 600, whiteSpace: "nowrap" }}>{value}</span>
        </div>
    );
}

export function DeviceCard({ device, url, urlKey, onSuccess }: { device: Device; url: string; urlKey: number; onSuccess?: () => void }) {
    const [hovered, setHovered] = useState(false);
    const { w } = getScreenSize(device);
    const color = CAT_COLOR[device.category] || "#007aff";
    const textColor = CAT_TEXT[device.category] || "#0067d6";

    const frameWidth = device.type === "phone" ? w + (device.homeButton ? 22 : 18) : device.type === "tablet" ? w + 28 : device.type === "watch" ? w + 14 : device.type === "tv" ? w + 24 : w + (device.isIMac ? 16 : 20);
    const cardWidth = Math.max(frameWidth, 140);

    const handleMouseEnter = () => {
        setHovered(true);
        playPop(880 + Math.random() * 200);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: cardWidth, cursor: "default" }} onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
            <div
                style={{
                    transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), filter 0.22s ease",
                    transform: hovered ? "scale(1.04) translateY(-5px)" : "scale(1) translateY(0)",
                    filter: hovered ? `drop-shadow(0 0 18px ${color}66) drop-shadow(0 8px 32px rgba(0,0,0,0.14))` : "drop-shadow(0 4px 20px rgba(0,0,0,0.08))",
                    position: "relative",
                }}
            >
                {hovered && <div style={{ position: "absolute", inset: -4, borderRadius: device.type === "phone" ? 44 : device.type === "tablet" ? 22 : device.type === "watch" ? 32 : 10, border: `2px solid ${color}`, opacity: 0.7, animation: "ringPulse 1s ease-in-out infinite", pointerEvents: "none", zIndex: 20 }} />}
                {hovered && <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", background: color, color: "white", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap", letterSpacing: 0.5, zIndex: 21, animation: "badgePop 0.18s ease-out", boxShadow: `0 4px 12px ${color}55` }}>▶ {device.name}</div>}
                {device.type === "phone" && <PhoneFrame device={device} url={url} urlKey={urlKey} onSuccess={onSuccess} />}
                {device.type === "tablet" && <TabletFrame device={device} url={url} urlKey={urlKey} onSuccess={onSuccess} />}
                {device.type === "desktop" && <DesktopFrame device={device} url={url} urlKey={urlKey} onSuccess={onSuccess} />}
                {device.type === "watch" && <WatchFrame device={device} url={url} urlKey={urlKey} onSuccess={onSuccess} />}
                {device.type === "tv" && <TVFrame device={device} url={url} urlKey={urlKey} onSuccess={onSuccess} />}
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: hovered ? textColor : "#1d1d1f", letterSpacing: -0.3, transition: "color 0.2s ease" }}>{device.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#6e6e73" }}>
                        {device.spec.os} · {device.spec.year}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                    <Chip label="RES" value={`${device.viewport.width}×${device.viewport.height}`} hovered={hovered} color={color} textColor={textColor} />
                    <Chip label="RATIO" value={device.spec.ratio} hovered={hovered} color={color} textColor={textColor} />
                    <Chip label="SCREEN" value={device.spec.screen} hovered={hovered} color={color} textColor={textColor} />
                    <Chip label="PPI" value={`${device.spec.ppi}`} hovered={hovered} color={color} textColor={textColor} />
                </div>
            </div>
        </div>
    );
}
