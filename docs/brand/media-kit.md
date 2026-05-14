# FiveTalents — Brand & Media Kit

> This document is the canonical reference for tone, narrative, visual identity, and design decisions across all public-facing surfaces of FiveTalents. Update it when decisions are made; defer to it when they are questioned.

---

## Core Identity

> Faithful stewardship software for the local church.

### Emotional Tone

Reverent · Trustworthy · Calm · Intentional · Pastoral · Technically competent

### Avoid

- Megachurch energy
- Startup hype or "AI disruption" language
- Corporate CRM aesthetics
- "Revolutionize your engagement pipeline" copy

---

## Name & Origin

**FiveTalents** — inspired by the Parable of the Talents (Matthew 25:14–30).

The name frames the platform around its core conviction: churches are stewards of people, discipleship, generosity, service, worship, and mission. FiveTalents exists to help them steward those things faithfully and simply. It is a stewardship platform for the local church — not merely church database software.

---

## Taglines

### Recommended
> **"Faithful stewardship for growing churches."**

### Ministry-focused alternatives
- "Steward people well."
- "Helping churches multiply what they've been given."
- "Tools for faithful ministry."
- "Church stewardship, reimagined."

### Anglican/Reformed tone
- "Order in service of discipleship."
- "Supporting the work of the Church."
- "Faithful systems for faithful ministry."

---

## Brand Narrative

### The Problem

Most church management systems feel corporate, dated, bloated, transactional, or disconnected from real ministry. They manage records, but not relationships.

### The FiveTalents Vision

FiveTalents exists to help churches steward people, discipleship, generosity, service, worship, and mission faithfully and simply.

Not enterprise software. Not "CRM for churches." A ministry platform designed around the rhythms of the local church.

---

## Ideal Audience

### Primary Market
- Small-to-mid-sized churches (75–800 members)
- Liturgical and historically rooted traditions: Anglican, Presbyterian, Lutheran, Methodist, Reformed
- An underserved niche — existing ChMS tools don't serve this market well

### Tone for this audience
Trustworthiness · Clarity · Stability · Pastoral warmth · Simplicity

---

## Product Messaging

### Homepage Hero

**Headline:** Steward your church faithfully.

**Subheadline:** FiveTalents helps churches manage people, ministry, communication, giving, and discipleship with tools designed for the local church.

**CTAs:** Request Early Access · Join the Beta

### Feature Sections
- **Member Care** — Profiles, family relationships, notes, statuses
- **Worship & Ministry** — Attendance, volunteers, sermons, events
- **Stewardship** — Giving, pledges, communication
- **Self-Service** — Member accounts and church directory access

### Short Boilerplate
> FiveTalents is a modern church management platform designed to help churches steward people, ministry, and resources faithfully.

### Long Boilerplate
> FiveTalents is a free, open-source church management platform built for small-to-mid-sized churches. Inspired by the Parable of the Talents, it gives churches modern tools to manage members, track attendance, coordinate volunteers, record giving, and communicate — without the complexity or cost of enterprise ChMS software. Built by a senior software engineer and Anglican deacon, FiveTalents is designed around the rhythms of real church life.

### Voice & Copy — Good Examples
- "Keep track of your congregation with clarity and care."
- "Designed for the rhythms of church life."
- "Simple tools for faithful ministry."

### Voice & Copy — Avoid
- "Revolutionize your engagement pipeline"
- "Next-generation ministry automation"
- "AI-powered growth acceleration"

---

## Color Palette

### Primary

| Role | Name | HEX |
|------|------|-----|
| Primary | Midnight Blue | `#0d3f78` |
| Accent | Steward Gold | `#C8A96B` |
| Background | Parchment | `#F7F3EB` |
| Body Text | Charcoal | `#2B2B2B` |

### Secondary

| Role | Name | HEX |
|------|------|-----|
| Accent | Forest | `#2F5D50` |
| Accent | Burgundy | `#6A3B3B` |
| Neutral | Slate | `#5E6B7A` |

### Why This Works

Communicates liturgical tradition, stability, warmth, seriousness, and trust. Feels Anglican, Presbyterian, and Lutheran without being denomination-locked.

---

## Typography

### Headlines
**Cormorant Garamond** — elegant, ecclesial, readable. Historic without looking archaic. Use for page titles, hero text, section headings.

### Body & UI
**Inter** — modern, extremely readable, excellent UI font. Works beautifully alongside Cormorant. Use for body copy, labels, navigation, forms.

### UI warmth alternative
**Source Sans 3** — slightly warmer than Inter if a softer feel is needed.

---

## Logo Direction

### ✅ Selected: Five Coins / Cathedral Window

A geometric icon combining five circular "talents" arranged into a cross, cathedral window, or upward-growth form. This direction was chosen and implemented as the app icon mark.

**Source file:** `web/five-talents-web/public/icon.svg` (viewBox 0 0 320 340, Midnight Blue `#0d3f78` on Parchment `#F7F3EB`, Steward Gold `#C8A96B` coins and border)

Why it works:
- Communicates stewardship, multiplication, and church identity
- Modern and minimal
- Scales to favicon, app icon, mobile app, print bulletin, signage

### Alternative A: Open Hands *(not selected)*
Hands holding five subtle circles or light. Pastoral and warm — risk of becoming cliché.

### Alternative B: Wheat / Vine *(not selected)*
Five grain kernels or vine nodes. Biblical and growth-oriented — less distinctive in software.

### Logo System Required
- Full horizontal logo
- Stacked logo
- Icon-only mark ✅ (implemented)
- Monochrome version
- Dark-background version

---

## UI Style Direction

### Keywords
Spacious · Uncluttered · Calm · Typographic · Card-based · Restrained

### Inspirations
- Notion
- Linear
- Anglican liturgical print design
- Modern seminary websites
- Apple Settings
- Old prayer books modernized

### Not
- Salesforce
- Planning Center overload
- Flashy dashboards

---

## Photography Style

### Use
- Real churches, candles, books, communion
- People serving, prayer, small groups

### Avoid
- Stock-photo pastors with headsets
- Giant stages
- Corporate office energy

---

## Deliverables Checklist

### v1 — Immediate
- [ ] 3 logo concepts
- [ ] Finalized color palette (CSS variables / design tokens)
- [ ] Typography specimen
- [x] Favicon — all variants generated (`favicon.ico`, `favicon.svg`, 192/512 PNGs, apple-touch-icon); see `web/five-talents-web/public/` and `scripts/generate-icons.mjs`
- [ ] Homepage hero mockup
- [x] App login screen branding — implemented (PR #34)

### v1 — Phase 2
- [ ] UI component style guide (cards, buttons, forms, tables)
- [ ] Social preview / Open Graph graphic
- [ ] GitHub org branding
- [ ] README hero image
- [ ] Product screenshots (member detail, giving dashboard, volunteer scheduling)
- [ ] "Why FiveTalents?" page copy
- [ ] Founder story

### Design Sprint Order (suggested)
1. Finalize palette + fonts
2. Create 3 logo concepts → select one
3. Homepage hero mockup + login screen mockup
4. UI component style guide

---

## Domain Options

- fivetalents.church
- fivetalentsapp.com
- fivetalents.io
- usefivetalents.com
- fivetalentshq.com

---

## Founder Context

Built by a senior software engineer and Anglican deacon. That combination is a major credibility differentiator for ministry software — it signals to churches that the product was built by someone who understands church life from the inside, not just as a software problem. Lead with this in the founder story and "About" page.
