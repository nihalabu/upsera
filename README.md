# UPSERA Landing Page

Production-grade, SEO-engineered landing page built with Next.js Pages Router.

## Stack
- Next.js 14 (Pages Router)
- Tailwind CSS 3.4
- Firebase Admin SDK
- JavaScript (ES6+)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## SEO Features
- Server-Side Rendering (SSR) via `getServerSideProps`
- All content visible in View Source
- Open Graph & Twitter Card meta tags
- Semantic HTML structure
- Schema.org structured data

## Project Structure
```
├── components/
│   ├── Header.js       # Navigation with mobile menu
│   ├── Footer.js       # Footer with links
│   └── LeadForm.js     # Lead capture form
├── lib/
│   └── firebaseAdmin.js # Firebase Admin SDK (server-only)
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js        # Main landing page (SSR)
│   └── api/
│       └── leads.js    # Lead submission API
├── public/
│   └── logo.png
└── styles/
    └── globals.css
```

## Firebase Setup

1. Create a Firebase project
2. Generate a service account key
3. Add credentials to `.env.local`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

## Email/Contact Form Setup (Resend)

The contact form uses [Resend](https://resend.com) to send emails. Here's how to set it up:

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com) and sign up (free tier: 3,000 emails/month)
2. Navigate to **API Keys** → **Create API Key**
3. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```env
# Your Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your email (where you'll receive contact form submissions)
CONTACT_EMAIL=your-email@example.com

# Sender email (default works for testing)
FROM_EMAIL=onboarding@resend.dev
```

### 3. (Optional) Add Custom Domain
For production, add your domain in Resend to:
- Use branded sender addresses (hello@yourdomain.com)
- Improve email deliverability
- Remove Resend branding

### How It Works
1. User submits contact form
2. Form calls `/api/contact` endpoint
3. API sends styled email notification to you
4. Optional: Auto-reply sent to user

The email includes:
- ✨ Beautiful HTML template
- 📧 Quick reply button
- 📱 Mobile-responsive design
