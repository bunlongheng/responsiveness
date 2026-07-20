import { test, expect } from "@playwright/test";

test("loads idle, shows device frames, and filters", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Preview in every frame." })).toBeVisible();

    // idle: device cards render with placeholders, not iframes
    await expect(page.getByText("iPhone 17 Pro Max")).toBeVisible();
    await expect(page.getByText("Enter a URL").first()).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);

    // filtering to Watch narrows the set
    await page.getByRole("button", { name: /^Watch/ }).click();
    await expect(page.getByRole("region", { name: "Watch" })).toBeVisible();
    await expect(page.getByRole("region", { name: "iPhone" })).toHaveCount(0);
});

test("typing a URL loads it into the frames", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("URL to preview");
    await input.fill("example.org");
    await page.getByRole("button", { name: "Go", exact: true }).click();
    // the first iframe should now point at the normalized URL
    await expect(page.locator("iframe").first()).toHaveAttribute("src", "https://example.org");
});

test("deep link ?url= is honored", async ({ page }) => {
    await page.goto("/?url=https://example.net");
    await expect(page.locator("iframe").first()).toHaveAttribute("src", "https://example.net");
});
