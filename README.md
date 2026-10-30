<div align="center">

# Responsiveness

**Preview any URL across real device frames.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)
![Vitest](https://img.shields.io/badge/Vitest-unit%20tested-6e9f18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-e2e-2ead33?logo=playwright)

[Live demo](https://responsiveness-bheng.vercel.app)

![Responsiveness - a URL rendered live across iPhone, iPad, Android, Desktop, Watch, and TV frames](screenshots/hero.png)

</div>

Paste a URL and it renders **live**, at once, inside 16 real device frames - iPhone, Android,
iPad, Desktop, Apple Watch, and Smart TV - each drawn to its true viewport and aspect ratio. No
backend, no build step for the target site: it's just an `<iframe>` per device, scaled to fit.

## Features

- **16 device frames across 6 categories** - iPhone (Dynamic Island + a Touch ID home-button
  model), Pixel/Android, iPad, Desktop (iMac + 1080p/2K/4K monitors), Apple Watch, and Smart TV.
- **Live, simultaneous iframes** - the target URL loads in every visible frame, scaled to fit;
  frames stay idle until a device is actually opened so the landing page doesn't hammer one site
  with a burst of requests.
- **Category filters** with live device counts, plus a grouped "All" view.
- **Deep links** - `?url=` loads a site on open, so a preview is shareable and agent-callable.
  A one-tap "Share link" button copies the current link.
- **Paste to auto-load** - paste a URL anywhere on the page and it loads immediately.
- **Immersive focus mode** - click any frame to blow it up center-stage, auto-scaled to the
  viewport (Escape or click-outside to close).
- **Blocked-site detection** - a frame that hasn't loaded within 5s (common with
  `X-Frame-Options` / CSP) shows a "Blocked by site" card instead of hanging forever.
- **Mobile-aware layout** - under 640px the grid collapses to a single device picked from a
  dropdown instead of 16 cramped frames.
- **Playful touches** - hover glow + spec chips (resolution, aspect ratio, screen size, PPI), a
  confetti burst, and a Web Audio chime the first time a site actually renders.

## How it works

The app is fully client-side and static - no backend, no database, no runtime env vars.
`app/page.tsx` owns the interaction state (active URL, category filter, focused device) and
composes `DeviceCard`, which picks one of five frame shapes - phone, tablet, desktop, watch, TV -
around a lazily-loaded `<iframe>`. All scaling, URL normalization, and device grouping is pure,
framework-free logic in `lib/responsive.ts`, unit-tested in isolation from React.

```mermaid
flowchart TD
    Page["app/page.tsx<br/>(hero, URL input, filters, focus mode)"]
    Card["components/DeviceCard.tsx<br/>(frame shape + live iframe)"]
    Confetti["components/Confetti.tsx"]
    Devices["lib/devices.ts<br/>(16-device registry)"]
    Resp["lib/responsive.ts<br/>(pure: getScale, normalizeUrl, groupDevices)"]
    Sound["lib/sound.ts<br/>(Web Audio blips)"]

    Page --> Card
    Page --> Confetti
    Page --> Resp
    Page --> Sound
    Card --> Devices
    Card --> Resp
    Card --> Sound
```

> Many sites block embedding via `X-Frame-Options` / `Content-Security-Policy`; those show a
> "Blocked by site" card after a 5s timeout. `localhost` and same-origin URLs always render.
> `next.config.ts` deliberately leaves `frame-src` open - embedding arbitrary URLs is the app's
> whole job - while keeping the app itself unframable (`frame-ancestors 'none'`).

## Device presets

| Category | Devices |
|---|---|
| iPhone | 17 Pro Max, 5s |
| Android | Pixel XL 2 |
| iPad | mini M5, Pro M5 11″, Pro M5 13″ |
| Desktop | iMac 24″, 1080p / 2K / 4K monitor |
| Watch | Ultra 2, Series 10 46mm, SE 44mm |
| TV | Samsung Frame 4K 70″, Sony Bravia 85″ XR, LG OLED 8K 65″ |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript (strict), inline styles - no CSS framework |
| Audio | Web Audio API (no assets) |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Lint / format | ESLint (flat config + jsx-a11y) + Prettier |
| Git hooks | Husky - pre-push runs typecheck, lint, format check, and unit tests |
| CI | GitHub Actions - format, typecheck, lint, unit, build, prod audit, e2e on every push/PR |
| Hosting | Vercel |

## Getting started

```bash
git clone https://github.com/bunlongheng/responsiveness.git
cd responsiveness
npm install
npm run dev            # http://localhost:3021
```

```bash
npm run typecheck      # tsc --noEmit
npm run lint            # eslint (flat config + jsx-a11y)
npm run format:check   # prettier --check .
npm test               # vitest unit tests
npm run test:e2e       # playwright end-to-end
```

## License

[MIT](LICENSE)

---

<p align="center">
  <sub>Built by <a href="https://bunlongheng.com">Bunlong Heng</a> &middot; <a href="https://bunlongheng.com/projects/responsiveness">See it in my portfolio &rarr;</a></sub>
</p>

---

<div align="center">

<a href="https://bunlongheng.com"><img src="https://img.shields.io/badge/-bunlongheng.com-3A3A3C?style=for-the-badge&amp;labelColor=2A2A2C&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAADAFBMVEXx8vLq6v%2F19fX09PT8%2Ff309PT5%2BfnAwMBMaXHx8vL19fX5%2Bfny8vL09PT39%2Ff6%2Bfn6%2Bvr09PTx8fH4%2BPn%2F8vLy8%2FP09PTz8%2FPy8vL%2F%2F%2F%2Fz9PTz9PP19fby8vP19PXz8%2FT19%2Fb08%2FTx8vLy8vL09vby8%2FL29vf19fTv8PDz9vb7%2Bvn%2F%2Ff%2F9%2Ff3w8vH29fb%2F%2FP339%2Ff5%2Bfn59%2Ff19PT09PR7rao3VF3%2F%2Fv8AKDR6sqsBV1vv8fL4%2BPiux8b8%2Bvq90NDy8%2FR%2BlpppnZyZqrACLTxclZJSkI9en5ssZ2luqaUAeWgqbW4BX1gCfG0%2Fa3QaVG0MN0UKNUKUpKsGpYMAKjoRQ1UDf3AQRloJqIgEm32d0cUBg3ElbnQIln8eVWgrmIdP0KzF5d5s2acdfHwppJCP5MMXl4Tz8%2FLv8%2FP39%2FiewL5%2BqahYf4IrTFZkk5KlxsREiIYAHiqDnKFmnJowc3IdVllvpKK7zc3D2tnk5%2BmuycdwpKKuub2yv8Ly%2B%2FkAMT7z%2Bvjq7e09gH93q6kGdWpGgoJZmJSlw8M7c3WwyceTw76w1M8mYmpFfX8lW2AFOEpGiYhxqqRrqaRb2rdIsZ8AVE91jpU7d3t3saqBoKhako4AWVEcUlg3aWwDupAHb2YwmIkPP1ERSVA7WmZ8tq8HT14oZW%2BYuLsMl3wQT10ROksENUc8Z3MJSGVLh4dqpJ%2BXr7U51awUgHM4v6ad1MkPuJZAiowVd3IEhnZH0aoYrI05p5sDtYwkzZ8EPViYxsRel5USbHAIgmwIM0gQamzU4uF2malQi4oWQFQ1zaYrp4UXlYwfiHoyxqFE1q4qeX4yn5JIxKkdrX1b1rAbWGvd5Oh91sRijpomsJEVc3Ukc34dqIcwuJVKwZIXkoQZcXlNv5g%2BqZUZvpNl2rPG9N0WkIoNqouW4sVPwp%2BM0b6h0ssfq4d%2F1r8hpo%2Fh9e4AamUjnI9avaBixqgklYWSwL4xtItUxplYl5qZ58mq78wMgnYXfnlOmJaR1L%2Bj78ny9fS%2FrXQPAAAAFXRSTlP7Brvx%2FsJhAgD87r4U72C4uGH8vhRDodYHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC6UlEQVQokS2Sd3BUVRSHb0KS3QRCiZw5t%2By9j33zXjZkyUs2uekhEAi9dwRCL4JUEQRFAQUs9A4WOopKU0GpFoqCBZUivaqoFKkWLIS5GX7%2FfnPO78yZj%2Fj8UTViK6HggvNgSGuluEZRKbZqlN9H%2FFWiWUzIFQK5fhjOIRTDoqv4ia86S4q3KSByHdSqIhxofBKr5iNxLMm2bQqWVkorJ%2BAkO46nkQJhceSRmCTDvKJIJBLJzMxMLU6POJ4eBPF1KpNEbdt2Cms4LCcnZ%2FX6D3d%2BsKJJ7VSlNLoqgbjUtmkKKxlVmpf3bsFXW3d1b77gueJAQIPQBCilkMKemNi23Ts9T35%2FaMe2rsvmTypylGUFCSIYWJLXrm2nUwOPfNO5w%2B73Okxnjqe0JigQEL3JizoeONr%2F2u99vju4fd1rdZnyspQmnGvAUBprWNqz348%2FhXN%2F6P1%2By4Uvs%2FJkpRQRwpJBRVn7vf16Dfitz5XevQqWt3yalXtKaRIUQmglWfsu5y7%2BMrDs0TMftWo1ZVy64xioOVpcIdt8%2Fvqvf9%2F859KJsrLmrzA%2BOKC0IkFEtJza7JOfr%2FYd0P9G98tdOxe0Hp9qJrOIBgDuOeEtp%2F%2B4d%2FvWX%2F%2F9u%2B%2FtlaUTmOWZg7SQEEyuFe52%2BML9O3cZO%2F5xl06zn2VcadOJUqJTzt7a82XfP7sx9vmGNm1m1MstV4IHCVAAoTLqL1372ddn%2Fz%2B2v%2FWq12c1fSpsaeQWAZAANntxzuI3e3zbo8XGpm%2FMnNqiXrh%2BljaPd6UUabkjps19tdGnX2zKb9b4pTFDCzOMLmYtpW5h%2BpCRTeYtyV%2BT36zx808OL4xYGoFrkqDTbJpSXLdRgwbPZL%2BQnT129OOPFVEEsAMJpHKdeKMJgJSAiALdjJANQKnRJI4R6boAKEwLCiGoBBegQjBftQo1KQWOlplFKSV9qGaF1NpAE7QQESTlMSy6pp%2F4%2FFFVYxMNRBTaiM0tkImxNaL8vgfDR8gvoYRaxgAAAABJRU5ErkJggg%3D%3D" alt="bunlongheng.com"></a>
<a href="https://www.linkedin.com/in/bunlongheng/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
<a href="https://www.instagram.com/ibunlong/"><img src="https://img.shields.io/badge/Instagram-C13584?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>
<a href="mailto:bheng.code@gmail.com"><img src="https://img.shields.io/badge/Email-2E7D32?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>

<br>

Built by **[Bunlong](https://bunlongheng.com)** &nbsp;&middot;&nbsp; [more apps](https://bunlongheng.com/projects)

</div>
