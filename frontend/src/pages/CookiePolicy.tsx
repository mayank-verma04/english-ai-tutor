import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Cookie } from "lucide-react";

const COOKIE_TYPES = [
  {
    name: "Strictly Necessary",
    canDisable: false,
    badge: "Always Active",
    badgeColor: "#34D399",
    items: [
      { cookie: "session_id", purpose: "Keeps you logged in between page visits.", duration: "Session (cleared on browser close or 30-day timeout)" },
      { cookie: "csrf_token", purpose: "Protects against cross-site request forgery attacks.", duration: "Session" },
    ],
  },
  {
    name: "Functional",
    canDisable: true,
    badge: "Optional",
    badgeColor: "#818CF8",
    items: [
      { cookie: "theme_pref", purpose: "Remembers your light/dark mode preference.", duration: "1 year" },
      { cookie: "lang_pref", purpose: "Stores your selected interface language.", duration: "1 year" },
    ],
  },
  {
    name: "Analytics",
    canDisable: true,
    badge: "Optional",
    badgeColor: "#818CF8",
    items: [
      { cookie: "_ea_session", purpose: "Anonymised session tracking for product analytics. No personally identifiable data is collected.", duration: "30 minutes (renews on activity)" },
      { cookie: "_ea_user", purpose: "Anonymised user identifier to track returning visitors (no name or email attached).", duration: "2 years" },
    ],
  },
];

const SECTIONS = [
  {
    title: "What Are Cookies?",
    text: "Cookies are small text files that a website stores on your device when you visit. They help the site remember information about your visit — like whether you're logged in, your preferences, or how you navigate. Cookies are widely used and essential to how most modern websites function.",
  },
  {
    title: "How We Use Cookies",
    text: "EnglishAI uses cookies to authenticate you (keep you logged in), remember your preferences (such as dark mode), and collect anonymised analytics so we can understand how the platform is used and where to improve it. We do not use cookies for advertising or to track you across other websites.",
  },
  {
    title: "Third-Party Cookies",
    text: "If you sign in with Google, Google may set its own cookies on your device as part of the OAuth authentication flow. These are governed by Google's Privacy Policy, not ours. Our analytics provider may also set cookies; we have configured it to anonymise all data and respect Do Not Track signals.",
  },
  {
    title: "Managing Your Cookies",
    text: "You can control cookies through your browser settings — most browsers let you view, delete, and block cookies. Note that disabling strictly necessary cookies will prevent you from logging in. You can also manage optional cookies through our Cookie Settings panel, accessible from the footer of any page.",
  },
  {
    title: "Do Not Track",
    text: "If your browser sends a Do Not Track (DNT) signal, we honour it by disabling all non-essential analytics cookies for your session.",
  },
  {
    title: "Changes to This Policy",
    text: "We may update this Cookie Policy when we add or remove cookies. Significant changes will be communicated via an in-app notice. The 'Last updated' date above always reflects the most recent revision.",
  },
  {
    title: "Contact",
    text: "Questions about our use of cookies? Email privacy@englishai.app — we respond within 5 business days.",
  },
];

const CookiePolicy = () => {
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
            <Cookie size={28} color="#818CF8" />
          </div>
          <p className="legal-header__eyebrow">Legal</p>
          <h1 className="legal-header__title">Cookie Policy</h1>
          <p className="legal-header__meta">Effective date: 1 August 2026 · Last updated: 11 August 2026</p>
          <p className="legal-header__intro">
            This policy explains which cookies EnglishAI sets, what each one does, and how
            you can control them. We keep it specific — no vague "we may use cookies" language.
          </p>
        </div>

        <div className="legal-body">
          {/* Prose sections */}
          {SECTIONS.slice(0, 2).map((s, i) => (
            <section key={i} className="legal-section">
              <h2 className="legal-section__title">
                <span className="legal-section__num">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <p className="legal-item__text" style={{ marginTop: 0 }}>{s.text}</p>
            </section>
          ))}

          {/* Cookie table section */}
          <section className="legal-section">
            <h2 className="legal-section__title">
              <span className="legal-section__num">03</span>
              Cookies We Set
            </h2>
            <div className="legal-cookie-groups">
              {COOKIE_TYPES.map((group, gi) => (
                <div key={gi} className="legal-cookie-group">
                  <div className="legal-cookie-group__header">
                    <span className="legal-cookie-group__name">{group.name}</span>
                    <span className="legal-cookie-badge" style={{ color: group.badgeColor, borderColor: group.badgeColor + "44", background: group.badgeColor + "18" }}>
                      {group.badge}
                    </span>
                  </div>
                  <table className="legal-cookie-table">
                    <thead>
                      <tr>
                        <th>Cookie</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item, ii) => (
                        <tr key={ii}>
                          <td><code className="legal-code">{item.cookie}</code></td>
                          <td>{item.purpose}</td>
                          <td>{item.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          {/* Remaining prose sections */}
          {SECTIONS.slice(2).map((s, i) => (
            <section key={i + 2} className="legal-section">
              <h2 className="legal-section__title">
                <span className="legal-section__num">{String(i + 4).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <p className="legal-item__text" style={{ marginTop: 0 }}>{s.text}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="legal-footer">
        <div className="legal-footer__inner">
          <span>© {new Date().getFullYear()} EnglishAI. All rights reserved.</span>
          <div className="legal-footer__links">
            <button onClick={() => navigate("/privacy-policy")} className="legal-footer__link">Privacy Policy</button>
            <button onClick={() => navigate("/terms-of-service")} className="legal-footer__link">Terms of Service</button>
            <button onClick={() => navigate("/cookie-policy")} className="legal-footer__link active">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CookiePolicy;
