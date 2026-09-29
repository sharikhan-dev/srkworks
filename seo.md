You are a senior technical SEO engineer, frontend developer, UX specialist, and conversion optimization expert.

I have an existing website called **SRK Works**:
https://srkworks.vercel.app/

It is NOT just a portfolio. It is a **portfolio + service-selling website** for web development, UI/UX design, and AI/digital solutions.

Your job is to audit the existing codebase and implement a complete, production-ready SEO optimization WITHOUT damaging the existing UI, animations, responsiveness, functionality, or branding.

## PRIMARY SEO GOAL

Position SRK Works as a professional digital service provider while also ranking individual projects and services.

The website should clearly communicate:

* What SRK Works does
* What services are offered
* What projects have been completed
* Why a client should contact SRK Works
* How to start a project

Target relevant search intent such as:

* web developer
* web development
* website development
* website designer
* UI/UX designer
* UI/UX design services
* custom website development
* business website development
* responsive website development
* AI solutions
* AI-powered websites
* web developer in Delhi
* website developer in Delhi
* UI/UX designer in Delhi

Do NOT keyword-stuff. Use keywords naturally and only where relevant.

---

# 1. HOMEPAGE SEO

Audit the current homepage and implement:

### Title

Use:

SRK Works | Web Development, UI/UX Design & AI Solutions

Keep the title concise and natural.

### Meta description

Use an approximately 150–160 character description similar to:

"SRK Works builds modern websites, UI/UX designs and AI-powered digital solutions for businesses, creators and startups."

Improve the wording if necessary while preserving the actual services offered.

### Canonical

Add the correct canonical URL:

https://srkworks.vercel.app/

Do not create incorrect canonical URLs.

### Robots

Ensure search engines are allowed to index the public website.

Do NOT accidentally add:

noindex
nofollow

to the main website.

---

# 2. HEADING STRUCTURE

Audit the complete heading hierarchy.

Requirements:

* Only ONE primary H1 on the homepage.
* H1 should clearly communicate the main service/value proposition.
* Use H2 for major sections.
* Use H3 for subsections/cards where appropriate.
* Do not use headings purely for visual styling.

Suggested H1 direction:

"Websites, Interfaces & AI-Powered Digital Experiences"

However, adapt it to the existing brand/design instead of blindly replacing the current hero.

---

# 3. HOMEPAGE CONTENT STRUCTURE

Maintain the existing design but make the semantic structure stronger.

Recommended hierarchy:

H1
Hero / primary value proposition

H2
Services

H3
Web Development

H3
UI/UX Design

H3
AI Solutions

H2
Selected Work / Projects

H2
Why SRK Works

H2
How We Work / Process

H2
Client Testimonials

H2
Frequently Asked Questions

H2
Have a Project in Mind?

Make sure every section has meaningful, human-readable content.

Do not add unnecessary paragraphs just to increase word count.

---

# 4. SERVICE SEO

If the current architecture supports multiple pages, create dedicated SEO-friendly service pages:

/services/web-development
/services/ui-ux-design
/services/ai-solutions

If the current project is a SPA, implement these routes using the existing framework/router instead of breaking the application.

Each service page should contain:

* Unique title
* Unique meta description
* One H1
* Service overview
* What is included
* Features
* Process
* Relevant technologies
* Relevant portfolio examples
* FAQ
* Clear CTA/contact section
* Internal links to relevant projects and other services

Example:

Title:
Web Development Services | SRK Works

H1:
Custom Web Development Services

Do NOT create thin pages containing only a few lines of keyword-focused text.

Only mention services that SRK Works genuinely provides.

---

# 5. PORTFOLIO / PROJECT SEO

Turn important portfolio projects into indexable project/case-study pages where technically appropriate.

Example structure:

/projects/project-name

Each project page should contain:

* Project title
* Project type
* Overview
* Problem
* Solution
* Design
* Development
* Features
* Technologies
* Screenshots
* Outcome/result if real and available
* CTA

Example H1:

"Top Muscle Nutrition Website"

Do NOT invent client results, revenue, traffic, conversion rates, testimonials, or statistics.

Use only real project information from the existing code/content.

---

# 6. INTERNAL LINKING

Create a logical internal linking structure:

Homepage
→ Services
→ Individual Service
→ Related Projects
→ Contact

Project pages
→ Relevant Service
→ Other relevant Projects
→ Contact

Use descriptive anchor text.

Avoid generic anchor text such as:

"click here"

Prefer:

"View web development services"

"Explore UI/UX projects"

"Start a website project"

---

# 7. LOCAL SEO

SRK Works can target Delhi/NCR if the business actually serves clients there.

Naturally mention something similar to:

"Based in Delhi, India — working with clients across India and worldwide."

Do NOT stuff "Delhi" throughout the website.

Do NOT create fake local addresses.

If structured local/business data is added, use only truthful information.

---

# 8. STRUCTURED DATA / JSON-LD

Implement appropriate Schema.org structured data.

Consider:

* Person
* Organization or ProfessionalService, where appropriate
* WebSite
* WebPage
* Service
* BreadcrumbList
* CreativeWork / relevant project schema where appropriate

Only use schema properties that are actually supported by visible website content.

Do NOT create fake:

* reviews
* ratings
* prices
* awards
* clients
* locations
* social profiles

Validate the JSON-LD syntax.

---

# 9. OPEN GRAPH / SOCIAL SHARING

Add proper Open Graph metadata.

Required:

og:title
og:description
og:image
og:url
og:type
og:site_name

Recommended OG image:

1200 × 630 px

Use a professional SRK Works branded image.

Also configure Twitter/X card metadata where appropriate.

When the website URL is shared on:

WhatsApp
Instagram
LinkedIn
Facebook
X

the preview should look professional.

---

# 10. ROBOTS.TXT

Create/fix:

/robots.txt

It should allow legitimate search-engine crawling.

Example structure:

User-agent: *
Allow: /

Sitemap: https://srkworks.vercel.app/sitemap.xml

Adjust this if the framework requires something different.

Do NOT block:

CSS
JavaScript
important images
public pages

---

# 11. XML SITEMAP

Create/fix:

/sitemap.xml

Include all important canonical, indexable public pages.

Do NOT include:

* admin pages
* login pages
* private dashboards
* duplicate URLs
* query parameter duplicates
* development routes

Keep sitemap URLs consistent with the canonical domain.

---

# 12. INDEXING SAFETY

Audit the entire project for accidental:

noindex
nofollow
canonical conflicts
duplicate URLs
SPA routing problems
404 pages
redirect chains
broken internal links

Make sure important pages return appropriate HTTP status codes.

Do not index private/admin pages.

---

# 13. IMAGE SEO

Audit all important images.

For meaningful images:

* Add descriptive alt text.
* Avoid keyword stuffing.
* Use empty alt="" for purely decorative images.
* Add width/height where appropriate to reduce layout shift.
* Use WebP/AVIF where supported.
* Compress oversized images.
* Lazy-load below-the-fold images.
* Do NOT lazy-load the main above-the-fold/LCP image if that hurts performance.

Alt text examples should describe the actual image.

Bad:

"web developer Delhi website design web developer"

Good:

"SRK Works website development project dashboard"

---

# 14. PERFORMANCE / CORE WEB VITALS

Optimize without changing the visual design unnecessarily.

Audit:

LCP
INP
CLS

Optimize:

* hero images
* project screenshots
* fonts
* JavaScript
* unnecessary dependencies
* animation performance
* image loading
* render-blocking resources

Avoid adding heavy SEO plugins/libraries if they are unnecessary.

Do not sacrifice design quality just to achieve an artificial score.

---

# 15. MOBILE SEO

Test the layout at:

320px
375px
390px
412px
768px
1024px
1440px

Fix:

* oversized typography
* horizontal overflow
* broken navigation
* buttons extending outside containers
* unreadable text
* excessive spacing
* tap targets
* mobile menu
* image overflow
* animation issues

Desktop design must remain intact.

---

# 16. ACCESSIBILITY

Audit:

* semantic HTML
* heading hierarchy
* button labels
* link labels
* image alt text
* keyboard navigation
* focus states
* color contrast
* form labels
* ARIA only where actually necessary

Do not use ARIA as a replacement for proper HTML.

---

# 17. URL STRUCTURE

Use clean URLs.

Good:

/services/web-development
/services/ui-ux-design
/projects/palettegen

Avoid:

/page?id=123
/project?name=xyz

Do not change existing public URLs unnecessarily if they already have backlinks or indexing history.

If URLs must change, add proper 301 redirects.

---

# 18. 404 PAGE

Create a professional custom 404 page.

It should contain:

* SRK Works branding
* clear "Page not found" message
* Home button
* Services button
* Contact button

Do not let unknown URLs simply show a broken blank page.

---

# 19. FAVICON + BRANDING

Verify:

* favicon
* apple touch icon where appropriate
* web manifest if the site uses PWA functionality
* correct logo metadata

Ensure favicon works on desktop and mobile.

---

# 20. FAQ

Add a useful FAQ section based ONLY on services actually offered.

Potential questions:

* How much does a website cost?
* How long does website development take?
* Do you build responsive websites?
* Do you provide UI/UX design?
* Can you redesign an existing website?
* Do you provide website maintenance?
* Can you integrate AI into a website?
* Do you work with clients outside Delhi?
* How does the website development process work?

Answers must be genuinely useful.

Do not create FAQ content only to insert keywords.

---

# 21. CONVERSION SEO

Remember that this is a SERVICE-SELLING portfolio.

Every important page should have a clear CTA.

Examples:

"Start Your Project"

"Discuss Your Project"

"Get a Website"

"View My Work"

"Contact SRK Works"

Make the conversion path simple:

Visitor
→ Understand service
→ See proof/work
→ Trust
→ Contact

Do not overwhelm users with too many CTAs.

---

# 22. SOCIAL / EXTERNAL PROFILE SIGNALS

Where appropriate, include genuine links to SRK Works profiles such as:

GitHub
LinkedIn
Behance
Instagram
Dribbble

ONLY include profiles that actually exist.

Do not create fake social URLs.

---

# 23. SECURITY / TECHNICAL CLEANUP

Audit the frontend for:

* exposed API keys
* unnecessary environment variables
* debug logs
* console errors
* broken routes
* mixed content
* insecure external resources

Never expose Supabase/service-role/private keys in frontend code.

Do not change working backend functionality without verifying dependencies.

---

# 24. SEO CONTENT RULE

Do NOT use AI-generated filler.

Every piece of SEO content must:

* help the visitor
* accurately describe SRK Works
* be unique
* be concise
* sound human
* support conversion

Do not repeat keywords unnaturally.

---

# 25. IMPORTANT — PRESERVE DESIGN

This is critical.

DO NOT:

* redesign the website unnecessarily
* change the existing brand identity
* remove animations without reason
* replace working components
* change colors randomly
* break responsive layouts
* remove portfolio projects
* remove existing functionality
* replace the existing framework

First inspect the existing codebase.

Then make the smallest safe changes required for SEO, accessibility, performance, and conversion.

---

# 26. FINAL TECHNICAL AUDIT

After implementation, check:

[ ] Homepage title
[ ] Meta description
[ ] Canonical
[ ] H1
[ ] H2/H3 hierarchy
[ ] robots.txt
[ ] sitemap.xml
[ ] Internal links
[ ] Broken links
[ ] 404
[ ] Open Graph
[ ] Twitter/X metadata
[ ] Favicon
[ ] Image alt text
[ ] Image optimization
[ ] Mobile responsiveness
[ ] Accessibility
[ ] Structured data
[ ] Service pages
[ ] Project pages
[ ] CTA placement
[ ] Performance
[ ] Console errors
[ ] No accidental noindex
[ ] No exposed secrets

Finally, provide a concise report containing:

1. What you found
2. What you changed
3. Files changed
4. New pages/routes created
5. SEO improvements
6. Performance improvements
7. Any issues that require manual action
8. Exact commands/checks I should run before deployment

Do not claim that SEO is "guaranteed" or that the site will rank #1.

The final result should be a technically clean, search-engine-friendly, conversion-focused **portfolio + service-selling website for SRK Works**.
