import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: [
      {
        sub: "Account Information",
        text: "When you register, we collect your name, email address, and password (hashed). If you sign in with Google, we receive your name, email, and profile picture from Google — we never see your Google password.",
      },
      {
        sub: "Usage Data",
        text: "We log the exercises you complete, your scores, streaks, time spent per session, and which features you use. This data is what powers your personalized learning path and the leaderboard.",
      },
      {
        sub: "Content You Submit",
        text: "Text you write in essays, letters, short paragraphs, and other exercises is sent to our AI model to generate feedback. We retain this content to display your history and improve our models, but we never sell it or share it with third parties for marketing.",
      },
      {
        sub: "Device & Technical Data",
        text: "We collect your browser type, operating system, IP address, and general location (country/region) for security, analytics, and to ensure a stable service.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      {
        sub: "Delivering the Service",
        text: "We use your account information to authenticate you, and your usage data to track progress, award XP, and maintain streaks. Your submitted writing is processed by our AI to generate corrections and suggestions.",
      },
      {
        sub: "Improving the Platform",
        text: "Aggregated, anonymised usage patterns help us identify which features work well and which need improvement. We may use anonymised writing samples to fine-tune our AI models.",
      },
      {
        sub: "Communication",
        text: "We send transactional emails (password reset, account verification). We may send product update emails; you can opt out at any time from your profile settings.",
      },
      {
        sub: "Security & Fraud Prevention",
        text: "Technical data helps us detect suspicious activity, enforce rate limits, and keep the platform safe for all users.",
      },
    ],
  },
  {
    title: "Data Sharing",
    content: [
      {
        sub: "We Do Not Sell Your Data",
        text: "We never sell, rent, or trade your personal information to third parties for their own marketing or commercial purposes.",
      },
      {
        sub: "Service Providers",
        text: "We share data with trusted sub-processors who help us run the platform — cloud hosting (servers), email delivery, AI inference (Google Gemini API), and error monitoring. Each is bound by confidentiality agreements.",
      },
      {
        sub: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or to protect the rights, property, or safety of EnglishAI, our users, or the public.",
      },
    ],
  },
  {
    title: "Data Retention",
    content: [
      {
        sub: "Active Accounts",
        text: "We retain your data for as long as your account is active. You can delete your account at any time from Profile → Settings, which will permanently delete all personal data within 30 days.",
      },
      {
        sub: "Anonymised Data",
        text: "We may retain anonymised, aggregated data (not linked to you) indefinitely for research and analytics purposes.",
      },
    ],
  },
  {
    title: "Your Rights",
    content: [
      {
        sub: "Access & Portability",
        text: "You can download a copy of all data we hold about you by going to Profile → Settings → Download My Data.",
      },
      {
        sub: "Correction",
        text: "You can update your name and email at any time from your Profile page.",
      },
      {
        sub: "Deletion",
        text: "You can request full account deletion from Profile → Settings. We will delete all personal data within 30 days of your request.",
      },
      {
        sub: "Objection & Restriction",
        text: "You can contact us at privacy@englishai.app to object to or restrict certain processing activities.",
      },
    ],
  },
  {
    title: "Cookies",
    content: [
      {
        sub: "Essential Cookies",
        text: "We use a session cookie to keep you logged in. This is strictly necessary and cannot be disabled.",
      },
      {
        sub: "Analytics Cookies",
        text: "We use privacy-respecting analytics to understand how users navigate the platform. You can opt out in our Cookie Settings.",
      },
    ],
  },
  {
    title: "Security",
    content: [
      {
        sub: "How We Protect Your Data",
        text: "All data is encrypted in transit (TLS 1.3) and at rest. Passwords are hashed with bcrypt. We perform regular security reviews and penetration tests.",
      },
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      {
        sub: "Age Requirement",
        text: "EnglishAI is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe a child has registered, please contact us immediately and we will delete the account.",
      },
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      {
        sub: "Notification",
        text: "We will notify you of material changes via email or an in-app notice at least 14 days before the change takes effect. Continued use of the platform after that date constitutes acceptance.",
      },
    ],
  },
  {
    title: "Contact",
    content: [
      {
        sub: "Get in Touch",
        text: "For any privacy questions or requests, email us at privacy@englishai.app. We respond within 5 business days.",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-root">
      {/* Navbar */}
      <nav className="legal-nav">
        <div className="legal-nav__inner">
          <button className="legal-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="home-nav__logo" onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <div className="home-nav__logo-icon">
              <BookOpen size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="home-nav__logo-text">EnglishAI</span>
          </button>
        </div>
      </nav>

      <main className="legal-main">
        {/* Header */}
        <div className="legal-header">
          <div className="legal-header__icon">
            <Shield size={28} color="#818CF8" />
          </div>
          <p className="legal-header__eyebrow">Legal</p>
          <h1 className="legal-header__title">Privacy Policy</h1>
          <p className="legal-header__meta">Effective date: 1 August 2026 · Last updated: 11 August 2026</p>
          <p className="legal-header__intro">
            This policy explains what personal information EnglishAI collects, why we collect it,
            how we use it, and what choices you have. We've written it in plain language because
            you deserve to understand it without a law degree.
          </p>
        </div>

        {/* Sections */}
        <div className="legal-body">
          {SECTIONS.map((section, i) => (
            <section key={i} className="legal-section">
              <h2 className="legal-section__title">
                <span className="legal-section__num">{String(i + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              {section.content.map((item, j) => (
                <div key={j} className="legal-item">
                  <h3 className="legal-item__sub">{item.sub}</h3>
                  <p className="legal-item__text">{item.text}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>

      <footer className="legal-footer">
        <div className="legal-footer__inner">
          <span>© {new Date().getFullYear()} EnglishAI. All rights reserved.</span>
          <div className="legal-footer__links">
            <button onClick={() => navigate("/privacy-policy")} className="legal-footer__link active">Privacy Policy</button>
            <button onClick={() => navigate("/terms-of-service")} className="legal-footer__link">Terms of Service</button>
            <button onClick={() => navigate("/cookie-policy")} className="legal-footer__link">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
