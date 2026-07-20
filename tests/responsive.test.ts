import { describe, it, expect } from "vitest";
import { DEVICES, FILTERS, CAT_COLOR } from "@/lib/devices";
import { getScale, getScreenSize, normalizeUrl, looksLikeUrl, buildShareLink, filterDevices, groupDevices, countFor } from "@/lib/responsive";

describe("device registry", () => {
    it("every device has a unique id and a known category", () => {
        const ids = new Set(DEVICES.map((d) => d.id));
        expect(ids.size).toBe(DEVICES.length);
        for (const d of DEVICES) {
            expect(FILTERS).toContain(d.category);
            expect(d.viewport.width).toBeGreaterThan(0);
            expect(d.viewport.height).toBeGreaterThan(0);
        }
    });
    it("every non-All category has an accent color", () => {
        for (const f of FILTERS.filter((x) => x !== "All")) expect(CAT_COLOR[f]).toMatch(/^#/);
    });
});

describe("scaling", () => {
    it("getScale keeps phones/tablets/watches within their target height", () => {
        for (const d of DEVICES) {
            const { w, h, scale } = getScreenSize(d);
            expect(scale).toBeGreaterThan(0);
            expect(w).toBe(Math.round(d.viewport.width * scale));
            expect(h).toBe(Math.round(d.viewport.height * scale));
        }
    });
    it("a taller phone scales down more than a shorter one", () => {
        const tall = DEVICES.find((d) => d.id === "iphone-17-pro-max")!;
        const short = DEVICES.find((d) => d.id === "iphone-5s")!;
        expect(getScale(tall)).toBeLessThan(getScale(short));
    });
});

describe("normalizeUrl", () => {
    it("adds https:// when missing", () => {
        expect(normalizeUrl("example.com")).toBe("https://example.com");
        expect(normalizeUrl("localhost:3000")).toBe("https://localhost:3000");
    });
    it("keeps an explicit scheme", () => {
        expect(normalizeUrl("http://a.test")).toBe("http://a.test");
        expect(normalizeUrl("https://a.test")).toBe("https://a.test");
    });
    it("trims and returns empty for blank", () => {
        expect(normalizeUrl("   ")).toBe("");
        expect(normalizeUrl("  a.com ")).toBe("https://a.com");
    });
});

describe("looksLikeUrl", () => {
    it("detects schemes and localhost", () => {
        expect(looksLikeUrl("https://x.com")).toBe(true);
        expect(looksLikeUrl("localhost:5173")).toBe(true);
        expect(looksLikeUrl("just some text")).toBe(false);
    });
});

describe("buildShareLink", () => {
    it("encodes the target url into a ?url= param", () => {
        expect(buildShareLink("https://app.test/", "https://x.com/a b")).toBe("https://app.test/?url=https%3A%2F%2Fx.com%2Fa%20b");
    });
});

describe("filtering + grouping", () => {
    it("filterDevices('All') returns everything", () => {
        expect(filterDevices("All")).toHaveLength(DEVICES.length);
        expect(filterDevices("iPhone").every((d) => d.category === "iPhone")).toBe(true);
    });
    it("groupDevices('All') yields the 6 category groups covering all devices", () => {
        const groups = groupDevices("All");
        expect(groups).toHaveLength(6);
        expect(groups.reduce((n, g) => n + g.devices.length, 0)).toBe(DEVICES.length);
    });
    it("groupDevices(filter) yields one group", () => {
        expect(groupDevices("iPad")).toHaveLength(1);
    });
    it("countFor matches the registry", () => {
        expect(countFor("All")).toBe(DEVICES.length);
        expect(countFor("Watch")).toBe(DEVICES.filter((d) => d.category === "Watch").length);
    });
});
