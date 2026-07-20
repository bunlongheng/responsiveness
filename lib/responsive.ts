// Pure, framework-free helpers for scaling frames, normalizing URLs, and grouping devices.
import { DEVICES, type Device, type FilterType } from "@/lib/devices";

/** Preview scale factor for a device so every frame fits a tidy card. */
export function getScale(device: Device): number {
    if (device.type === "phone") return 320 / device.viewport.height;
    if (device.type === "tablet") return 340 / device.viewport.height;
    if (device.type === "watch") return 200 / device.viewport.height;
    return 460 / device.viewport.width;
}

/** Rendered on-card pixel size for a device. */
export function getScreenSize(device: Device) {
    const scale = getScale(device);
    return { w: Math.round(device.viewport.width * scale), h: Math.round(device.viewport.height * scale), scale };
}

/** Coerce raw user input into a loadable URL (adds https:// when missing). Empty -> "". */
export function normalizeUrl(raw: string): string {
    const url = raw.trim();
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return "https://" + url;
}

/** Does pasted text look like a URL we should auto-load? */
export function looksLikeUrl(text: string): boolean {
    return text.includes("://") || text.startsWith("localhost");
}

/** Build a shareable deep link (?url=) from an origin+path and target URL. */
export function buildShareLink(base: string, url: string): string {
    return `${base}?url=${encodeURIComponent(url)}`;
}

/** Devices visible for a filter ("All" -> everything). */
export function filterDevices(filter: FilterType): Device[] {
    return filter === "All" ? DEVICES : DEVICES.filter((d) => d.category === filter);
}

/** Group devices by category for the "All" view, or a single group otherwise. */
export function groupDevices(filter: FilterType): { label: FilterType; devices: Device[] }[] {
    if (filter !== "All") return [{ label: filter, devices: filterDevices(filter) }];
    return (["iPhone", "Android", "iPad", "Desktop", "Watch", "TV"] as FilterType[]).map((label) => ({ label, devices: DEVICES.filter((d) => d.category === label) }));
}

/** Count of devices in a filter, for the tab badges. */
export function countFor(filter: FilterType): number {
    return filter === "All" ? DEVICES.length : DEVICES.filter((d) => d.category === filter).length;
}
