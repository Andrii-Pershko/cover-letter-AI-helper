You need to completely restyle the existing website UI to match the visual style of the provided reference image.

IMPORTANT:

* Do NOT change the application's functionality, business logic, routing, API calls, state management, data structures, or component behavior.
* Do NOT remove existing features.
* This is a VISUAL/UI redesign only.
* Preserve the existing HTML/React structure where possible, but modify classes and styles as needed to achieve the new design.
* Use the reference image as the primary visual direction.

## 1. Overall visual direction

The entire application should look like a modern premium SaaS dashboard using:

* Mint / pale aqua / turquoise color palette
* Frosted glass / glassmorphism
* Soft translucent surfaces
* Strong background blur
* Very subtle borders
* Large rounded corners
* Soft floating shadows
* Low-contrast UI
* Clean modern typography
* Lots of whitespace
* Very soft visual hierarchy
* Slightly futuristic but professional appearance

The result should feel similar to a modern sports/analytics SaaS dashboard built from floating glass panels.

Do NOT make it look like a generic Bootstrap dashboard.
Do NOT use heavy solid backgrounds.
Do NOT use excessive gradients inside every component.
Do NOT use strong black borders.
Do NOT use excessive shadows.

The design should feel light, airy and almost "floating".

---

## 2. Page background

Create a static background behind the entire application.

The background should NOT be a simple solid color.

Use a very light warm/mint base with subtle blurred gradient areas:

* pale mint
* very light cyan
* slightly warm cream
* very subtle lavender/blue areas

The background should look like soft blurred light behind frosted glass.

Example visual direction:

* Base: very light mint / off-white
* Large blurred radial gradients positioned around the viewport
* Very low saturation
* No sharp shapes
* No visible patterns
* No animation required

The background should remain fixed/static while the application content sits above it.

For example, conceptually:

body:
background:
very light mint base
+ several huge blurred radial gradients
background-attachment: fixed

Do not make the background too colorful. It should remain subtle.

---

## 3. Main application container

The main application/body area should look like a LARGE FLOATING GLASS PANEL sitting above the background.

This is very important.

The visual hierarchy should be:

BACKGROUND
↓
large translucent glass application container
↓
sidebar + content
↓
smaller glass cards
↓
buttons / inputs / controls

The main application container should have:

* translucent white/mint background
* backdrop-filter: blur(...)
* -webkit-backdrop-filter
* subtle white border
* very soft shadow
* large border-radius
* slight transparency

Something conceptually similar to:

background: rgba(255,255,255,0.35);
backdrop-filter: blur(30px);
-webkit-backdrop-filter: blur(30px);
border: 1px solid rgba(255,255,255,0.55);
box-shadow: 0 20px 60px rgba(..., very low opacity);
border-radius: 24px;

Do NOT blindly copy these exact values. Adjust them to match the reference.

The outer application container should feel like a single piece of frosted glass.

---

## 4. Sidebar

The sidebar should be integrated into the glass container rather than looking like a separate solid-colored navigation panel.

Use:

* transparent / translucent background
* subtle right border
* rounded overall application container
* lots of vertical spacing
* compact navigation items

Navigation items should be soft and minimal.

Normal state:

* transparent
* muted mint/teal text
* small icon
* no heavy background

Hover state:

* slightly brighter translucent surface
* subtle mint tint
* smooth transition

Active state:

* stronger turquoise/mint background
* white or very dark teal text depending on contrast
* rounded pill/card shape
* subtle shadow or glow

The active navigation item should visually "float" above the sidebar.

---

## 5. Header

The header should be minimal and spacious.

Use:

* transparent background
* no hard bottom border
* muted secondary text
* large clean heading
* small welcome/subtitle text
* modern icons
* avatar inside a small circular glass container if appropriate

The main page heading should have strong contrast but should NOT be pure black.

Prefer a deep dark teal / charcoal color.

Example visual hierarchy:

small label:
muted teal

main heading:
dark teal / charcoal

secondary information:
muted gray-green

---

## 6. Cards

All dashboard cards should use the same glass language.

Cards should look like individual pieces of translucent frosted glass floating inside the main glass container.

Use:

* semi-transparent white/mint background
* backdrop blur
* subtle 1px translucent border
* large rounded corners
* very soft shadow
* generous padding

Avoid completely opaque white cards.

Conceptually:

background: rgba(255,255,255,0.30–0.55);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.45);
box-shadow: 0 8px 30px rgba(..., low opacity);
border-radius: 18–24px;

The cards should have subtle differences in opacity to create depth.

---

## 7. Card hierarchy

Use different levels of glass transparency.

For example:

Level 1:
main application glass

Level 2:
dashboard cards

Level 3:
small statistic cards

Level 4:
inputs/buttons/interactive controls

This should create a layered "glass floating above glass" effect.

Do not make every element the same shade.

---

## 8. Buttons

Buttons should also follow the glassmorphism design.

Primary buttons:

* mint / turquoise accent
* rounded corners
* subtle gradient or translucent accent
* white or very dark text depending on contrast
* soft shadow
* smooth hover transition

Secondary buttons:

* transparent/frosted glass
* subtle border
* muted dark teal text

Ghost buttons:

* completely transparent
* no heavy border
* subtle hover background

Hover:

* slightly brighter
* slightly stronger shadow
* subtle upward/floating feeling

Active:

* slightly reduced shadow
* small visual compression

Transitions should be smooth, around 150–250ms.

Avoid overly large buttons.

---

## 9. Inputs

Inputs are extremely important.

They should look like translucent glass fields rather than standard HTML inputs.

Use:

* semi-transparent white/mint background
* backdrop blur
* subtle light border
* rounded corners
* dark teal text
* muted placeholder
* comfortable vertical padding

Normal:

background: rgba(255,255,255,0.35–0.50)

Border:

very subtle translucent white/gray

Focus:

* mint/turquoise border
* very soft mint glow/ring
* slightly brighter background

Example visual effect:

focus:
border-color: accent
box-shadow: 0 0 0 3px rgba(accent, 0.12)

Do NOT use a strong blue browser-style focus ring.

Inputs, selects, textareas, search fields and similar controls should all follow the same design system.

---

## 10. Tables

Tables should NOT look like traditional admin tables.

Make them feel integrated into the glass dashboard.

Use:

* transparent table background
* very subtle row separators
* rounded outer container
* muted headers
* comfortable row height
* soft hover effect

Rows on hover should receive a very subtle translucent mint background.

Avoid strong horizontal lines.

Bad:

white background + gray borders + traditional table styling

Good:

transparent glass surface + subtle separators + floating rows.

---

## 11. Badges / status indicators

Use soft pill-shaped badges.

Avoid saturated solid colors.

Instead use translucent versions:

success:
soft mint/green background + dark green text

warning:
soft warm yellow/orange background + dark orange text

error:
soft pink/red background + dark red text

info:
soft cyan/blue background + dark teal text

The colors should remain pastel and fit the overall glass aesthetic.

---

## 12. Modals / dialogs / dropdowns

All overlays should continue the same glass system.

Modal:

* translucent white/mint surface
* strong backdrop blur
* large rounded corners
* subtle border
* soft shadow
* no solid white background

Dropdown:

* floating glass panel
* backdrop blur
* subtle border
* rounded corners
* soft shadow

The modal should look like another floating piece of glass.

---

## 13. Icons

Use clean modern icons.

Icons should generally be:

* muted teal
* dark teal
* or accent mint/turquoise

Avoid oversized icons.

Icons should visually align with the typography and spacing.

---

## 14. Typography

Use a clean modern sans-serif font.

Typography should have:

* strong but not excessive heading weights
* dark teal/charcoal primary text
* muted gray-green secondary text
* comfortable line-height
* slightly generous letter spacing where appropriate

Avoid pure #000000 text.

Prefer dark charcoal / dark teal.

---

## 15. Borders

Borders should be extremely subtle.

Use translucent borders instead of traditional gray borders.

Examples conceptually:

rgba(255,255,255,0.45)

or

rgba(100,150,145,0.12)

The border should mostly be visible because of the contrast between glass surfaces.

Do not use:

border: 1px solid #ccc

throughout the application.

---

## 16. Shadows

Use soft, large shadows.

The purpose of the shadow is to create DEPTH, not a visible black outline.

Prefer:

* large blur radius
* low opacity
* multiple subtle layers if necessary

Avoid:

* dark small shadows
* strong black shadows
* material-design-like heavy elevation

Elements should look like they are gently floating.

---

## 17. Rounded corners

Use generous rounded corners throughout the application.

Suggested hierarchy:

* Main application: 24–32px
* Large cards: 20–24px
* Small cards: 16–20px
* Inputs: 12–16px
* Buttons: 12–16px
* Pills/badges: 9999px

Keep the radius system consistent.

---

## 18. Color system

Create a coherent design system rather than manually selecting random colors.

Primary palette should be approximately:

* Background: very pale mint / warm off-white
* Surface: translucent white with mint tint
* Surface elevated: slightly brighter translucent white
* Primary accent: turquoise / mint
* Accent hover: slightly darker turquoise
* Primary text: dark teal / charcoal
* Secondary text: muted gray-green
* Border: translucent white / muted mint
* Success: pastel green
* Warning: pastel yellow/orange
* Error: pastel pink/red

The screenshot is intentionally low contrast, so avoid overly saturated colors.

---

## 19. Glass effect details

The "flying glass" feeling is one of the most important parts of this redesign.

Use multiple layers:

1. Static blurred background
2. Main frosted glass container
3. Smaller translucent cards
4. Interactive glass controls
5. Very subtle highlights on borders
6. Soft shadows creating separation

Some cards can have a slightly brighter top/left edge to simulate light reflection.

For example, use a subtle border or pseudo-element with low-opacity white.

The glass should NOT look like plastic.

It should feel soft, translucent and slightly luminous.

---

## 20. Responsive behavior

Keep the existing responsive functionality.

The glass design must work on:

* desktop
* laptop
* tablet
* mobile

On mobile:

* reduce outer margins
* reduce border radius where appropriate
* stack cards
* collapse/hide sidebar according to existing application behavior
* preserve readable spacing
* do not let glass effects make the UI difficult to read

---

## 21. Tailwind implementation

The project already uses Tailwind CSS.

Prefer Tailwind utilities and existing project conventions instead of creating huge amounts of custom CSS.

However, if some effects cannot be expressed cleanly with Tailwind, create reusable CSS variables/utilities for:

* glass surfaces
* glass borders
* glass shadows
* background gradients
* accent colors

Create a small consistent design system.

For example, conceptually define reusable values such as:

--background
--glass
--glass-strong
--glass-border
--glass-shadow
--accent
--accent-hover
--text-primary
--text-secondary

Then reuse these values throughout the application.

Do not hardcode slightly different colors for every component.

---

## 22. Important visual rule

The final result should NOT look like:

"normal website + mint colors"

It should look like:

"glass interface floating above a soft mint atmospheric background."

The glass layering and depth are more important than the exact colors.

Think:

soft background
→ translucent large glass shell
→ floating glass cards
→ translucent controls
→ subtle mint accents
→ soft shadows
→ lots of whitespace

---

## 23. Existing components

Go through the existing application and apply this design consistently to ALL UI elements:

* layout
* sidebar
* header
* navigation
* cards
* buttons
* inputs
* selects
* textareas
* checkboxes
* radio buttons
* switches
* tables
* pagination
* tabs
* dropdowns
* modals
* dialogs
* alerts
* badges
* tooltips
* loaders
* empty states
* forms
* authentication pages

Do not redesign only the dashboard while leaving other pages with the old visual style.

The entire application should feel like one coherent design system.

---

## 24. Reference image

Use the provided reference image as the visual target.

Pay particular attention to:

* pale mint atmospheric background
* large translucent application shell
* frosted glass surfaces
* subtle white borders
* turquoise accents
* rounded cards
* soft shadows
* low-contrast colors
* floating/layered appearance
* clean spacing
* modern SaaS dashboard feeling

Do NOT copy the content, text, logos, or exact layout from the screenshot.

Only reproduce the VISUAL LANGUAGE and design system.

---

## 25. Before finishing

After implementing the redesign:

1. Check every page.
2. Check every reusable component.
3. Check hover/focus/active/disabled states.
4. Check forms and inputs.
5. Check responsive layouts.
6. Remove inconsistent old colors.
7. Remove old hard borders/backgrounds that conflict with the glass system.
8. Make sure text remains readable.
9. Make sure glass effects do not negatively affect performance.
10. Keep all existing functionality intact.

The final result should feel like a polished premium "Mint Glassmorphism / Frosted Glass SaaS Dashboard", visually close to the provided reference.
