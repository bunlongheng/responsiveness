// Device registry + categories. Pure data, framework-free.

export type DeviceType = "phone" | "tablet" | "desktop" | "watch" | "tv";
export type FilterType = "All" | "iPhone" | "Android" | "iPad" | "Desktop" | "Watch" | "TV";

export interface DeviceSpec {
    screen: string;
    ppi: number;
    ratio: string;
    year: number;
    os: string;
}

export interface Device {
    id: string;
    name: string;
    category: FilterType;
    viewport: { width: number; height: number };
    type: DeviceType;
    spec: DeviceSpec;
    dynamicIsland?: boolean;
    homeButton?: boolean;
    isPixel?: boolean;
    isIMac?: boolean;
}

export const DEVICES: Device[] = [
    { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", category: "iPhone", viewport: { width: 430, height: 932 }, type: "phone", dynamicIsland: true, spec: { screen: '6.9"', ppi: 460, ratio: "19.5:9", year: 2025, os: "iOS 18" } },
    { id: "iphone-5s", name: "iPhone 5s", category: "iPhone", viewport: { width: 320, height: 568 }, type: "phone", homeButton: true, spec: { screen: '4.0"', ppi: 326, ratio: "16:9", year: 2013, os: "iOS 12" } },
    { id: "pixel-xl-2", name: "Pixel XL 2", category: "Android", viewport: { width: 412, height: 732 }, type: "phone", isPixel: true, spec: { screen: '6.0"', ppi: 537, ratio: "18:9", year: 2017, os: "Android 11" } },
    { id: "ipad-mini-m5", name: "iPad mini M5", category: "iPad", viewport: { width: 744, height: 1133 }, type: "tablet", spec: { screen: '8.3"', ppi: 326, ratio: "~4:3", year: 2024, os: "iPadOS 18" } },
    { id: "ipad-pro-11", name: "iPad Pro M5 11″", category: "iPad", viewport: { width: 834, height: 1194 }, type: "tablet", spec: { screen: '11.0"', ppi: 264, ratio: "~7:10", year: 2024, os: "iPadOS 18" } },
    { id: "ipad-pro-13", name: "iPad Pro M5 13″", category: "iPad", viewport: { width: 1032, height: 1376 }, type: "tablet", spec: { screen: '13.0"', ppi: 264, ratio: "3:4", year: 2024, os: "iPadOS 18" } },
    { id: "imac", name: "iMac 24″", category: "Desktop", viewport: { width: 2560, height: 1440 }, type: "desktop", isIMac: true, spec: { screen: '24.0"', ppi: 218, ratio: "16:9", year: 2023, os: "macOS" } },
    { id: "1080p", name: "1080p Monitor", category: "Desktop", viewport: { width: 1920, height: 1080 }, type: "desktop", spec: { screen: '27.0"', ppi: 82, ratio: "16:9", year: 2024, os: "Universal" } },
    { id: "2k", name: "2K Monitor", category: "Desktop", viewport: { width: 2560, height: 1440 }, type: "desktop", spec: { screen: '27.0"', ppi: 109, ratio: "16:9", year: 2024, os: "Universal" } },
    { id: "4k", name: "4K Monitor", category: "Desktop", viewport: { width: 3840, height: 2160 }, type: "desktop", spec: { screen: '32.0"', ppi: 138, ratio: "16:9", year: 2024, os: "Universal" } },
    { id: "watch-ultra-2", name: "Apple Watch Ultra 2", category: "Watch", viewport: { width: 205, height: 251 }, type: "watch", spec: { screen: '1.99"', ppi: 338, ratio: "~4:5", year: 2024, os: "watchOS 11" } },
    { id: "watch-series-10", name: "Apple Watch Series 10 46mm", category: "Watch", viewport: { width: 198, height: 242 }, type: "watch", spec: { screen: '1.96"', ppi: 326, ratio: "~4:5", year: 2024, os: "watchOS 11" } },
    { id: "watch-se", name: "Apple Watch SE 44mm", category: "Watch", viewport: { width: 184, height: 224 }, type: "watch", spec: { screen: '1.78"', ppi: 326, ratio: "~4:5", year: 2023, os: "watchOS 10" } },
    { id: "samsung-frame-70", name: 'Samsung Frame 4K 70"', category: "TV", viewport: { width: 1920, height: 1080 }, type: "tv", spec: { screen: '70.0"', ppi: 63, ratio: "16:9", year: 2024, os: "Tizen" } },
    { id: "sony-bravia-85", name: 'Sony Bravia 85" XR', category: "TV", viewport: { width: 1920, height: 1080 }, type: "tv", spec: { screen: '85.0"', ppi: 52, ratio: "16:9", year: 2024, os: "Google TV" } },
    { id: "lg-oled-8k-65", name: 'LG OLED 8K 65"', category: "TV", viewport: { width: 1920, height: 1080 }, type: "tv", spec: { screen: '65.0"', ppi: 135, ratio: "16:9", year: 2024, os: "webOS" } },
];

export const FILTERS: FilterType[] = ["All", "iPhone", "Android", "iPad", "Desktop", "Watch", "TV"];

export const CAT_COLOR: Record<string, string> = {
    iPhone: "#007aff",
    Android: "#34c759",
    iPad: "#af52de",
    Desktop: "#ff9500",
    Watch: "#ff375f",
    TV: "#30b0c7",
};
