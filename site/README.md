# K. S. Varun & C. S. Tejaswini — Wedding Invitation Website

A complete, **single-page, mobile-first wedding invitation** built from your supplied ZIP and your floral invitation card. All included photos and videos remain in the `data/` folder. **Frontend only:** HTML, CSS and JavaScript — no backend, database, React, npm, installation or recurring service is required.

## Just view it

1. Extract the **entire** ZIP (do not open `index.html` while it is still inside the ZIP).
2. Open `index.html` in Chrome, Safari, Edge or Firefox. You can scroll through the whole invitation.
3. Keep `styles.css`, `script.js`, `data/`, and `assets/` together; never move `index.html` on its own.

Internet access is needed for the Google Maps embed and the optional Google Fonts; the wedding photos and videos are bundled locally. A browser may play the background video **muted by default** (normal phone/browser behaviour); guests can choose the sound button. Video posters provide a fallback if autoplay is unavailable.

## Publish it so guests can open a link on WhatsApp

The fastest option is Netlify Drop (free static hosting may be subject to the host's limits and terms):

1. Open **https://app.netlify.com/drop** on your computer and sign in if requested.
2. Drag the **uncompressed** `varun-tejaswini-wedding` folder onto the drop area (the folder that directly contains `index.html`).
3. Netlify will produce a public `https://...netlify.app` URL. Open it on your phone and check the videos and Google Map.
4. Copy that URL and send it to guests. The website's **Share** button will then share/copy the actual link. You can also attach a custom domain later.

Alternate hosts: Cloudflare Pages, GitHub Pages, Vercel, or any static website hosting. Set the site root to the folder containing `index.html`, and publish the `data/` and `assets/` folders as normal static files. No build command is needed.

**WhatsApp / social link preview:** after you know your final public URL, update `og:image` in the `<head>` of `index.html` to an **absolute** public URL such as `https://your-real-domain.com/data/posters/social-cover.jpg`. Social crawlers often cannot use relative image URLs. The page title and description are already set.

## Content, faithfully taken from your card

| Celebration | Day and time (India Standard Time) |
| --- | --- |
| Reception | Wednesday, **18 November 2026**, **7:00 PM onwards** |
| Wedding Muhurtha | Thursday, **19 November 2026**, **10:45 AM to 11:15 AM** |

**Bride and groom:** K. S. Varun & C. S. Tejaswini.  
**Venue:** ‘A’ & ‘A’ Convention Center, Holalu Road, Mandya, Karnataka, India.  
**From:** Sri Subbanna K. M. (Sri Banashankari Enterprises, Proprietor) and Rakshith K. S. (S S Agro Rice Industries, Proprietor).

The **Get Directions** link was decoded from the QR code printed on the wedding card: `https://goo.gl/maps/3TekMaG1v3dLyFPw6`. The Google Maps iframe uses a textual search for that venue. If Google changes how an embedded map is shown, the Get Directions button remains available.

## What's included

- Smooth, cinematic **same lakeside video background on desktop and mobile**, with the original mobile portrait film in a second mobile-only section and a still-image fallback
- Names and invitation message animated onto the screen
- Individual reception and wedding muhurtha cards, plus downloadable `.ics` calendar files
- Live countdown timed to **10:45 AM IST on 19 November 2026**
- All **29 supplied photographs**, grouped into a curated photo gallery with filters, View All, and swipe/keyboard-friendly full-screen preview
- All **4 supplied videos** in a horizontally swipeable mobile film section
- Embedded Google Map, directions, and original invitation-card viewer
- Native Share sheet on supported mobiles, plus copy-link fallback
- Mobile quick-nav, reduced-motion support, keyboard focus states and responsive layouts
- SEO and share metadata; local image and video assets

## Where to edit things

| File / folder | Purpose |
| --- | --- |
| `index.html` | Names, wedding message, venue, dates, hosts, sections, embeds and social metadata |
| `styles.css` | All colours, type, animations and responsive styling |
| `script.js` | Countdown, photo gallery, lightbox, videos, calendar/share interactions |
| `data/gallery-manifest.js` | Photo order, captions and gallery categories |
| `data/photos/` | All 29 photos (`photo-01.jpg` through `photo-29.jpg`) |
| `data/videos/` | Four supplied videos + the optimized portrait hero-video edit |
| `data/posters/` | Lightweight video-poster, fallback and social-preview images |
| `data/invitation-card.jpg` | Original supplied floral invitation |
| `assets/*.ics` | Reception and muhurtha calendar files |
| `MEDIA_SOURCE_INDEX.csv` | Exact mapping from renamed website images/videos to original filenames in your ZIP |

To replace a photo, replace the matching `data/photos/photo-XX.jpg` with a photo in the same filename and update its description/category in `data/gallery-manifest.js` as needed. To change wedding dates, update **both** `index.html` and the date constants in `script.js`, and regenerate the `.ics` files (these already contain the correct supplied dates).

## Testing and privacy notes

- Designed for phone widths starting at **320px**, tablets, and desktop. The layout is one continuously scrollable page; internal navigation scrolls to sections instead of opening a new page.
- The mobile opening now plays the same lakeside film as desktop. The former mobile portrait film plays as a separate second section on mobile. A still image is available as fallback. The four full-resolution film-gallery videos are only loaded when guests choose to play them.
- No login, guest data collection, cookies, ads, trackers or backend code is included.
- Google Fonts and Google Maps are third-party services and may receive browser requests when the site loads. If you need a fully offline/private version, remove those optional external resources and use system fonts.
- If a Google Maps map is blank in a local-file preview, test after publishing to a static HTTPS host.
- A public deployment is **not** created automatically by this ZIP. You need to upload the extracted folder to a static host for a shareable public address.

Made especially for the wedding celebrations of **K. S. Varun & C. S. Tejaswini**. ✦

## November 2026 — mobile hero update

The **only file you need to replace** on an already-installed site is `index.html`. The updated index includes the complete required JavaScript and additional CSS in the HTML file, while using the existing `styles.css` and `data/` media assets. The old `script.js` remains in this full ZIP for compatibility/reference but is not loaded by the updated page. The laptop and mobile opening sections both use `data/videos/film-02.mp4`. The original mobile portrait video (`data/videos/hero-mobile.mp4`) has moved to a dedicated full-screen mobile section directly below the opening.
