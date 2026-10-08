# BeaconBank Image Asset Guide

## 📁 Image Assets Overview

All images are stored in `/public/images/` and are custom SVG illustrations designed to match the BeaconBank design system:
- **Color Scheme:** Emerald Green (#10b981) on light backgrounds
- **Style:** Professional, financial, trust-focused
- **Format:** SVG (scalable, lightweight, responsive)
- **Gradient Base:** Subtle green gradients for visual depth

---

## 🎨 Available Images

### 1. **hero-illustration.svg**
**Purpose:** Main hero section on landing page
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Digital wallet card with balance display
- Gradient background with light green theme
- Floating financial elements
- Money flow visualization
- Statistics bars showing growth

**Where to Use:**
- Landing page hero section (right column)
- Width: 300-400px on desktop, full width on mobile

**Code Example:**
```tsx
<img 
  src="/images/hero-illustration.svg" 
  alt="Digital Wallet Illustration"
  className="w-full max-w-md"
/>
```

---

### 2. **security-illustration.svg**
**Purpose:** Security & Compliance page hero
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Central shield with lock symbol
- Encryption layer indicators
- Check marks for security verification
- Encryption line pattern at base

**Where to Use:**
- Security page hero section
- Trust messaging areas
- Security features cards

**Code Example:**
```tsx
<img 
  src="/images/security-illustration.svg" 
  alt="Security & Encryption"
  className="w-full max-w-sm mx-auto"
/>
```

---

### 3. **growth-chart.svg**
**Purpose:** Statistics and growth visualization
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Animated growth chart line
- Data points (7 quarters of growth)
- Grid background with axis labels
- Revenue growth title
- +340% growth indicator

**Where to Use:**
- Landing page statistics section
- Dashboard pages
- Success metrics sections
- Fund recovery/refunds performance pages

**Code Example:**
```tsx
<img 
  src="/images/growth-chart.svg" 
  alt="Revenue Growth Chart"
  className="w-full max-w-md"
/>
```

---

### 4. **fund-recovery.svg**
**Purpose:** Fund recovery service visualization
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Circular recovery arrow
- Money stack illustration
- Success check mark
- Recovery statistics (15M recovered, 2,450 cases, 87% success)

**Where to Use:**
- Fund Recovery service page hero
- Recovery statistics cards
- Case success indicators

**Code Example:**
```tsx
<img 
  src="/images/fund-recovery.svg" 
  alt="Fund Recovery Process"
  className="w-full max-w-md"
/>
```

---

### 5. **team-trust.svg**
**Purpose:** Trust, team, and human-centered messaging
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Three people figures representing team/users
- Trust check marks under each person
- Heart symbol at bottom
- "Our Journey of Trust" messaging

**Where to Use:**
- Landing page trust section
- Testimonials header
- About/Our Journey section
- Team/Company culture pages
- Trust messaging areas

**Code Example:**
```tsx
<img 
  src="/images/team-trust.svg" 
  alt="Our Journey of Trust"
  className="w-full max-w-md"
/>
```

---

### 6. **dashboard-preview.svg**
**Purpose:** Dashboard interface preview
**Dimensions:** 400x400px (responsive SVG)
**Key Elements:**
- Complete dashboard card mockup
- Balance display showing $24,568.90
- Three stat cards (Transfers, Refunds, Accounts)
- Recent activity list
- Transaction indicators

**Where to Use:**
- Landing page dashboard preview section
- Dashboard walkthrough pages
- Feature comparison areas
- User journey illustrations

**Code Example:**
```tsx
<img 
  src="/images/dashboard-preview.svg" 
  alt="Dashboard Preview"
  className="w-full max-w-lg"
/>
```

---

## 🎯 Integration Instructions

### Add to Landing Page Hero Section

**File:** `app/page.tsx`

```tsx
// In the hero right column (replace existing Card)
<div className="hero-visual relative">
  <div className="float-animation absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
  <img 
    src="/images/hero-illustration.svg" 
    alt="Digital Wallet"
    className="w-full drop-shadow-lg"
  />
</div>
```

### Add Growth Chart to Stats Section

**File:** `app/page.tsx`

```tsx
// In stats section
<Card className="bg-gradient-to-br from-primary/10 to-accent/10">
  <CardHeader>
    <CardTitle>Performance Metrics</CardTitle>
  </CardHeader>
  <CardContent>
    <img 
      src="/images/growth-chart.svg" 
      alt="Growth Chart"
      className="w-full"
    />
  </CardContent>
</Card>
```

### Add Team Image to Trust Section

**File:** `app/page.tsx`

```tsx
// In trust section
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  <div>
    {/* Text content */}
  </div>
  <img 
    src="/images/team-trust.svg" 
    alt="Our Journey of Trust"
    className="w-full"
  />
</div>
```

### Add Illustrations to Service Pages

**File:** `app/services/recovery/page.tsx`

```tsx
// In hero section
<div className="hero-section grid grid-cols-1 md:grid-cols-2 gap-12">
  <div>
    {/* Text content */}
  </div>
  <img 
    src="/images/fund-recovery.svg" 
    alt="Fund Recovery"
    className="w-full max-w-md"
  />
</div>
```

**File:** `app/services/security/page.tsx`

```tsx
// In hero section
<img 
  src="/images/security-illustration.svg" 
  alt="Security & Compliance"
  className="w-full max-w-md"
/>
```

### Add Dashboard Preview

**File:** `app/page.tsx`

```tsx
// In dashboard preview section
<Card className="border-primary/20 bg-card/50">
  <CardContent className="p-0">
    <img 
      src="/images/dashboard-preview.svg" 
      alt="Dashboard"
      className="w-full"
    />
  </CardContent>
</Card>
```

---

## 🎨 Design System Integration

### Responsive Sizing

```css
/* Small screens (mobile) */
@media (max-width: 768px) {
  img {
    max-width: 100%;
    height: auto;
  }
}

/* Large screens (desktop) */
@media (min-width: 1024px) {
  img {
    max-width: 500px;
    height: auto;
  }
}
```

### Consistent Spacing

```tsx
<div className="space-y-8">
  <img src="/images/hero-illustration.svg" className="w-full" />
</div>
```

---

## 🚀 Optimization Tips

### SVG Advantages Used:
1. **Scalable** - Works at any screen size without quality loss
2. **Lightweight** - Each image ~5-8KB
3. **Accessible** - Add descriptive alt text
4. **Customizable** - Can adjust colors/opacity via CSS

### Performance Best Practices:
- Use native `<img>` tags (not background images)
- Add loading="lazy" for off-screen images
- Include descriptive alt text for SEO
- Keep SVG files minified

### Accessibility:
```tsx
<img 
  src="/images/hero-illustration.svg" 
  alt="BeaconBank digital wallet with multi-currency support"
  loading="lazy"
/>
```

---

## 📋 Image Usage Checklist

- [ ] Hero illustration on landing page
- [ ] Security illustration on security page
- [ ] Growth chart in statistics section
- [ ] Fund recovery image on recovery page
- [ ] Team/trust image in trust section
- [ ] Dashboard preview on landing
- [ ] All images have descriptive alt text
- [ ] Images are responsive (max-width set)
- [ ] Images use drop shadows or gradients appropriately
- [ ] Mobile layout tested with images

---

## 🔄 Future Image Needs

When you need more custom images:

**Additional illustrations to consider:**
- Refund processing workflow diagram
- Marketplace seller dashboard preview
- Global transfers world map
- Multi-currency wallet visualization
- Transaction history timeline

**Photo sourcing alternatives:**
- Unsplash (unsplash.com) - Free stock photos
- Pexels (pexels.com) - Free high-quality photos
- Pixabay (pixabay.com) - Free images & vectors

**Filter by tags:**
- "financial services"
- "team collaboration"
- "digital banking"
- "security"
- "growth"
- "success"

---

## 📸 Image Specifications

| Image | Format | Size | Color Scheme |
|-------|--------|------|--------------|
| hero-illustration | SVG | 400x400px | Green gradient |
| security-illustration | SVG | 400x400px | Green accent |
| growth-chart | SVG | 400x400px | Green themed |
| fund-recovery | SVG | 400x400px | Green primary |
| team-trust | SVG | 400x400px | Green & white |
| dashboard-preview | SVG | 400x400px | Green UI |

---

## 🎯 Color Reference

All images use the BeaconBank primary colors:
- **Primary Green:** `#10b981`
- **Dark Green:** `#059669`
- **Light Green:** `#d1fae5`
- **Opacity Variations:** 0.1, 0.3, 0.5, 0.7, 1.0

Match these colors when adding new images or filters.

---

**Created:** October 8, 2026  
**Last Updated:** October 8, 2026  
**Status:** Complete with 6 custom illustrations
