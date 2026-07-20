// Tiny Web Audio blips. No-ops gracefully if the browser blocks audio.

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function audioCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    return AC ? new AC() : null;
}

export function playPop(freq = 880) {
    try {
        const ctx = audioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
    } catch {
        /* browser may block before interaction */
    }
}

export function playSuccess() {
    try {
        const ctx = audioCtx();
        if (!ctx) return;
        [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            const t = ctx.currentTime + i * 0.09;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.09, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
            osc.start(t);
            osc.stop(t + 0.3);
        });
    } catch {
        /* ignore */
    }
}
