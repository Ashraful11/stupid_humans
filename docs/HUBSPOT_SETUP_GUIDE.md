# Complete Guide: Setting Up Stupid Humans Tech in HubSpot CMS

This guide will walk you through setting up your entire website in HubSpot's Content Hub (formerly CMS Hub), giving you access to their professional content management system.

## Table of Contents
1. [HubSpot Account Setup](#1-hubspot-account-setup)
2. [Choosing the Right Plan](#2-choosing-the-right-plan)
3. [Domain Configuration](#3-domain-configuration)
4. [Migrating Your Website to HubSpot](#4-migrating-your-website-to-hubspot)
5. [Setting Up Blog & News](#5-setting-up-blog--news)
6. [Creating Templates](#6-creating-templates)
7. [Content Management](#7-content-management)
8. [SEO Configuration](#8-seo-configuration)
9. [Analytics Setup](#9-analytics-setup)

---

## 1. HubSpot Account Setup

### Step 1: Create Your HubSpot Account

1. Go to [HubSpot.com](https://www.hubspot.com)
2. Click "Get started free" or "Start free trial"
3. Enter your details:
   - Email address
   - Company name: "Stupid Humans Tech"
   - Website: your domain
   - Number of employees
4. Complete verification

### Step 2: Access Content Hub

1. After signup, you'll be in the HubSpot dashboard
2. Navigate to **Marketing** → **Website** → **Website Pages**
3. You'll see the Content Hub interface

---

## 2. Choosing the Right Plan

### HubSpot Content Hub Pricing (2025)

| Plan | Price | Best For | Key Features |
|------|-------|----------|--------------|
| **Free Tools** | $0/month | Testing, Basic Sites | - Basic website pages<br>- Simple blog<br>- SSL certificate<br>- Limited to 25 pages |
| **Starter** | $23/month | Small Blogs | - Unlimited pages<br>- SEO recommendations<br>- Email support<br>- 1 user |
| **Professional** | $360/month | Growing Sites | - Content staging<br>- A/B testing<br>- Advanced SEO<br>- 3 users<br>- Smart content |
| **Enterprise** | $1,200/month | Large Sites | - Multi-site management<br>- Advanced analytics<br>- Partitioning<br>- 10 users |

### Recommendation for Stupid Humans Tech:

**Start with Free Tools** → Upgrade to **Starter** when you need more pages

**Why?**
- You're a blog/news site (perfect for HubSpot)
- Free tier gives you 25 pages (enough to test)
- Upgrade to Starter ($23/mo) for unlimited blog posts
- Professional ($360/mo) only if you need staging/A/B testing

---

## 3. Domain Configuration

### Option A: Use HubSpot Domain (Free)

1. HubSpot provides free subdomain: `stupidhuman.tech.hubspotpagebuilder.com`
2. No setup needed - instant activation
3. Good for testing

### Option B: Connect Your Own Domain (Recommended)

#### If You Own a Domain:

1. In HubSpot, go to **Settings** → **Website** → **Domains & URLs**
2. Click **Connect a domain**
3. Enter your domain: `stupidhuman.tech`
4. HubSpot will provide DNS records

#### Update Your DNS (at your domain provider):

**For Primary Domain:**
```
Type: A Record
Name: @
Value: 23.227.38.32 (HubSpot's IP)
TTL: 300
```

**For WWW:**
```
Type: CNAME
Name: www
Value: <your-hub-id>.sites.hubspot.net
TTL: 300
```

**SSL Certificate:**
- HubSpot automatically provisions SSL (HTTPS)
- Takes 4-24 hours to activate
- Free included with all plans

---

## 4. Migrating Your Website to HubSpot

### Step 1: Create Your Homepage

1. Go to **Marketing** → **Website** → **Website Pages**
2. Click **Create** → **Website page**
3. Choose a template or start blank
4. Name it "Home" and set URL slug to `/`

### Step 2: Upload Your Assets

1. Go to **Marketing** → **Files and Templates** → **Files**
2. Click **Upload files**
3. Upload your assets:
   - `/assets/images/` - All your images
   - `/assets/video/` - Your chimp evolution video
   - Logo files
   - Any other media

### Step 3: Convert Your HTML to HubSpot

You have 2 options:

#### Option A: Use Drag-and-Drop Editor (Easiest)

1. Create new page with drag-and-drop template
2. Recreate your design using HubSpot modules:
   - **Hero Section** → Add "Split screen" module
   - **Logo Banner** → Add "Logo carousel" module
   - **About Section** → Add "Text + Image" modules
   - **Automation Cards** → Add "Card deck" module
   - **News Section** → Add "Blog listing" module

#### Option B: Upload Custom HTML Template (Advanced)

1. Go to **Marketing** → **Files and Templates** → **Design Tools**
2. Click **New file** → **HTML + HubL template**
3. Paste your HTML code
4. Convert to HubL syntax (HubSpot's templating language)

**Example Conversion:**

Your HTML:
```html
<nav class="navbar">
    <div class="logo">Stupid Humans Tech</div>
    <ul class="nav-menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="blog-marketing.html">Blog</a></li>
    </ul>
</nav>
```

HubSpot HubL:
```html
<nav class="navbar">
    <div class="logo">{{ site_settings.company_name }}</div>
    {% menu "main_menu" %}
</nav>
```

5. Upload your CSS file:
   - Go to **Design Tools**
   - Upload `styles.css`
   - Reference it in your template

---

## 5. Setting Up Blog & News

### Create Your Blog

1. Go to **Marketing** → **Website** → **Blog**
2. Click **Settings** → **Blog settings**
3. Configure:
   - **Blog title**: "Stupid Humans Tech Blog"
   - **Blog URL**: `/blog`
   - **Root URL**: Your domain
   - **Language**: English

### Create News Section (Second Blog)

HubSpot allows multiple blogs:

1. Go to **Settings** → **Website** → **Blog**
2. Click **Create new blog**
3. Configure:
   - **Blog title**: "AI & Marketing News"
   - **Blog URL**: `/news`

### Blog Settings to Configure:

#### 1. SEO Settings
- **Page title format**: `{{ content.name }} | Stupid Humans Tech`
- **Meta description**: Default description for posts

#### 2. Listing Page
- Posts per page: 12
- Layout: Grid (2 or 3 columns)

#### 3. Social Sharing
- Enable social share buttons
- Configure Open Graph images

#### 4. Comments
- Enable HubSpot comments or integrate Disqus

---

## 6. Creating Templates

### Blog Post Template

1. Go to **Design Tools**
2. Create **New file** → **Blog template**
3. Add these modules:

```html
{% module "post_title"
   path="@hubspot/text",
   value="{{ content.name }}"
%}

{% module "post_meta"
   path="@hubspot/blog_post_meta"
%}

{% module "featured_image"
   path="@hubspot/image",
   img_src="{{ content.featured_image }}"
%}

{% module "post_body"
   path="@hubspot/rich_text",
   html="{{ content.post_body }}"
%}

{% module "post_tags"
   path="@hubspot/blog_tags"
%}

{% module "related_posts"
   path="@hubspot/blog_related_posts",
   limit=3
%}
```

4. Style with CSS
5. Save and publish

### Create Templates for:

1. **Blog Post Template** - For tutorials
2. **News Article Template** - For news updates
3. **Landing Page Template** - For main pages
4. **Homepage Template** - Unique homepage design

---

## 7. Content Management

### Creating Blog Posts in HubSpot

#### Step 1: Create New Post

1. Go to **Marketing** → **Website** → **Blog**
2. Click **Create** → **Blog post**
3. Choose your template

#### Step 2: Content Tab

Fill in:
- **Title**: Your blog post title
- **Post body**: Write content (supports rich text and Markdown)
- **Featured image**: Upload or select from files
- **Author**: Select author
- **Tags**: Add relevant tags (automation, n8n, etc.)
- **Categories**: Organize posts (Tutorials, Case Studies, etc.)

#### Step 3: Settings Tab

Configure:
- **URL slug**: Auto-generated or custom
- **Meta description**: SEO description (140-160 chars)
- **Canonical URL**: If republishing content
- **Featured post**: Check to highlight
- **Allow comments**: Enable/disable

#### Step 4: Optimize Tab (SEO)

HubSpot's SEO recommendations:
- ✅ Title length (50-60 characters)
- ✅ Meta description (140-160 characters)
- ✅ Focus keyword usage
- ✅ Image alt text
- ✅ Header tags (H1, H2)
- ✅ Content length (300+ words)
- ✅ Internal links
- ✅ Mobile optimization

**SEO Score**: HubSpot shows 0-100 score

#### Step 5: Schedule Tab

Publishing options:
- **Publish immediately**
- **Schedule for later**: Set date/time
- **Draft**: Save without publishing

#### Step 6: Preview

- Preview on desktop
- Preview on mobile
- Send preview link to stakeholders

#### Step 7: Publish

1. Click **Publish** or **Schedule**
2. Post goes live on your blog
3. Auto-generates RSS feed
4. Submits to search engines

---

## 8. SEO Configuration

### Global SEO Settings

1. Go to **Settings** → **Website** → **Pages** → **SEO & Crawlers**

2. **Default page titles**:
   ```
   {{ page.name }} | Stupid Humans Tech
   ```

3. **Default meta description**:
   ```
   Free marketing automation tutorials and AI news. Learn to save time with n8n, Zapier, Google Apps Script, and more.
   ```

4. **Favicon**: Upload your favicon (32x32px)

5. **Social media defaults**:
   - Facebook Open Graph image (1200x630px)
   - Twitter Card image (1200x675px)

### Robots.txt Configuration

1. Go to **Settings** → **Website** → **Pages** → **SEO & Crawlers**
2. Edit **robots.txt**:

```
User-agent: *
Allow: /
Sitemap: https://stupidhuman.tech/sitemap.xml

# Disallow admin pages
Disallow: /admin
Disallow: /preview
```

### XML Sitemap

HubSpot auto-generates sitemaps:
- **Blog sitemap**: `https://yourdomain.com/blog-sitemap.xml`
- **Pages sitemap**: `https://yourdomain.com/sitemap.xml`

**Submit to Google:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Submit sitemap URLs

---

## 9. Analytics Setup

### HubSpot Built-in Analytics

1. Go to **Analytics** → **Traffic Analytics**

**Available Metrics:**
- Page views
- Sessions
- New vs. returning visitors
- Traffic sources
- Top pages
- Device breakdown
- Geographic data

### Connect Google Analytics (Optional)

1. Go to **Settings** → **Tracking & Analytics** → **Tracking Code**
2. Paste Google Analytics 4 tracking code:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Save changes

### Track Blog Performance

1. Go to **Marketing** → **Website** → **Blog**
2. Click on any post → **Analyze** tab

**Metrics Available:**
- Total views
- Unique views
- Average time on page
- Bounce rate
- Traffic sources
- CTA clicks
- Form submissions (if applicable)

### Create Custom Reports

1. Go to **Reports** → **Analytics Tools** → **Custom report**
2. Create report for:
   - Blog performance by category
   - Top performing content
   - Traffic sources breakdown
   - Content engagement metrics

---

## 10. Content Management Workflow

### Daily Workflow in HubSpot

#### Morning:
1. Check **Dashboard** for overnight traffic
2. Review **Analytics** → Top performing posts
3. Check scheduled content in **Calendar**

#### Creating Content:
1. Go to **Blog** → **Create blog post**
2. Write content in editor
3. Add featured image
4. Optimize SEO (aim for 80+ score)
5. Preview on desktop/mobile
6. Schedule or publish

#### Managing Content:
1. Go to **Blog** → **Blog posts**
2. Filter by status:
   - **Published**: Live posts
   - **Draft**: Work in progress
   - **Scheduled**: Future posts
3. Use bulk actions:
   - Update tags
   - Change categories
   - Update authors

---

## 11. HubSpot CMS vs. Firebase Solution

### Comparison

| Feature | HubSpot CMS | Your Firebase Dashboard |
|---------|-------------|------------------------|
| **Cost** | $0-$23/month | Free |
| **Hosting** | Included | Need separate hosting |
| **SSL** | Automatic | Need to configure |
| **Content Editor** | Drag-and-drop WYSIWYG | Custom HTML editor |
| **SEO Tools** | Built-in with scoring | Manual implementation |
| **Analytics** | Built-in dashboard | Need Google Analytics |
| **Scheduling** | Native support | Custom code required |
| **Content Staging** | Pro plan ($360/mo) | Not implemented |
| **A/B Testing** | Pro plan | Not available |
| **Learning Curve** | Medium | Low (if you know HTML) |
| **Customization** | Limited to templates | Full control |
| **Backup** | Automatic | Manual via Firebase |
| **Support** | Email/Chat support | Self-supported |

### When to Use HubSpot:

✅ You want all-in-one solution
✅ Need professional SEO tools
✅ Want built-in analytics
✅ Plan to use HubSpot CRM/Marketing features
✅ Willing to pay $23+/month
✅ Need customer support

### When to Use Your Firebase Dashboard:

✅ Want complete customization
✅ Prefer free solution
✅ Comfortable with code
✅ Already have hosting
✅ Don't need HubSpot ecosystem
✅ Want full data ownership

---

## 12. Step-by-Step: Your First Blog Post in HubSpot

### Practical Example: Creating "Getting Started with n8n for Marketers"

1. **Navigate to Blog**
   - Marketing → Website → Blog → Create blog post

2. **Choose Template**
   - Select your blog post template
   - Or use default template

3. **Write Content**
   - **Title**: "Getting Started with n8n for Marketers"
   - **URL slug**: `getting-started-n8n-marketers`
   - **Post body**:
     ```markdown
     ## Introduction

     Marketing automation doesn't have to be complicated...

     ## What is n8n?

     n8n is a powerful workflow automation tool...

     ## Getting Started

     ### Step 1: Install n8n
     ...
     ```

4. **Add Featured Image**
   - Click "Featured image"
   - Upload image (1200x675px recommended)
   - Add alt text: "n8n workflow automation interface"

5. **Configure Settings**
   - **Category**: Tutorials
   - **Tags**: automation, n8n, beginner, workflow
   - **Author**: Your name
   - **Meta description**: "Learn how to build your first marketing automation workflow with n8n in just 15 minutes. No coding required."
   - **Read time**: 15 minutes

6. **Optimize for SEO**
   - Check SEO score (aim for 80+)
   - Ensure:
     - Title 50-60 chars
     - Meta desc 140-160 chars
     - At least 1 H2 heading
     - Images have alt text
     - 300+ words content

7. **Preview**
   - Click "Preview" button
   - Check desktop view
   - Check mobile view
   - Share preview link if needed

8. **Publish or Schedule**
   - Choose "Publish now" or "Schedule"
   - If scheduling, set date/time
   - Click **Publish**

9. **Promote**
   - HubSpot can auto-share to social media
   - Send email to subscribers
   - Add to content calendar

---

## 13. Advanced HubSpot Features

### Content Staging (Professional Plan)

**What it does:** Test redesigns before going live

1. Go to **Settings** → **Website** → **Pages** → **Content Staging**
2. Click **Start content staging**
3. Create staging version of pages
4. Preview at: `yourdomain.com?stage=true`
5. When ready, publish to production

### A/B Testing (Professional Plan)

**Test variations to improve performance**

1. Create blog post
2. Click **Test** → **Create A/B test**
3. Create variation B:
   - Different title
   - Different featured image
   - Different CTA
4. Set test duration (1-4 weeks)
5. HubSpot declares winner automatically

### Smart Content (Professional Plan)

**Personalize content based on visitor**

```html
{% smart_content list_membership %}
  {% module_attribute "html" is_list_membership="Marketing Subscribers" %}
    <h2>Welcome back, marketer!</h2>
  {% module_attribute "html" is_list_membership="Default" %}
    <h2>Welcome to Stupid Humans Tech</h2>
{% end_smart_content %}
```

---

## 14. Cost Breakdown

### Scenario: Your Blog with HubSpot

**Year 1 Costs:**

| Item | Cost | Notes |
|------|------|-------|
| HubSpot Starter | $276/year | $23/month × 12 |
| Domain | $15/year | If buying new |
| **Total** | **$291/year** | **$24.25/month** |

**Included:**
- Unlimited blog posts
- SSL certificate
- CDN hosting
- SEO tools
- Analytics
- Email support

**vs. Firebase Solution:**

| Item | Cost |
|------|------|
| Firebase (Free tier) | $0 |
| Hosting (GitHub Pages) | $0 |
| Domain | $15/year |
| **Total** | **$15/year** |

**Difference:** HubSpot costs $276/year more, but includes professional tools and support

---

## 15. Migration Checklist

### Before You Start:

- [ ] Backup all current files
- [ ] Export any existing content
- [ ] List all pages to migrate
- [ ] Screenshot current design
- [ ] Note all URLs (for redirects)

### During Migration:

- [ ] Create HubSpot account
- [ ] Upload assets to Files
- [ ] Create homepage
- [ ] Set up blog
- [ ] Set up news section
- [ ] Create templates
- [ ] Import first 3-5 posts
- [ ] Configure SEO settings
- [ ] Set up analytics
- [ ] Test all links
- [ ] Preview on mobile

### After Migration:

- [ ] Set up 301 redirects (old URLs → new URLs)
- [ ] Submit sitemap to Google
- [ ] Update social media links
- [ ] Update email signatures
- [ ] Monitor analytics for issues
- [ ] Create content calendar

---

## 16. Recommended Next Steps

### Week 1: Setup
1. Create HubSpot account (Free)
2. Connect domain
3. Create homepage
4. Set up blog

### Week 2: Migration
1. Upload 5 existing blog posts
2. Create templates
3. Configure SEO
4. Set up analytics

### Week 3: Testing
1. Publish test content
2. Check mobile responsiveness
3. Test all links
4. Verify analytics tracking

### Week 4: Launch
1. Publish remaining content
2. Set up 301 redirects
3. Submit to search engines
4. Announce launch

---

## 17. Support Resources

### HubSpot Resources:

- **HubSpot Academy**: [academy.hubspot.com](https://academy.hubspot.com) - Free courses
- **Documentation**: [developers.hubspot.com](https://developers.hubspot.com)
- **Community**: [community.hubspot.com](https://community.hubspot.com)
- **Support**: Available in-app (chat)

### Recommended Courses:

1. "Content Marketing Certification" - Free
2. "HubSpot CMS for Marketers" - Free
3. "SEO Training Course" - Free
4. "Website Planning" - Free

### Templates:

- **HubSpot Marketplace**: [marketplace.hubspot.com](https://marketplace.hubspot.com)
- Free and paid themes available
- Pre-built modules for common layouts

---

## 18. FAQs

**Q: Can I use HubSpot for free forever?**
A: Yes, but limited to 25 pages. For a blog, you'll need Starter ($23/mo) for unlimited posts.

**Q: Can I export my content if I leave HubSpot?**
A: Yes, export as HTML or via API. Always maintain backups.

**Q: How long does migration take?**
A: 1-4 weeks depending on site size. Your site: ~2 weeks for full migration.

**Q: Will my SEO be affected?**
A: Not if you set up 301 redirects properly. HubSpot handles most SEO automatically.

**Q: Can I still use Firebase?**
A: Yes! You can use HubSpot for public site and Firebase dashboard for backend management.

**Q: Do I need coding skills?**
A: No for basic blog. Yes for custom templates (HTML/CSS/HubL).

---

## 19. Hybrid Approach (Recommended)

### Best of Both Worlds:

**Use HubSpot for:**
- Public-facing website
- Blog posts
- News articles
- SEO and analytics

**Keep Your Firebase Dashboard for:**
- Admin content management
- Draft creation (then copy to HubSpot)
- Content planning
- Internal tracking

### Workflow:

1. Draft content in your Firebase dashboard
2. When ready to publish, copy to HubSpot
3. Use HubSpot's SEO tools to optimize
4. Publish through HubSpot
5. Track performance in HubSpot analytics

**Benefits:**
- Professional public presence (HubSpot)
- Custom backend tools (Firebase)
- Best of both platforms

---

## Conclusion

HubSpot CMS is a powerful, professional platform perfect for content-heavy sites like Stupid Humans Tech. While it costs money ($23+/month), you get:

- Professional content management
- Built-in SEO tools
- Analytics dashboard
- SSL and hosting
- Customer support
- No coding required

Your Firebase solution is free and customizable, but requires more technical work.

**My Recommendation:**
- Start with **HubSpot Free** to test
- Keep your Firebase dashboard as backup
- Upgrade to Starter ($23/mo) when you exceed 25 pages
- Use hybrid approach: HubSpot for public + Firebase for backend

Ready to get started? Create your free HubSpot account at [hubspot.com](https://www.hubspot.com) and follow this guide!

---

**Questions?** Feel free to ask for clarification on any step!
