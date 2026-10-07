# CSC Screeding

A private prospect demo: the cscscreeding.co.uk **homepage only**, rebuilt as a single Next.js page. It keeps CSC's own logo, Inter type, copy, films and photography, and gives them a new skin. Look and layout follow siteassist.com, and so does motion (the brief named one reference for both). Every link that leaves the homepage keeps its real live URL, but clicks are held on the page (see Private-demo settings). The page is `noindex, nofollow` and carries the Regen PostHog snippet, with nothing visible added.

## Run locally

- `npm install`, then `npm run dev` (http://127.0.0.1:3044).
- `npm run build`, then `npm start` for production.
- `npm run typecheck` checks TypeScript.
- `npm run links` checks every link on a running page (`node scripts/check-links.mjs [url]`).
- `npm run logo` rebuilds the vector logo. It needs potrace, numpy, scipy and Pillow.
- `npm run media` rebuilds `public/media` from `_scrape/`. It needs Pillow, numpy, scipy and ffmpeg.

`_scrape/` is gitignored and holds the raw downloads. The commands that refill it are in Where the images came from.

## The single route

| Route | What |
| --- | --- |
| `/` | The homepage. The build also emits only `/_not-found` and `/icon.svg` |

`npm run build` reports 4 static pages: `/`, `/_not-found`, `/icon.svg` and Next's internal index.

## Recon

### The live site

cscscreeding.co.uk is a GoHighLevel (LeadConnector) funnel page. Its section markup and most photos come from a Replit build (`website-refactor-jack636.replit.app`), and several sections render twice in the DOM (mobile and desktop copies).

- **Sitemap.** `sitemap.xml` is an empty `<urlset>`.
- **Unknown paths** answer 301 to `/oh-no`, so a URL only counts as real when it ends on a 200 that is not `/oh-no`.
- **Font:** Inter only (computed styles: 400, 500, 600 and 700).
- **Colour.** The CTAs are orange `#FF6A00` and the accents are template blues (`#3C7DF6`, `#2563EB`). None of these are in the logo.

### Live homepage, in order, with counts

| # | Live section | Items | This build |
| --- | --- | --- | --- |
| 1 | Hero: "CSC Screeding / Programme Certainty for South East Construction", line, Request Quote, Call Now | 1 | Hero (all of it) |
| 2 | Specialised Screeding Solutions: Commercial Fit-Out and Residential cards | 2 cards, 4 checks each | Services |
| 3 | Trusted By Industry Leaders: client logos and 4 counters | 8 logos, 4 stats | Logos in the hero foot; stats in Certainty |
| 4 | Why Programme Certainty Matters More Than Price: 3 points, YouTube film, photo, counters again | 3 points | Certainty |
| 5 | Meet The Maverick Truck: 3 tags, 3 points, photo, second YouTube film, spec link | 3 tags, 3 points | Maverick |
| 6 | Precision Technical Operations | 3 points | Maverick (operations) |
| 7 | Screeding Expertise: Commercial and Residential again | 2 cards, 4 checks each | Merged into Services (8 checks per card) |
| 8 | What Industry Leaders Say | 3 testimonials | Testimonials, 3 of 3 |
| 9 | Featured Projects | 6 | Projects, 6 of 6 |
| 10 | Proven Performance | 2 stats | Merged into the Certainty stat notes |
| 11 | Latest Articles | 3 | Insights, 3 of 3 |
| 12 | Ready to Guarantee Your Programme? CTA | 1 | Footer panel |
| 13 | Get a quote / Get in Touch / Why Choose (4) / two GHL form iframes | 4 reasons | Footer panel (the forms link to the live quote pages) |
| 14 | Footer: 3 link groups (15 links), company details | 15 | Footer, 14 (see Decisions) |

Hidden on the live page and left out: the "Proof-Based Results" block (4 Unsplash stock projects, `display:none`) and "They Ask, You Answer" (3 downloads, hidden).

### Brand

**Logo.** The live site only serves a raster: `csc_logo_2017_large.jpg` (3508×768, white ground). `scripts/logo.py` splits it into its two inks:

- Royal blue: median `#100E9F`, sampled from 190k pixels.
- Concrete grey: `#9A989B`.

It labels every connected shape and traces each one with potrace. That gives 14 parts: C, S, C, the nine letters of "screeding" (the dot of the i merged into its stem), the grey swoosh and the blue swoosh. Outputs:

- `lib/logo.ts`: one path per part.
- `public/brand/logo.svg`: full colour.
- `public/brand/logo-white.svg`: for dark grounds.
- `app/icon.svg`: favicon, "CSC" in white on a Royal tile. The live favicon is the whole wide logo squashed into a square.

**Film.** CSC's YouTube channel (@cscscreeding) has the two films the homepage embeds:

- **Meet the Maverick** (v8h5CIaImbg). Burned-in captions, so it is not suitable as a background. It is self-hosted at 720p (17MB) as the Maverick section's on-page film, with sound and controls, and loads only when played.
- **Maverick in Action** (fC7vms9BlLA). Its second half is caption-free pour footage. `scripts/film.sh` cuts five 4s shots from it (2:29 onwards) into a 20s, 2.1MB silent hero loop.

**Fonts.** Inter (the live site's face) for body and headings. Geist Mono (siteassist's face) for the hero headline, buttons, labels, figures and quotes. Both are open source and self-hosted from `public/fonts` (fontsource woff2).

### Palette

| Token | Hex | Source |
| --- | --- | --- |
| Royal | `#100E9F` | The logo's blue ("screeding" and the lower swoosh). Buttons, accents, figures and hover states |
| Ink | `#0C0B24` | siteassist's `--primary--black` (`#0a0017`) turned to Royal's hue. Text, the film overlay, the preloader, the menu and the Lidl card |
| Concrete | `#9A999B` | The logo's grey ("CSC" and the upper swoosh). Logo, bars, and secondary text on Ink only (6.8:1) |
| White | `#FFFFFF` | Page |

These are supporting tints, not new hues:

- **Concrete 100 to 400** (`#F7F7F6` to `#D8D8D5`): siteassist's neutrals with their green cast removed. Used for bands, cards and lines.
- **Muted** `#55545D`: text at 7.5:1 on white and 5.9:1 on Concrete 300.
- **Royal Light** `#2B29C4`: hover only, as siteassist lifts `#6100FE` to `#8133FE`.

The live site's orange and template blues are not used. The palette was decided from the logo without a confirmation round; swap the tokens in `app/globals.css` if CSC prefers otherwise.

### Proposed section list (as built)

1. **Hero.** The pour film, the headline, the copy, the buttons and the client logos.
2. **Certainty.** Statement, fleet photo, 3 reasons and 4 stats.
3. **Services.** Two photo cards.
4. **Maverick.** The film, 3 access answers, the Lidl figure and technical operations.
5. **Projects.** Six rows with the copied hover.
6. **Testimonials.**
7. **Insights.**
8. **Contact and footer panel.**

The first sections lead with real imagery: the hero film, the fleet and team aerial in Certainty, and the commercial and residential photos in Services.

## Page height

Measured on the production build:

| Width | Height | Viewports |
| --- | --- | --- |
| 1440 × 900 | 7,255px | 8.06 |
| 768 × 1024 | 10,517px | 10.3 |
| 375 × 812 | 11,159px | 13.7 |

Desktop sits at the top of the 6 to 8 target. It was 9.1 on the first pass and was brought down by:

- merging duplicate sections (Screeding Expertise, Proven Performance, the repeated counters);
- clamping project summaries to one line;
- section padding of 48 to 72px;
- flatter image crops.

## Reference: siteassist.com (Webflow, GSAP 3.15, Lenis 1.2.3)

Measured on 7 Oct 2026 from its stylesheet, computed styles and inline scripts:

- **Type.**
  - Hero H1: Geist Mono 400, uppercase, letter-spacing -0.0625em (44.37px / -2.77px at 1024).
  - h2: Geist 400, line-height 1, -0.045em.
  - Statements: 35.56/39.11px at 1024, -0.031em.
- **Buttons.** `.button`: Geist Mono 500, uppercase, .04em tracking, padding .75em 1.5em, radius .25em, `transition: all .2s cubic-bezier(.215,.61,.355,1)`. Hover goes from violet `#6100fe` to `#8133fe`.
- **Neutrals:** `#f9faf9`, `#eff2ef`, `#e3e7e2`, `#d9dfd9`.
- **Radii:** .25em, .5em and .75em.
- **Rhythm and curves.**
  - Sections: 85.33px padding at 1024.
  - Body background transition: `cubic-bezier(.35,1,.6,1)`.
  - Solutions image: `cubic-bezier(.625,.05,0,1)`.
- **Layout.**
  - Full-bleed film hero with a mono headline, a hairline rule, a coordinate readout and a client logo strip.
  - Sentence statement, then a numbered solutions list with a hover preview.
  - Square-cornered photo cards, a grey testimonial panel with square arrows, and an inset grey footer panel ("Let's talk").
- **Motion.**
  - Lenis `{ lerp: 0.6 }`.
  - `initGlobalParallax`: yPercent 20 to -20, scrub true, `clamp()` start and end.
  - `initMarqueeScrollDirection`: speed × content/viewport width × multiplier (1, 0.5 under 991px, 0.25 under 479px), `totalProgress(0.5)`, direction flips with the scroll.

## Copied interaction: the Solutions list hover

`components/home/Projects.tsx` and the `.pj-*` rules in `styles/home.css` rebuild siteassist's `.solutions-item`, with its own element order (the `<img>` before the link):

- **Image.** `.solutions-img` is 12em wide, `aspect-ratio: 2 / 2.5`, radius .25em, absolute at `inset: calc(50% - 7em) 0 auto auto`, `transform: scale(0)`, `transition: transform 0s cubic-bezier(.625,.05,0,1)`, `pointer-events: none`.
- **Hover in** (`@media (min-width: 992px)`): `.solutions-item:hover .solutions-img { transform: scale(1); transition-duration: 600ms }`. The photo grows out of nothing over 600ms and vanishes instantly on leave.
- **Row.** `.solutions-item:hover` turns the text violet (Royal here). `.solutions-link` has a 1px bottom border that turns violet on hover, and padding 1.75em 0 1.5em (tightened to 1.25em for pacing). `.solutions-row` is a `3em 1fr` grid; the first column is wider here because it holds the sector name.
- **Tokens.** The curve and duration are `--ease-preview` and `--preview-in`.

Verified headless on the production build:

- The image's transform reads `scale(0)`, then `0.09`, `0.84` and `1` over 0 to 600ms.
- The title and border compute to Royal on hover.
- The transform is back to `scale(0)` 50ms after leaving.

Changes from theirs:

- The first column shows the sector instead of an index number (house rule: no index numbers).
- Under 992px there is no preview, as on siteassist, but a thumbnail sits in the row so phones still see the photography.

## Motion system

All in `components/Motion.tsx`. Every move plays once, all on siteassist's curves.

| Move | Applied with | What it does |
| --- | --- | --- |
| head | `data-reveal="head"` | The whole heading fades and rises 28px, 1.1s, `csc-out` |
| text | `data-reveal="text"` | Each word rises out of its own mask, 0.9s, 6ms stagger |
| label | `data-reveal="label"` | Labels, buttons, small blocks: 12px rise and fade, 0.7s |
| cards | `data-reveal="cards"` | A list's children reveal in batches: 36px rise, 1s, 0.08s stagger |
| image | `data-reveal="image"` | The frame clips open from the bottom, 1.3s, `csc-io` |
| parallax | `data-parallax` on an `<img>` | siteassist's global parallax at about 10% travel: yPercent -6 to 6, scale 1.14, scrub |
| count | `data-count` | Stat counters, 1.6s, once |

- **Curves:** `csc-out` = `cubic-bezier(.35,1,.6,1)`, `csc-io` = `cubic-bezier(.625,.05,0,1)`, buttons `cubic-bezier(.215,.61,.355,1)`.
- **Late sections:** anything inside `[data-late]` (Testimonials, Insights) plays at 0.75 of the duration.
- **Footer:** has no reveals.
- **Lenis:** runs on the GSAP ticker, synced with ScrollTrigger. It is stopped by the preloader and the menu, and every `#` link scrolls through it.
- **Header.** No bar and no box. A probe under its centre switches it to white over the film (`data-tone="dark"`) and to full colour over the page. It slides away on the way down and returns on the way up.
- **Menu.** An Ink panel clips open from the top (one GSAP timeline, reversed to close). It holds the 7 live pages, the on-page sections and contact. Focus is trapped, Esc closes it, and focus goes back to the toggle. All checked with the keyboard.
- **Marquee:** the client logos in the hero foot use siteassist's marquee, ported.
- **Lidl figure:** the week bars draw once (`.is-drawn`, 1.4s, `--ease-preview`).

## Preloader (`components/Preloader.tsx`)

The CSC logo is two swooshes sweeping round two words, so it is built the way the swoosh moves:

1. Each swoosh wipes in left to right (a clip-path, which follows the arc's direction).
2. "CSC" rises letter by letter.
3. "screeding" follows a beat later.

A mono counter (000 to 100) and a hairline bar fill underneath so the wait reads clearly. Earlier clients missed a subtle loader.

One timeline, 2.4s:

| Time | What |
| --- | --- |
| 0.05 to 0.60 | Grey swoosh |
| 0.20 to 0.75 | Blue swoosh |
| 0.30 to 0.90 | CSC |
| 0.50 to 1.15 | screeding |
| 0.00 to 1.70 | Counter and bar |
| 1.70 to 1.85 | Hold |
| 1.85 to 2.40 | Exit: the lock-up flies to the header logo's measured position while the Ink curtain lifts off the film |

- **Ground:** Ink, the colour the hero opens on (the film sits under an Ink overlay), so there is no jump at handover.
- **Handover at 1.85s:** `is-loading` leaves `<html>`, `data-intro="done"` is set, Lenis starts and `intro:done` fires. The hero's entrance listens for that event: the film settles from 1.08 scale, the headline words rise and the rule draws, so the exit and the entrance overlap.
- **Measured on the production build:** `intro:done` at 1.96s after navigation and scroll locked at 0 until then. The frame sequence shows no flash of page or hero before it.
- **Every load:** it plays on every load, a house rule after client feedback. That is why the whole intro is 2.4s rather than 2.0. Handover still lands under 2s.
- **Guards.** A 3.2s failsafe completes it on a throttled tab. Reduced motion skips it. `<noscript>` hides it. It is `aria-hidden`. Cleanup kills the timeline.

## Accessibility and fallbacks

- **Before first paint,** the boot script adds `js` and `is-loading` unless reduced motion is requested. Nothing is ever hidden without JavaScript.
- **Reduced motion:** no preloader, no smooth scroll, no reveals, no parallax or marquee, the film paused (with a play control), and every section visible. Checked with a full-page capture at 1440.
- **Hero film:** muted and looping. It has a pause control, pauses off-screen, and its local poster is preloaded.
- **Keyboard.**
  - A skip link and visible `:focus-visible` rings (Royal, or white on dark).
  - The testimonial panel takes the arrow keys and announces its count politely.
- **Contrast.** Body Ink on white is 18:1, Muted on white 7.5:1, Royal on white 13.3:1, white on Royal 13.3:1, Concrete on Ink 6.8:1. White text only sits on Royal, Ink or photography under an Ink gradient.
- **Checked at 375, 768 and 1440:** no horizontal scroll, no console errors, no failed requests.

## Content and links

- All copy lives in `lib/content.ts`. Em and en dashes are rewritten (house rule); the built HTML has none.
- **Featured projects:** all 6 live projects. The live "Read More" links are `#`, so each goes to the live Our Work page, which lists the same six.
- **Articles:** the 3 live articles. The live links point at a preview host (`genie.entrepreneurscircle.org/v2/preview/...`), so they go to the same posts on `cscscreeding.co.uk/post/...`. Summaries are each post's meta description.
- **Testimonials:** all 3, verbatim.
- **Link check.** `scripts/check-links.mjs` found 21 unique destinations across 60 links. All live URLs return 200 and do not end on `/oh-no`, every outbound link has `target="_blank" rel="noopener"`, and every `#` anchor exists.

## Private-demo settings

- **No indexing.** `robots: noindex, nofollow` (plus googleBot) in `app/layout.tsx`, and no sitemap or robots route.
- **PostHog (EU).** In `lib/posthog.ts`:
  - The key comes from `NEXT_PUBLIC_POSTHOG_KEY`, with a literal fallback.
  - Pageview, pageleave, autocapture and session recording are on; surveys are off.
  - `site` is registered, plus any UTM tags.
  - `scroll_depth` fires once each at 25, 50, 75 and 100%.
  - No visible tracking UI.
- **Link guard.** Every link keeps its real live href, but a capture-phase click and auxclick guard in `Motion.tsx` stops navigation (client request on earlier demos). `#` links scroll the page instead.

## Decisions

- **Sections merged:**
  - "Screeding Expertise" repeats the two service cards, so its checks were merged into them.
  - "Proven Performance" repeats two counters, so its copy became the notes under those counters.
  - The counters appeared twice on the live page and appear once here.
- **Maverick section.** It carries the Lidl fit-out from the live Maverick page (3 weeks against 1, 66% time saved, Zero delays) as the page's signature figure. It is the one contained Ink card, so the page background never changes after the hero (client feedback on earlier demos: no colour jumps).
- **Hero headline** is the live H3. "CSC Screeding" (the live H1) is kept for screen readers and carried by the logo.
- **Coordinates.** The hero readout is the registered office, SL3 6DH (postcodes.io: 51.514185, -0.54023).
- **Client logos.** Turned into single-colour marks (`scripts/media.py`), white on the film. Curo's file is light lettering in a black box, so the box is treated as background.
- **Footer.**
  - The live "Certainty Kits" link has no page and the second "Technical Specifications" duplicates the first, so both are left out (14 of 15).
  - "Luxury Homes", "Architectural Finishes", "Case Studies" and "Industry Blog" are `#` on the live site; they point at `/residential`, `/our-work-813150` and `/blogs`.
  - The Watford FC Regional Partner badge comes from the live About page.
- **Socials.** The live site lists none, so only CSC's own YouTube channel (source of both films) is linked.
- **Quote forms.** The live forms are GoHighLevel iframes, which would post real enquiries, so the buttons link to the live Commercial and Residential pages instead.
- **Lenis lerp 0.12,** not siteassist's 0.6: a softer glide, and the value that cured a "jump at the bottom" on earlier demos. `overscroll-behavior-y: none` is set for the same reason.
- **Header** has no bar, as briefed. siteassist uses a glass pill; this keeps the page free of `backdrop-filter` over moving film.
- **Photography** is in natural colour at 90% saturation, never tinted.

## Where the images came from

All from CSC's own sources, downloaded on 7 Oct 2026:

- **Replit assets** (`website-refactor-jack636.replit.app/assets/…`, listed in its JS bundle). These cover the fleet aerial, the commercial pour, the UFH pipework, Spencer and team, the control-panel photo, Arundel, the client logos and the Watford badge.
- **GoHighLevel media** (`storage.googleapis.com/msgsndr/px6RoESJhCuhOKupNfV7/media/…`). These cover the six project photos and the three article images.
- **YouTube films** from @cscscreeding, fetched with `yt-dlp -f "bv*[height<=1080][ext=mp4]"` (plus `-f "ba[ext=m4a]"` for the Maverick film's audio) into `_scrape/film-<id>.mp4`.

`scripts/media.py` maps each source file to its `public/media` name.

## Structure

```
app/              layout (noindex, PostHog, boot script, fonts), page (section order), globals.css (tokens), icon.svg
components/       Preloader, Header (+ Menu), Footer, Logo, Motion (Lenis, reveals, link guard), ui (Button, Icon)
components/home/  Hero, Marquee, Certainty, Services, Maverick (film + Lidl figure + operations), Projects (copied hover), Testimonials, Insights
lib/              content.ts (all copy and links), logo.ts (generated), posthog.ts, scroll.ts, split.ts
styles/           chrome.css (logo, preloader, header, menu, footer), home.css (sections)
scripts/          logo.py, media.py, film.sh, check-links.mjs
```

## Deployment

Not done. Vercel and the `{slug}.regendigital.co` domain are a separate step, and need the prospect slug.
