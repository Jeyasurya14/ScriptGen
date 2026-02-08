# Razorpay – Complete Website Data for ScriptGen

Use this document when adding or updating **https://scriptgen.learn-made.in** in your Razorpay dashboard (Settings → Websites/Apps). All values below match the live website and app.

---

## 1. Website & Domain

| Field | Value |
|-------|--------|
| **Primary URL** | `https://scriptgen.learn-made.in` |
| **Protocol** | HTTPS only |
| **Base URL (env)** | Set `NEXTAUTH_URL=https://scriptgen.learn-made.in` in production |

---

## 2. Brand & Product

| Field | Value |
|-------|--------|
| **Product / Business name** | ScriptGen |
| **Short name** | ScriptGen |
| **Full title** | ScriptGen \| YouTube Script Generator – AI Scripts in Minutes |
| **Tagline** | Generate high-converting YouTube scripts with AI in minutes. English, Tamil, Thanglish, Hindi. SEO, chapters, B-roll, shorts. 50 free tokens. Start free. |
| **One-line (meta)** | Free AI script generator for YouTube. Create professional scripts in English, Tamil, Thanglish, Hindi with SEO optimization, chapters, B-roll suggestions. Start with 50 free tokens. |
| **Application name** | ScriptGen |
| **Manifest name** | ScriptGen – YouTube Script Generator |
| **Manifest short_name** | ScriptGen |
| **Manifest description** | Generate high-converting YouTube scripts with AI. English, Tamil, Thanglish, Hindi. SEO, chapters, B-roll, shorts. |
| **Categories** | Productivity, Business |
| **Theme color** | #2563eb |
| **Locale** | en_IN |

---

## 3. Business Model (for Razorpay)

| Field | Value |
|-------|--------|
| **Business type** | Software as a Service (SaaS) |
| **Vertical** | Software / Technology / Productivity |
| **What you sell** | Digital token packs for AI script generation. No physical goods. |
| **Pricing model** | One-time purchase of token packs (INR). |
| **Payment processor** | Razorpay (PCI DSS compliant; card details not stored). |
| **Refund policy** | No refunds (digital goods, immediate consumption). See Refund Policy on site. |

**Detailed description for Razorpay:**  
ScriptGen is a SaaS product that helps creators generate high-converting YouTube scripts with AI. It supports English, Tamil, Thanglish, and Hindi, and includes SEO optimization, chapters, B-roll suggestions, and Shorts extraction. Users get 50 free tokens on signup and can buy token packs (100–1500 tokens) for more generations. All sales are digital; no physical goods.

---

## 4. Product / Pricing (shown on website)

| Package | Tokens | Price (INR) |
|---------|--------|------------|
| Starter | 100 | ₹99 |
| Plus | 200 | ₹179 |
| Growth | 300 | ₹249 |
| Pro | 500 | ₹399 |
| Scale | 1,000 | ₹699 |
| Enterprise | 1,500 | ₹999 |

- **Free tier:** 50 free tokens on signup (no card required).
- **Token usage:** Core script 10 tokens; SEO pack, image prompts, chapters, B-roll, Shorts 10 tokens each when selected.

---

## 5. Main Pages & URLs

| Page | URL |
|------|-----|
| Home | `https://scriptgen.learn-made.in/` |
| App (script generator) | `https://scriptgen.learn-made.in/app` |
| Free script generator | `https://scriptgen.learn-made.in/free-script-generator` |
| AI script writer | `https://scriptgen.learn-made.in/ai-script-writer` |
| Blog | `https://scriptgen.learn-made.in/blog` |
| Privacy Policy | `https://scriptgen.learn-made.in/privacy-policy` |
| Terms & Conditions | `https://scriptgen.learn-made.in/terms-conditions` |
| Refund Policy | `https://scriptgen.learn-made.in/refund-policy` |

---

## 6. Legal Pages Summary

- **Privacy Policy** – Data collection, Google OAuth, Razorpay payments (no card storage), usage data. Last updated: February 2025.
- **Terms & Conditions** – Agreement to terms, IP, user obligations, token-based usage, prohibited use. Last updated: February 2025.
- **Refund Policy** – Strict no-refund policy for digital token purchases. Last updated: February 2025.

All legal pages clearly state the product name as **ScriptGen** and the service as AI-powered script generation with token-based usage.

---

## 7. Keywords (for reference)

script generator, AI script generator, YouTube script generator, AI script writer, video script generator free, free script generator, AI YouTube script generator, video script maker, content script generator, script writing software, automated script generator, Tamil script generator, Hindi script generator, multilingual script generator, YouTube SEO tools, video content creator.

---

## 8. Razorpay Integration (in code)

| Item | Value |
|------|--------|
| **Checkout display name** | ScriptGen (or `RAZORPAY_BUSINESS_NAME` if set) |
| **Order notes** | email, tokens, packageId, businessName, website, businessType: "SaaS" |
| **Currency** | INR |
| **Receipt format** | `receipt_<timestamp>` |

Ensure the business name and model in Razorpay dashboard match the above so approval and reconciliation are consistent.

---

## 9. Consistency with Your Existing Razorpay Account

- Use the **same legal business name** and **business model** as your other two accepted websites.
- **Customer-facing name** for this site: **ScriptGen**.
- Keep business type/vertical aligned (e.g. SaaS / Software).

---

## 10. Checklist Before Submitting to Razorpay

- [ ] Website URL: `https://scriptgen.learn-made.in`
- [ ] Business/Product name: **ScriptGen**
- [ ] Business type: **SaaS** (or as per your account)
- [ ] Description: SaaS, digital tokens, AI script generation, no physical goods
- [ ] Legal pages (Privacy, Terms, Refund) are live and consistent with this document
- [ ] `RAZORPAY_BUSINESS_NAME` in production is set to **ScriptGen** (or omitted to use default)

After updating, save in Razorpay and wait for approval. Your existing keys will work once this website is accepted.
