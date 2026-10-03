# Client Feedback Compliance Audit

**Date:** 1 Oct 2026
**Checked:** `main` @ `e821afd` (same as https://dekko-isho-group.vercel.app/)
**Sources:**
- Doc 1: [Feedback Pre-Chairman Presentation](https://docs.google.com/document/d/1iVUuyq8V8qITlXo8gchK0zstc5SaKchElU5LrjJK0_g/edit)
- Doc 2: [Short feedback doc](https://docs.google.com/document/d/1Ykj0_wWtT0t7V5iAz9O8jG1v1IKyxhXa/edit)
- Doc 3: [Redesign required](https://docs.google.com/document/d/1CStdBVRxEkIaSJcm8_l9wq_EC-FZVJI35rQRVzI5iXY/edit), including the 24 Sep meeting notes

Where the docs conflict, the 24 Sep meeting notes win (newest instruction).

## Summary

| Status | Count |
|---|---|
| Not done | 15 |
| Partly done | 12 |
| Needs a decision or client input | 8 |
| Image swaps to confirm | 16 |

**Live responsive check (100% complete):** 40 scans (9 pages at 360, 412, 768 and 1440px, plus 1024px on Home, About, Career and Manufacturing). No sideways overflow and no broken images anywhere. The only flaw: the Manufacturing "From Sourcing to Packing" connector line is cut off at the right edge on desktop. The Chairman note (412px), the DGL "9" card (412px and 1440px) and the footer email (1100px) were verified visually.

---

## Not done

### Career
- [ ] **Open Positions:** add a "Learn more" button that opens a job description, with "Apply Now" at the bottom going to the Google Form. Rows currently link straight to the form. *(Meeting 18)*
- [ ] **Open Positions:** add a way to upload a CV for future opportunities. Nothing exists on the site. *(Meeting 18, Doc 1)*
- [ ] **Open Positions:** reduce vertical padding. Still the default 10rem section spacing. *(Meeting 16)*

### Contact
- [ ] **Let's Connect:** increase text size. Still 15.2px on the live site. *(Meeting 17)*
- [ ] **Message form:** increase font size. Inputs are 14.4px. *(Meeting 17)*

### Integrated Manufacturing
- [ ] **Capacity at Scale:** show numbers as "3.5 Million +". They show "3.5M+", "2.5M+" and "1M+" (changed 30 Sep by Sakibur and Tushar). *(Meeting 3, which overrides Doc 1's "3.5+ Million")*
- [ ] **Capacity at Scale:** add colour, texture or a gradient inside the cards. They're flat fills. *(Doc 1)*
- [ ] **Materials section:** title must be exactly "Materials, Quality, & Sampling – Managed End to End". It still says "and" and is hardcoded in `ManufacturingOperationSection.tsx`, so editing the data file won't fix it. *(Meeting 4)*
- [ ] **Powered by Technology:** line the carousel arrows up with the slide text. They sit about 20px off. *(Meeting 5)*
- [ ] **Trusted by Global Fashion Brands:** the bottom-card partner numbers should be small like "26+". They show 10+ and 14+ at 50px against 36px. *(Doc 1)*
- [ ] **From Sourcing to Packing:** the decorative connector line runs about 50px past the right edge on desktop and gets cut off. *(Live responsive check)*

### About
- [ ] **Cover carousel:** add the Izakaya image. *(Doc 1)*
- [ ] **Cover carousel:** fix alt text. Four of the five slides describe a different picture. The Global Market Presence card's alt text is also out of date.
- [ ] **Built on Expertise Driven by Impact:** give it the more dynamic, creative visualization the client asked for. It's still the July flip-card grid. *(Doc 1, Doc 3)*

### Sustainability
- [ ] **Certifications:** switch to the refined, evenly sized logos in `public/images/awards/logos2/` (added 21 Sep, never used). The live logos are uneven and blurry, and GOTS, SLCP and GRS are left out. *(Doc 1, Meeting 10)*

---

## Partly done

- [ ] **Career, Employee Voices:** the intro has two commas the client's text doesn't. Mohsina's quote has an extra comma, Shahed's starts with a space, and Safa's ends with an invisible character. *(Doc 1)*
- [ ] **Career, Life at Dekko ISHO Group:** three cards still use off-centre image framing (22%, 25%, 32%). *(Doc 1)*
- [ ] **Career, all carousels:** the About and Career hero arrows look different, and the Life carousel has no arrows. *(Meeting 2, Meeting 11)*
- [ ] **Contact, Factory Locations:** names say "Ltd." instead of "Limited", and the Globus Embroidery address has extra spaces. *(Doc 2, Doc 3)*
- [ ] **Contact, Let's Connect alignment:** the social icons line up with the phone number, not the email, and the two stack on phones. The label reads "Address" instead of "Our Location". *(Doc 3, Meeting 17)*
- [ ] **Manufacturing, Product Categories:** cards are labelled "Caps" and "Jackets" instead of "Cap" and "Jacket". *(Doc 1)*
- [ ] **Manufacturing, logo alt text:** "Helly Hensen AS" (should be Hansen), "Camel" (Camel Active), "Selected homme". *(Doc 1)*
- [ ] **About, From Foundation to Future:** the removed button's empty container still leaves about 45px of space. *(Doc 1)*
- [ ] **Embroidery, Capacity:** shows "2.2B" instead of "2,200,000,000". The DGL card's "50M+ Stitches/month" also doesn't fit with 2.2B. *(Doc 1)*
- [ ] **Embroidery, Precision in Every Stitch:** the tablet and phone card strip has no arrows or dots, unlike the other carousels. *(Meeting 2)*
- [ ] **Businesses menu:** DIVC opens in the same tab; the other five open a new tab. *(Doc 1)*
- [ ] **Home, business carousel:** arrows are always visible below it instead of the hover-arrow design. *(Meeting 2)*

---

## Needs a decision or client input

- [ ] **Manufacturing partner counts:** the client asked for 26+, 11+ and 15+. Sakibur changed them to 24+, 10+ and 14+ on 30 Sep, probably to match the logo count. Ask him before switching back.
- [ ] **Manufacturing capacity format:** switching to "3.5 Million +" means resizing the circles on phones. Production Network figures like "1.44M" should then use "Million" too, so the page uses one style.
- [ ] **Manufacturing map green:** uses mint #5abe8c. Confirm whether the client meant the darker brand green #29704e.
- [ ] **Embroidery "Every Design Perfected" section:** removed, as Docs 2 and 3 asked, but the meeting notes say no decision has been made yet.
- [ ] **Carousel speed:** shared carousels change every 2 seconds, which leaves only about 1.4 seconds to read each caption. On phones, one tap stops autoplay for good.
- [ ] **Footer:** redesigned on 29 Sep; needs client sign-off on whether it still feels crowded.
- [ ] **Waiting on the client:** the "More Than a Workplace" image, the Life at Dekko ISHO Group card content, and a new Globus Embroidery image. The meeting notes all three as not supplied.

---

## Image swaps to confirm

The docs' "from here" links were lost in the text export, so compare these files against the client's folders.

| Page | Card | Current file |
|---|---|---|
| Home | Ensuring Traceability and Transparency | `visibility2.png` |
| Home | Brand logos | `dekko-clients/v5/*.png` |
| About | Carousel: DITECH, DIVC, Klubhaus (plus Ecovia and a furniture image that weren't requested) | `about-slide-10` to `14.png` |
| About | Global Market Presence | `global_market_presence.png` |
| Manufacturing | Everything Connected | `manufacturing_ecosystem2.png` |
| Manufacturing | 8 automation cards | `*_machine2.png` |
| Manufacturing | Salesman Sample Development | `salesman_sample_development3.png` |
| Manufacturing | Cap / Jacket | `cap.png` / `jacket.png` |
| Manufacturing | Dekko Fashions / Agami Fashions | `DFL-Card-Image.png` / `AFL-Card-Image.png` |
| Industrial Laundry | Garment Dyeing / Denim Wash | `garment_dyeing.png` / `denim_wash.png` |
| Industrial Laundry | Conveyor Dryers | `conveyor_dryers3.png` |
| Industrial Laundry | Quality Assurance | `quality_assurance_og2.png` |
| Industrial Laundry | Modern Washing Laboratory | `modern_washing_laboratory_banner.png` |
| Industrial Laundry | Effluent Treatment Plant | `etp_card.png` |
| Industrial Laundry | R&D slides | `wash_recipe_development.png` / `sample_development.png` |
| Embroidery | Globus Embroidery | `globus_embroidery2.png` |

The Garment Dyeing and Denim Wash file names are hardcoded in `IndustrialLaundryWashingProcessesSection.tsx`, so swap those images there, not in the data file.

---

## Responsive risks in the code

None of these broke the live scans, but they're worth fixing:

- **About Top Executives, 992–1200px:** photos stretch into ovals.
- **Career Open Positions, 768–991px:** the five-column rows squeeze job titles.
- **Chairman note, 991–1061px:** fixed heights shrink the body text to 12px.
- **Contact main map:** conflicting CSS crops its bottom, including the Google credit.
- **Industrial Laundry capacity circles, phones:** "Advanced Washing Machines" wraps to three lines near the circle edge.
- **Manufacturing capacity circles:** "3.5 Million +" won't fit on phones without resizing.

---

## Done

- **Home:** typewriter cursor removed; 23 brand logos with even gaps; "TO SCALE", "From Comprehensive Wash", "To Detailed Craft"; Weaving the Future CTAs removed and card colours added; parallax; Latest News copy; Let's Connect labels, address and London Display Center; connect@dekkoisho.com everywhere.
- **Footer:** Corporate HQ address, email, and external business links.
- **Site-wide:** no visible "Isho" left; page titles fixed.
- **Contact:** "Let's Start a Conversation" title, "Send" button, Corporate HQ / London Display Center format.
- **About:** Corporate and old DIVC images removed; DITECH, new DIVC and new Klubhaus images added; Meet Leadership goes to the leadership section; reduced padding; "Crafting Excellence at Scale"; Chairman line removed and verified on Android width; only three CXOs shown.
- **Career:** hero hover arrows; no gap after the last Life card; number and text animation; Employee Voices hover effect, names, positions and photos.
- **Design Studio:** hero CTA removed; all title changes; faster autoplay with hover arrows; faster journey animation; closing CTA heading with no pill and the button kept.
- **Manufacturing:** hero CTA removed; red line removed; faster journey animation; 40+ Years; "3 Key Regions" removed; International pill hidden; logo containers removed; Europe and North America logo lists (Levis, not Lee); closing CTA fixed.
- **Industrial Laundry:** hero CTA removed; glass wash cards; Repairing, R&D and Water Efficiency cards removed; R&D section turned into a carousel without Process Optimization; Biomass Boiler text; closing CTA fixed.
- **Embroidery:** hero CTA removed; count-up numbers; DGL "9" gap fixed; closing CTA fixed.
