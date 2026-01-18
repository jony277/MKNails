# 🎨 MK Nails - Image & Resource Placement Guide

## **LIVE PREVIEW URL**
Once GitHub Pages is enabled, view your site here:
```
https://jony277.github.io/MKNails/
```

---

## **📍 WHERE TO ADD IMAGES - EXACT LOCATIONS**

### **1️⃣ HERO SECTION BACKGROUND (Optional Enhancement)**
**Location:** Line ~115 in index.html
```html
<section class="hero">
```
**What to do:** 
- Keep as-is for clean, professional look OR
- Add a subtle background image to `.hero` styling

---

### **2️⃣ SERVICE CARD IMAGES (PRIORITY - Most Important)**
**Location:** Lines ~340-415 (Each service card has this structure)

**CURRENT CODE:**
```html
<div class="service-image">💎</div>
```

**REPLACE WITH YOUR IMAGES:**
```html
<div class="service-image" style="background-image: url('YOUR-IMAGE-URL'); background-size: cover; background-position: center;"></div>
```

**EXAMPLE - Service 1 (Classic Manicure):**
```html
<div class="service-image" style="background-image: url('https://images.pexels.com/photos/12345/manicure.jpg'); background-size: cover; background-position: center;"></div>
```

**Images needed for all 6 services:**
- Classic Manicure (💎)
- Gel Manicure (✨)
- Nail Art (🎨)
- Spa Manicure (💄)
- Hard Gel Full Set (👑)
- Add-On Services (🧴)

**IMAGE SPECIFICATIONS:**
- Resolution: At least 400x300px (larger is better)
- Format: JPG or PNG
- Style: Clean, professional, well-lit nails
- Source options:
  - Use your own salon photos
  - Pexels.com (free, high quality)
  - Unsplash.com (free)
  - Pixabay.com (free)

---

### **3️⃣ TESTIMONIAL SECTION (Optional - Add Client Photos)**
**Location:** Lines ~450-475

**CURRENT CODE:**
```html
<div class="testimonial-card">
    <div class="testimonial-stars">★★★★★</div>
    <p class="testimonial-text">
        "Every time I leave MK Nails, I feel like a new person..."
    </p>
    <p class="testimonial-author">— Maria García</p>
</div>
```

**TO ADD PROFILE PHOTOS:**
```html
<div class="testimonial-card">
    <img src="YOUR-CLIENT-PHOTO-URL" alt="Maria García" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 15px; object-fit: cover;">
    <div class="testimonial-stars">★★★★★</div>
    <p class="testimonial-text">
        "Every time I leave MK Nails, I feel like a new person..."
    </p>
    <p class="testimonial-author">— Maria García</p>
</div>
```

---

## **🔧 HOW TO ADD IMAGES TO GITHUB**

### **OPTION 1: Use Free Image URLs (EASIEST)**
1. Go to **Pexels.com** or **Unsplash.com**
2. Search for "nails manicure" or specific nail designs
3. Click image → Copy the direct URL
4. Paste URL into your HTML where it says `YOUR-IMAGE-URL`

### **OPTION 2: Upload Your Own Photos to GitHub**
1. In your repo, create a new folder called `images`
2. Upload your photos there
3. Reference them like: `./images/classic-manicure.jpg`

---

## **📝 CUSTOMIZE BUSINESS INFORMATION**

### **Phone Number** 
**Location:** Line ~515
```html
<a href="tel:">📞 (561) 555-0123</a>
```
**Change to:**
```html
<a href="tel:+15615551234">📞 (561) 555-1234</a>
```

### **Email**
**Location:** Line ~516
```html
<a href="mailto:">📧 hello@mknails.com</a>
```
**Change to:**
```html
<a href="mailto:your-email@mknails.com">📧 your-email@mknails.com</a>
```

### **Address**
**Location:** Line ~517
```html
<a href="#">📍 Atlantis, Florida</a>
```
**Change to:**
```html
<a href="#">📍 123 Your Street, Atlantis, FL 33139</a>
```

### **Hours**
**Location:** Lines ~510-512
```html
<a href="#">Monday - Friday: 10am - 7pm</a>
<a href="#">Saturday: 10am - 6pm</a>
<a href="#">Sunday: 12pm - 5pm</a>
```

### **Service Prices**
**Location:** Lines ~347, ~367, ~387, ~407, ~427, ~447
```html
<span class="service-price">$19</span>
```

### **Service Names & Descriptions**
**Location:** Lines ~345-350 and throughout services section
```html
<h3 class="service-name">Classic Manicure</h3>
<p class="service-description">Timeless elegance with professional polish and care</p>
```

---

## **🎨 COLOR SCHEME (Professional & Consistent)**

All colors are defined at the top of the CSS in `:root`. Everything matches perfectly:

```css
--color-primary: #F5B4C8;        /* Soft Pink (main accent) */
--color-secondary: #DCC8B4;      /* Warm Beige */
--color-accent: #D2AA6E;         /* Gold/Brown (elegant) */
--color-background: #FAF8F5;     /* Cream (premium feel) */
--color-text: #3C322D;           /* Dark brown (professional) */
```

**DO NOT CHANGE** these colors unless you want to redesign everything. They're coordinated to be feminine, professional, and luxurious.

---

## **✅ CHECKLIST BEFORE GOING LIVE**

- [ ] All 6 service card images added
- [ ] Phone number updated to your actual number
- [ ] Email updated to your actual email
- [ ] Hours updated to your actual hours
- [ ] Address updated to your salon location
- [ ] Service prices match what you charge
- [ ] Service names/descriptions match your offerings
- [ ] Testimonials updated with real client feedback
- [ ] Social media links in footer connected (Instagram, Facebook, TikTok)
- [ ] Tested on mobile phone (should look smooth and professional)
- [ ] All images load properly (test in different browsers)

---

## **🚀 DEPLOYMENT STEPS**

### **Step 1: Enable GitHub Pages**
1. Go to **Settings** on your repo
2. Find **Pages** on the left sidebar
3. Under "Source" select **main** branch
4. Click **Save**
5. Wait 1-2 minutes

### **Step 2: View Your Live Site**
Your site is now live at: `https://jony277.github.io/MKNails/`

### **Step 3: Update & Push Changes**
```bash
git add .
git commit -m "Added images and updated business info"
git push origin main
```

Changes automatically update on your live site within seconds!

---

## **💡 PRO TIPS FOR SEAMLESS, PROFESSIONAL LOOK**

✅ **Images should all have same STYLE:**
- Bright, well-lit photos
- Consistent color grading
- Professional nail designs
- Clean backgrounds

✅ **Maintain the aesthetic:**
- Soft pink and gold tones complement nail photos beautifully
- Don't use overly bright or harsh images
- Keep a cohesive "spa-like" feeling

✅ **Text consistency:**
- Descriptions should be 1-2 sentences
- Prices consistent with market rates
- Professional, warm tone throughout

✅ **Testing:**
- Test on phone, tablet, and desktop
- All buttons should work smoothly
- Images should load without distortion
- Scroll animations should feel smooth

---

## **Questions? Next Steps?**

Once you've added all images and updated info:
1. Test the site in your browser
2. Check mobile view (should look perfect)
3. Verify all links work
4. Push to GitHub
5. Share your live URL!

**You've got this!** 🎉