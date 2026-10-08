/* Every word, number, image and link on the page. Copy is taken from the live cscscreeding.co.uk homepage (read
   7 Oct 2026); a few facts come from its own About and Maverick pages and are marked. Em and en dashes are rewritten
   as commas, colons or "to" (house rule for these demos). Every outbound URL was checked against the live site
   (see scripts/check-links.mjs); the live "Read More" and several footer links are "#" there, so they point at the
   nearest real page instead (listed in README.md, Decisions). */

const SITE = "https://cscscreeding.co.uk";

export const company = {
  name: "CSC Screeding",
  phone: { label: "0330 223 2364", href: "tel:03302232364" },
  email: { label: "estimating@cscscreeding.co.uk", href: "mailto:estimating@cscscreeding.co.uk" },
  hours: "Available 8am to 5pm, Mon to Fri",
  vat: "VAT Number: GB480 0588 46",
  number: "Company Number: 4725870",
  address: ["Unit 2, Cherry Orchard Nursery,", "Trenches Lane,", "Slough, SL3 6DH"],
  copyright: "© 2025 CSC Screeding. All rights reserved.",
  tagline: "Programme certainty for commercial fit-outs and residential developments. Delivered by the Maverick mobile batching solution.",
};

export type Link = { label: string; href: string };

// The live main navigation, in order.
export const nav: Link[] = [
  { label: "Commercial Fit-Out", href: `${SITE}/commercial-fit-out` },
  { label: "Residential", href: `${SITE}/residential` },
  { label: "About", href: `${SITE}/about` },
  { label: "Maverick Screed Truck", href: `${SITE}/maverick` },
  { label: "Underfloor Heating & Screeding", href: `${SITE}/underfloor-heating-screeding-services` },
  { label: "Our Work", href: `${SITE}/our-work-813150` },
  { label: "Blog", href: `${SITE}/blogs` },
];
// The shorter set shown in the header bar on wide screens; everything is in the menu.
export const headerNav = [nav[0], nav[1], nav[3], nav[5], nav[2]];

export const sections: Link[] = [
  { label: "Programme certainty", href: "#certainty" },
  { label: "Screeding solutions", href: "#services" },
  { label: "The Maverick", href: "#maverick" },
  { label: "Featured projects", href: "#projects" },
  { label: "What clients say", href: "#testimonials" },
  { label: "Latest articles", href: "#insights" },
  { label: "Get a quote", href: "#contact" },
];

export const hero = {
  title: ["Programme Certainty for", "South East Construction"],
  text: "Professional flowing screed services with Maverick technology for commercial and residential projects across the South-East.",
  primary: { label: "Request Quote", href: "#contact" },
  film: { src: "/media/pour.mp4", poster: "/media/pour-poster.jpg" },
  // "Trusted By Industry Leaders": the eight client logos on the live homepage, in its order.
  clientsTitle: "Trusted By Industry Leaders",
  clients: [
    { name: "Curo", src: "/media/client-curo.png", w: 282, h: 73 },
    { name: "Collins", src: "/media/client-collins.png", w: 176, h: 52 },
    { name: "Beard Construction", src: "/media/client-beard.png", w: 435, h: 116 },
    { name: "Morgan Sindall", src: "/media/client-morgan-sindall.png", w: 254, h: 116 },
    { name: "Forum Contracts", src: "/media/client-forum.png", w: 492, h: 120 },
    { name: "Princebuild", src: "/media/client-princebuild.png", w: 564, h: 95 },
    { name: "Kingerlee", src: "/media/client-kingerlee.png", w: 420, h: 112 },
    { name: "VolkerFitzpatrick", src: "/media/client-volker-fitzpatrick.png", w: 299, h: 30 },
  ],
};

export const certainty = {
  title: "Why Programme Certainty Matters More Than Price",
  text: "In fast-moving South-East commercial projects, every day of delay costs thousands. That's why smart contractors choose partners who deliver certainty, not just competitive quotes.",
  image: { src: "/media/fleet.webp", alt: "The CSC Screeding team and their fleet of blue Maverick trucks, seen from above at the Slough yard" },
  points: [
    { title: "Rapid Response", text: "No waiting for plant delays or weather windows. Our mobile batching ensures immediate start capability." },
    { title: "Quality Assurance Guaranteed", text: "Full traceability with QA documentation, material certificates, and progress photography for every pour." },
    { title: "Access Solution Specialists", text: "Our Maverick Technology reaches areas traditional delivery methods can't, eliminating access delays and manual handling." },
  ],
  // "Over 2,900 successful projects delivered since 2010" and the four live counters. The longer notes on the last
  // two are the live "Proven Performance" copy, merged here so the figures appear once.
  statsLead: "Over 2,900 successful projects delivered since 2010",
  stats: [
    { value: 2900, suffix: "+", unit: "", label: "Projects Since 2010", note: "Delivered across commercial and residential developments throughout South-East England." },
    { value: 38, suffix: "", unit: "yr", label: "Industry Experience", note: "Led by founder Spencer Warner, \"The Screed Scientist\", in the trade since 1986." },
    { value: 1000, suffix: "+", unit: "m²", label: "Daily Output Capacity", note: "Consistent daily flowing screed capacity with our self-contained mobile screed truck and grab lorry support." },
    { value: 0, suffix: "", unit: "", word: "Zero", label: "Reliance on Third-Party Plants", note: "Our Maverick truck mixes screed on site, reducing delays and giving us full control over quality." },
  ],
};

export const services = {
  title: ["Specialised Screeding", "Solutions"],
  text: "Whether you're delivering a fast-track commercial project or a precision residential development, we have specialised solutions for your specific requirements.",
  items: [
    {
      id: "commercial",
      title: "Commercial Fit-Out",
      sub: "Fast-track solutions",
      text: "Retail stores, office spaces, and hospitality venues. Our Maverick mobile batching lorry eliminates supply chain delays and ensures programme certainty for tight deadlines.",
      // The live "Commercial Fit-Out" card and the "Commercial Screeding" card, merged (they repeat each other).
      bullets: ["Mobile batching technology", "No concrete lorry access required", "Quality assurance certification", "Real-time progress tracking", "Retail store floor screeding", "Office floor foundations", "Industrial flooring", "Fast-track programmes"],
      cta: { label: "Get Commercial Quote", href: `${SITE}/commercial-fit-out` },
      image: { src: "/media/commercial.webp", alt: "A CSC operative levelling flowing screed across a commercial floor plate" },
    },
    {
      id: "residential",
      title: "Residential Projects",
      sub: "Precision & quality",
      text: "Multi-unit developments, luxury homes, and bespoke residential projects. Complete insulation and screeding solutions that meet specifications and planning deadlines.",
      bullets: ["Underfloor heating compatible", "Complete insulation solutions", "Planning compliance guaranteed", "Coordinated site logistics", "Luxury home floor screeding", "Multi-unit development floors", "Underfloor heating screeds", "Precision floor foundations"],
      cta: { label: "Get Residential Quote", href: `${SITE}/residential` },
      image: { src: "/media/residential.webp", alt: "Underfloor heating pipework laid out ready for screed in a riverside apartment" },
    },
  ],
};

export const maverick = {
  title: "Meet The Maverick Truck",
  text: "Our game-changing mobile batching truck that eliminates the biggest cause of screeding delays: concrete supply and site access limitations.",
  tags: ["Any Access Route", "Continuous Supply", "Quality Controlled"],
  film: {
    src: "/media/maverick-film.mp4",
    poster: "/media/spencer.webp",
    title: "The Future of Screeding Is Already Here: Meet the Maverick Screed Truck",
    meta: "Film · 2:42",
    alt: "Spencer Warner with the CSC team in front of the Maverick fleet",
  },
  pointsTitle: "The Solution to Site Access Problems",
  points: [
    { title: "No Heavy Vehicle Access Needed", text: "Traditional delivery requires 32-tonne vehicle access and turning circles. Our Maverick Technology fits through standard construction gates and manufactures fresh screed on-site." },
    { title: "Zero Reliance on Third-Party Plants", text: "Our mobile Maverick Technology means no waiting in delivery queues. We arrive with raw materials and batch exactly what you need, when you need it." },
    { title: "Consistent Quality Control", text: "Every batch is mixed to exact specifications with real-time monitoring. No variables from transit mixing or delays affecting material properties." },
  ],
  spec: { label: "Download Technical Specifications", href: `${SITE}/maverick` },
  // From the live Maverick page ("Real Project Success: Lidl Store Fit-Out"): the homepage's claims, shown on a real job.
  caseStudy: {
    title: "Real Project Success: Lidl Store Fit-Out",
    sub: "How the Maverick transformed a 3-week challenge into a 1-week triumph",
    place: "Lidl Retail Store, High Street Location, South-East",
    challenge: "Extremely restricted access through narrow side streets. Traditional methods would require 3 weeks of complex logistics, road closures, and multiple crane lifts",
    rows: [
      { label: "Traditional Method", weeks: 3, items: ["Road closure applications", "Multiple crane bookings", "Weather dependency", "Traffic management"] },
      { label: "Maverick Method", weeks: 1, items: ["Direct site access", "Weather independent", "No external dependencies", "Immediate start capability"] },
    ],
    results: [{ value: "66%", label: "Time Saved" }, { value: "Zero", label: "Programme Delays" }],
  },
  operations: {
    title: "Precision Technical Operations",
    text: "Our skilled technicians operate advanced equipment with precision, ensuring consistent quality and optimal results on every project.",
    image: { src: "/media/controls.webp", alt: "CSC technicians at the Maverick's digital batching controls" },
    points: [
      { title: "Advanced Digital Controls", text: "Our equipment features state-of-the-art digital monitoring systems that ensure precise mixing ratios, temperature control, and consistent quality throughout the screeding process." },
      { title: "Expert Technical Team", text: "Our certified technicians undergo continuous training on the latest equipment and techniques, ensuring every project meets our exacting standards for quality and precision." },
      { title: "Real-Time Quality Monitoring", text: "Continuous monitoring throughout the process allows us to make real-time adjustments, guaranteeing optimal results and eliminating costly rework." },
    ],
  },
};

// "Featured Projects": the six on the live homepage, in its order. Their "Read More" links are "#" on the live
// site, so each goes to the live Our Work page, where the same six are listed.
const OUR_WORK = `${SITE}/our-work-813150`;
export const projects = {
  title: "Featured Projects",
  text: "From high-profile commercial developments to luxury residential projects, our portfolio demonstrates consistent delivery across all sectors.",
  all: { label: "View Case Studies", href: OUR_WORK },
  items: [
    { sector: "Commercial", category: "Film Studios", title: "Flawless SCC Pour at Twickenham", text: "A seamless self-compacting concrete (SCC) pour at Twickenham Film Studios using Tarmac TopFlow Horizontal. Precision, efficiency, and expert execution on this high-profile project.", tags: ["SCC Pour Technique", "MTX Partner"], image: "/media/project-twickenham.webp", alt: "Operatives placing self-compacting concrete at Twickenham Film Studios", href: OUR_WORK },
    { sector: "Commercial", category: "Commercial", title: "Cemfloor C25 Screed in Kingston", text: "Fast, durable, and precision-laid Cemfloor C25 liquid screed project in Kingston delivered using the Maverick screed truck technology.", tags: ["C25 Grade Strength", "Maverick Technology"], image: "/media/project-kingston.webp", alt: "The Maverick truck batching inside the Kingston site", href: OUR_WORK },
    { sector: "Residential", category: "Luxury Residential", title: "Beaconsfield Super Home", text: "Premium residential project in Beaconsfield, a town known for its wealth and prestige, demanding nothing but the best in screeding excellence.", tags: ["Luxury Grade", "Beaconsfield Location"], image: "/media/project-beaconsfield.webp", alt: "A finished screed floor in the Beaconsfield home", href: OUR_WORK },
    { sector: "Commercial", category: "Healthcare", title: "Royal Berkshire Hospital", text: "Healthcare facility project at Royal Berkshire Hospital, delivering flooring solutions to support outstanding work by MTX Contractors.", tags: ["Healthcare Sector", "MTX Partner"], image: "/media/project-royal-berkshire.webp", alt: "Flowing screed being laid in a bright hospital space", href: OUR_WORK },
    { sector: "Commercial", category: "Mixed Development", title: "Centre Square, Lily's Walk", text: "Major development project covering 27,000m² using Isocrete K Screed, Kingspan K103, EPS100 Void Former for Inland Homes.", tags: ["27,000m² Area", "Inland Homes Client"], image: "/media/project-centre-square.webp", alt: "The Centre Square apartment blocks at dusk", href: OUR_WORK },
    { sector: "Residential", category: "Residential Renovation", title: "Cemfloor C20 Living Space Transformation", text: "Complete living space transformation with Cemfloor C20 pour, from essential prep work to smooth, durable finish creating the perfect foundation.", tags: ["C20 Grade Strength", "Complete Renovation"], image: "/media/project-c20.webp", alt: "A living space before and after its Cemfloor C20 pour", href: OUR_WORK },
  ],
};

export const testimonials = {
  title: "What Industry Leaders Say",
  text: "Don't just take our word for it. Here's what construction professionals say about working with CSC Screeding.",
  image: { src: "/media/arundel.webp", alt: "The Maverick on site beside a new residential block" },
  items: [
    { quote: "CSC Screeding's programme certainty is unmatched. They delivered exactly when promised, allowing us to maintain our tight construction schedule. The Maverick technology eliminated our usual delays.", name: "Project Manager", role: "", project: "Mixed-Use Development, London" },
    { quote: "Spencer and the team transformed our approach to screeding. Their flowing screed solution was perfect for our underfloor heating installation, and the quality exceeded expectations.", name: "Sarah Thompson", role: "Site Manager, Bowmer & Kirkland", project: "Commercial Office Fit-Out" },
    { quote: "Working with CSC Screeding means working with true professionals. Their technical expertise and reliable delivery make them our go-to screeding specialists for major projects.", name: "Michael Roberts", role: "Construction Director, Morgan Sindall", project: "Residential Development, Surrey" },
  ],
};

// "Latest Articles": the three on the live homepage. Its links point at a preview host, so they go to the same
// posts on cscscreeding.co.uk/post/. Summaries are each post's own meta description.
export const insights = {
  title: "Latest Articles",
  text: "Stay informed with the latest insights from the construction industry's leading screeding specialists.",
  all: { label: "Industry Blog", href: `${SITE}/blogs` },
  items: [
    { date: "9 July 2025", read: "2 min read", category: "Project Management", title: "Why Competitive Screed Quotes Can Still Derail Your Fit-Out Programme", text: "Not all screed quotes are equal. This post breaks down why fit-out contractors must look beyond the numbers to avoid costly delays and protect their programme.", image: "/media/article-quotes.webp", href: `${SITE}/post/screeding-subcontractor-quote-risks-fitout-projects` },
    { date: "9 July 2025", read: "2 min read", category: "Technical Guides", title: "25 Questions to Ask Before Choosing a Screeding Subcontractor", text: "Before awarding your next screed package, ask these 25 smart questions to avoid delays, rework, and stress. A practical checklist for fit-out contractors who value speed, certainty, and quality.", image: "/media/article-questions.webp", href: `${SITE}/post/new-blog-post-2595` },
    { date: "9 July 2025", read: "2 min read", category: "Project Management", title: "What to Check Before Signing Off a Screed Package on a Fit-Out", text: "Screed delays kill fit-out programmes. Here's what to check before signing off your next screed package, from programme alignment to QA and spec risks.", image: "/media/article-signoff.webp", href: `${SITE}/post/new-blog-post` },
  ],
};

export const contact = {
  title: "Ready to Guarantee Your Programme?",
  text: "Join the construction companies who trust CSC Screeding for programme certainty. Get your project estimate.",
  quoteTitle: "Get a quote for your project",
  quoteText: "Ready to secure your project timeline? Get a detailed quote and programme plan.",
  quotes: [
    { label: "Commercial Projects", href: `${SITE}/commercial-fit-out` },
    { label: "Residential Projects", href: `${SITE}/residential` },
  ],
  image: { src: "/media/maverick-truck.webp", alt: "A CSC operative beside the blue Maverick screed truck" },
  coverage: { title: "South-East Coverage", text: "Mobile service across the region", note: "Fast response times" },
  whyTitle: "Why Choose CSC Screeding?",
  why: ["Programme certainty protecting your fit-out timeline", "Mobile batching eliminates transport delays", "Specialist fit-out screeding expertise", "Fast-track commercial project experience"],
};

// The live footer groups. Items that are "#" on the live site point at their nearest real page (README, Decisions).
export const footer = {
  groups: [
    {
      title: "Commercial Services",
      links: [
        { label: "Retail Fit-Outs", href: `${SITE}/commercial-fit-out` },
        { label: "Office Fit-Outs", href: `${SITE}/commercial-fit-out` },
        { label: "Hospitality Projects", href: `${SITE}/commercial-fit-out` },
        { label: "Industrial Flooring", href: `${SITE}/commercial-fit-out` },
        { label: "Emergency Response", href: `${SITE}/commercial-fit-out` },
      ],
    },
    {
      title: "Residential Services",
      links: [
        { label: "Multi-Unit Developments", href: `${SITE}/residential` },
        { label: "Luxury Homes", href: `${SITE}/residential` },
        { label: "Underfloor Heating", href: `${SITE}/underfloor-heating-screeding-services` },
        { label: "Architectural Finishes", href: `${SITE}/residential` },
        { label: "Planning Support", href: `${SITE}/residential` },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Technical Specifications", href: `${SITE}/maverick` },
        { label: "Case Studies", href: OUR_WORK },
        { label: "Industry Blog", href: `${SITE}/blogs` },
        { label: "QA Documentation", href: `${SITE}/about` },
      ],
    },
  ],
  // From the live About page: "Regional Partner, Watford FC 2024-25 Season".
  partner: { src: "/media/watford.webp", alt: "Watford FC Regional Partner, 2024 to 25 season", w: 680, h: 236 },
  // CSC's own YouTube channel, which hosts both Maverick films. The live site lists no social accounts.
  socials: [{ name: "YouTube", icon: "youtube" as const, href: "https://www.youtube.com/@cscscreeding" }],
};
