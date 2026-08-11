import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, ScrollText } from "lucide-react";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: [
      {
        sub: "Agreement",
        text: "By creating an account or using EnglishAI in any way, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These Terms form a legally binding agreement between you and EnglishAI.",
      },
      {
        sub: "Updates",
        text: "We may update these Terms from time to time. We'll notify you of significant changes via email or in-app notice. Continued use after the effective date of a change means you accept the updated Terms.",
      },
    ],
  },
  {
    title: "Your Account",
    content: [
      {
        sub: "Eligibility",
        text: "You must be at least 13 years old to use EnglishAI. By registering, you confirm that you meet this requirement.",
      },
      {
        sub: "Account Security",
        text: "You are responsible for keeping your password secure and for all activity that occurs under your account. Notify us immediately at support@englishai.app if you suspect unauthorized access.",
      },
      {
        sub: "Accurate Information",
        text: "You agree to provide accurate information when registering and to keep it up to date. Accounts with false information may be suspended.",
      },
      {
        sub: "One Account Per Person",
        text: "Each person may maintain only one active account. Creating multiple accounts to circumvent restrictions (such as free tier limits) is not permitted.",
      },
    ],
  },
  {
    title: "Permitted Use",
    content: [
      {
        sub: "Personal, Educational Use",
        text: "EnglishAI is licensed to you for personal, non-commercial, educational use. You may use the platform to practice and improve your English language skills.",
      },
      {
        sub: "No Automation",
        text: "You may not scrape, crawl, or automate interactions with the platform using bots, scripts, or other automated means without our prior written consent.",
      },
      {
        sub: "No Reverse Engineering",
        text: "You may not decompile, reverse-engineer, or attempt to extract the source code of EnglishAI's software or AI models.",
      },
      {
        sub: "Fair Use of AI Features",
        text: "AI feedback features are provided for genuine learning. You may not use them to generate content for submission in academic or professional settings where such AI assistance is prohibited.",
      },
    ],
  },
  {
    title: "Prohibited Conduct",
    content: [
      {
        sub: "What You Must Not Do",
        text: "You agree not to: upload content that is illegal, harmful, defamatory, or infringes third-party intellectual property; attempt to gain unauthorized access to other users' accounts or our systems; use the platform to harass, threaten, or harm others; distribute malware or engage in phishing; impersonate EnglishAI or its staff; manipulate leaderboard rankings through dishonest means (e.g. using automation to inflate scores).",
      },
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      {
        sub: "Our Content",
        text: "All exercises, passages, prompts, AI models, software, trademarks, and other content on EnglishAI are owned by or licensed to us and protected by applicable intellectual property laws. You may not reproduce or distribute them without our written permission.",
      },
      {
        sub: "Your Content",
        text: "You retain ownership of the text you write on the platform. By submitting it, you grant us a non-exclusive, worldwide, royalty-free licence to process, store, and use it to deliver the service and improve our AI models (in anonymised form). We do not claim ownership of your writing.",
      },
    ],
  },
  {
    title: "Free & Paid Tiers",
    content: [
      {
        sub: "Free Tier",
        text: "The free tier provides access to a defined set of features with usage limits as described on our Pricing page. We reserve the right to modify free tier limits at any time with reasonable notice.",
      },
      {
        sub: "Paid Subscriptions",
        text: "Paid plans are billed in advance on a monthly or annual basis. Payments are non-refundable except where required by applicable law. You can cancel any time; your access continues until the end of the paid period.",
      },
      {
        sub: "Price Changes",
        text: "We will give at least 30 days' notice before increasing subscription prices for existing subscribers.",
      },
    ],
  },
  {
    title: "Disclaimers",
    content: [
      {
        sub: "No Guarantee of Results",
        text: "EnglishAI provides tools to support your learning; we cannot guarantee specific improvements in your English skills, exam scores, or other outcomes.",
      },
      {
        sub: "Service Availability",
        text: "We strive for high availability but do not guarantee that the platform will be available without interruption. Scheduled maintenance, technical issues, or external factors may cause downtime.",
      },
      {
        sub: "AI Feedback Accuracy",
        text: "AI-generated feedback is intended as a helpful guide, not a definitive authority. It may occasionally contain errors. Always exercise your own judgement.",
      },
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      {
        sub: "Scope",
        text: "To the fullest extent permitted by law, EnglishAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform. Our total liability for any claim arising out of these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.",
      },
    ],
  },
  {
    title: "Termination",
    content: [
      {
        sub: "By You",
        text: "You may close your account at any time from Profile → Settings. Termination does not entitle you to a refund of any prepaid fees.",
      },
      {
        sub: "By Us",
        text: "We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or pose a risk to other users or the platform. We will try to notify you in advance unless the breach is severe.",
      },
    ],
  },
  {
    title: "Governing Law",
    content: [
      {
        sub: "Jurisdiction",
        text: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.",
      },
    ],
  },
  {
    title: "Contact",
    content: [
      {
        sub: "Questions",
        text: "For questions about these Terms, email legal@englishai.app. We respond within 5 business days.",
      },
    ],
  },
];

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-root">
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
        <div className="legal-header">
          <div className="legal-header__icon">
            <ScrollText size={28} color="#818CF8" />
          </div>
          <p className="legal-header__eyebrow">Legal</p>
          <h1 className="legal-header__title">Terms of Service</h1>
          <p className="legal-header__meta">Effective date: 1 August 2026 · Last updated: 11 August 2026</p>
          <p className="legal-header__intro">
            These Terms govern your use of the EnglishAI platform. Please read them carefully.
            We've kept them as clear and readable as possible — if something is unclear, reach out.
          </p>
        </div>

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
            <button onClick={() => navigate("/privacy-policy")} className="legal-footer__link">Privacy Policy</button>
            <button onClick={() => navigate("/terms-of-service")} className="legal-footer__link active">Terms of Service</button>
            <button onClick={() => navigate("/cookie-policy")} className="legal-footer__link">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
