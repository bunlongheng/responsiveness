"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FILTERS, CAT_COLOR, CAT_TEXT, type FilterType } from "@/lib/devices";
import { normalizeUrl, looksLikeUrl, buildShareLink, groupDevices, countFor } from "@/lib/responsive";
import { playPop, playSuccess } from "@/lib/sound";
import { Confetti } from "@/components/Confetti";
import { DeviceCard } from "@/components/DeviceCard";

const DEMO_URL = "https://example.com";

function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
        navigator.clipboard.writeText(buildShareLink(base, url)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={copy} title="Copy a shareable ?url= link" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e5e5ea", background: copied ? "#f0fdf4" : "white", color: copied ? "#16a34a" : "#3c3c43", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s ease" }}>
            {copied ? (
                <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>{" "}
                    Copied!
                </>
            ) : (
                <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>{" "}
                    Share link
                </>
            )}
        </button>
    );
}

export default function ResponsivenessPage() {
    // Start idle (empty frames) so the landing page is instant and never auto-loads
    // an external site. "Try demo" or a pasted/typed URL fills the frames.
    const [inputVal, setInputVal] = useState("");
    const [activeUrl, setActiveUrl] = useState("");
    const [urlKey, setUrlKey] = useState(0);
    const [activeFilter, setFilter] = useState<FilterType>("All");
    const [confettiTrigger, setConf] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const celebratedRef = useRef("");

    const submit = useCallback((raw: string) => {
        const url = normalizeUrl(raw);
        if (!url) return;
        celebratedRef.current = "";
        setInputVal(url);
        setActiveUrl(url);
        setUrlKey((k) => k + 1);
    }, []);

    // ?url= deep link on mount - read location.search directly so it works pre-hydration.
    // submit is stable (useCallback with []); intentionally run once on mount.
    useEffect(() => {
        const p = new URLSearchParams(window.location.search).get("url");
        if (p) submit(p);
    }, [submit]);

    const celebrate = useCallback((forUrl: string) => {
        if (celebratedRef.current === forUrl) return;
        celebratedRef.current = forUrl;
        playSuccess();
        setConf((n) => n + 1);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            submit(inputVal);
        },
        [inputVal, submit],
    );
    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            const p = e.clipboardData.getData("text");
            if (looksLikeUrl(p)) setTimeout(() => submit(p), 50);
        },
        [submit],
    );

    const groups = groupDevices(activeFilter);

    return (
        <>
            <style>{`
                @keyframes spin      { to { transform: rotate(360deg); } }
                @keyframes ringPulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
                @keyframes badgePop  { from { opacity: 0; transform: translateX(-50%) scale(0.7); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
            `}</style>
            <Confetti trigger={confettiTrigger} />

            <main style={{ minHeight: "100vh", background: "#fafafa" }}>
                <header style={{ background: "white", borderBottom: "1px solid #f0f0f5", paddingTop: 48, paddingBottom: 28, textAlign: "center", paddingLeft: 24, paddingRight: 24 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f5f5f7", borderRadius: 999, padding: "4px 14px", marginBottom: 16, border: "1px solid #e5e5ea" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34c759" }} />
                        <span style={{ fontSize: 11, color: "#6e6e73", fontWeight: 600, letterSpacing: 0.4 }}>Device Preview</span>
                    </div>
                    <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, letterSpacing: -1.2, color: "#1d1d1f", lineHeight: 1.05, margin: 0, marginBottom: 10 }}>Preview in every frame.</h1>
                    <p style={{ fontSize: 15, color: "#6e6e73", margin: "0 auto", maxWidth: 440, lineHeight: 1.5 }}>Paste any URL and see it rendered live across iPhone, iPad, Android, Desktop, Watch and TV - side by side.</p>

                    <div style={{ maxWidth: 580, margin: "24px auto 0" }}>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="url-input" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                                URL to preview
                            </label>
                            <div style={{ display: "flex", alignItems: "center", background: "#f5f5f7", borderRadius: 14, padding: "10px 14px", gap: 10, border: "1.5px solid #e5e5ea", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden>
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                <input id="url-input" ref={inputRef} type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onPaste={handlePaste} placeholder="https://yoursite.com  or  localhost:3000" style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#1d1d1f", outline: "none", minWidth: 0 }} />
                                {inputVal && (
                                    <button
                                        type="button"
                                        aria-label="Clear URL"
                                        onClick={() => {
                                            setInputVal("");
                                            setActiveUrl("");
                                            inputRef.current?.focus();
                                        }}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#c7c7cc", flexShrink: 0, display: "flex" }}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="m15 9-6 6M9 9l6 6" />
                                        </svg>
                                    </button>
                                )}
                                <button type="submit" style={{ background: "#1d1d1f", color: "white", border: "none", borderRadius: 9, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0, letterSpacing: -0.2 }}>
                                    Go
                                </button>
                            </div>
                        </form>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, color: "#6e6e73" }}>Paste to auto-load · localhost:3000 · your-site.com · 192.168.x.x:PORT</span>
                            <button type="button" onClick={() => submit(DEMO_URL)} style={{ fontSize: 11, color: CAT_TEXT.iPhone, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>
                                Try demo →
                            </button>
                            {activeUrl && <CopyLinkButton url={activeUrl} />}
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
                        {FILTERS.map((f) => {
                            const active = activeFilter === f;
                            const col = CAT_COLOR[f] ?? "#1d1d1f";
                            return (
                                <button
                                    key={f}
                                    onClick={() => {
                                        setFilter(f);
                                        playPop(700);
                                    }}
                                    aria-pressed={active}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 999, border: `1.5px solid ${active ? col : "#e5e5ea"}`, background: active ? col : "white", color: active ? "white" : "#3c3c43", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.12s ease" }}
                                >
                                    {f}
                                    <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>{countFor(f)}</span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                <div style={{ padding: "24px 16px 100px" }}>
                    {groups.map((group) =>
                        group.devices.length === 0 ? null : (
                            <section key={group.label} style={{ marginBottom: 56 }} aria-label={group.label}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: CAT_TEXT[group.label] ?? "#6e6e73", letterSpacing: 1.4, textTransform: "uppercase" }}>{group.label}</span>
                                    <div style={{ flex: 1, height: 1, background: "#ebebf0" }} />
                                    <span style={{ fontSize: 10, color: "#c7c7cc", fontWeight: 500 }}>
                                        {group.devices.length} device{group.devices.length > 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
                                    {group.devices.map((device) => (
                                        <DeviceCard key={device.id} device={device} url={activeUrl} urlKey={urlKey} onSuccess={() => celebrate(activeUrl)} />
                                    ))}
                                </div>
                            </section>
                        ),
                    )}
                </div>

                <footer style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderTop: "1px solid #f0f0f5", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
                    <span style={{ fontSize: 11, color: "#6e6e73" }}>
                        💡 Many sites block embedding (X-Frame-Options / CSP) · <strong style={{ color: "#6e6e73" }}>localhost and same-origin URLs always work</strong> · use <code style={{ background: "#f5f5f7", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>?url=</code> to share
                    </span>
                </footer>
            </main>
        </>
    );
}
