import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  PenTool,
  Sparkles,
  Trophy,
  ArrowRight,
  Mic,
  Brain,
  Target,
  Zap,
  Star,
  Users,
  BarChart2,
  CheckCircle,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Play,
  Pause,
  Quote,
} from "lucide-react";

// ─── Marquee data ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  { label: "Reading Comprehension", icon: BookOpen, color: "#6366F1" },
  { label: "Essay Writing", icon: PenTool, color: "#A78BFA" },
  { label: "Grammar Check", icon: CheckCircle, color: "#34D399" },
  { label: "Vocabulary Builder", icon: Brain, color: "#F59E0B" },
  { label: "Tone Analysis", icon: Mic, color: "#EC4899" },
  { label: "AI Feedback", icon: Sparkles, color: "#38BDF8" },
  { label: "Leaderboard", icon: Trophy, color: "#FB923C" },
  { label: "Target Score", icon: Target, color: "#A3E635" },
  { label: "Sentence Formation", icon: Zap, color: "#818CF8" },
  { label: "Letter Writing", icon: Mail, color: "#F472B6" },
];

const MARQUEE_DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    desc: "Get instant, nuanced corrections on grammar, tone, structure — not generic tips, but insight tailored to exactly what you wrote.",
    gradient: "from-indigo-500 to-violet-500",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    icon: BookOpen,
    title: "Adaptive Reading",
    desc: "Passages that adjust to your level. Click any word for definitions in context. Answer comprehension questions graded the moment you submit.",
    gradient: "from-sky-400 to-cyan-500",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    icon: PenTool,
    title: "Guided Composition",
    desc: "Essays, letters, short paragraphs, persuasive writing — every format taught with structural scaffolding and live AI analysis.",
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "rgba(167,139,250,0.25)",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    desc: "Earn XP for every completed task, maintain daily streaks, and climb a global leaderboard that keeps you coming back.",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(251,146,60,0.25)",
  },
  {
    icon: BarChart2,
    title: "Detailed Reports",
    desc: "Track every dimension of your growth over time — vocabulary breadth, grammar accuracy, writing fluency — all in one dashboard.",
    gradient: "from-emerald-400 to-teal-500",
    glow: "rgba(52,211,153,0.25)",
  },
  {
    icon: Zap,
    title: "On-Demand Tests",
    desc: "Spin up a timed test in seconds: comprehension, vocabulary, sentence formation. Great for exam preparation.",
    gradient: "from-rose-400 to-pink-500",
    glow: "rgba(244,114,182,0.25)",
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Active Learners" },
  { value: "2M+", label: "Exercises Completed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "4.9★", label: "Average Rating" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Class 10 Student",
    text: "My essay scores jumped two grades in a month. The AI doesn't just mark it wrong — it tells me exactly why and shows me a better version.",
    avatar: "PS",
    color: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    badge: "+2 Grades Improvement",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "IELTS Candidate",
    text: "The tone analysis feature is what no other platform offers. I finally understand why my writing feels stiff, and how to loosen it up.",
    avatar: "AM",
    color: "linear-gradient(135deg, #10B981, #059669)",
    badge: "IELTS Band 8.5",
    rating: 5,
  },
  {
    name: "Lakshmi R.",
    role: "School Teacher",
    text: "I recommend this to my entire class now. The leaderboard keeps them engaged longer than anything else I've tried.",
    avatar: "LR",
    color: "linear-gradient(135deg, #F59E0B, #D97706)",
    badge: "Teacher Verified",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Software Engineer",
    text: "Drafting executive communications used to take me 30 minutes. Now with Tone Practice, I write crisp, clear reports effortlessly.",
    avatar: "RV",
    color: "linear-gradient(135deg, #EC4899, #DB2777)",
    badge: "Professional Writing",
    rating: 5,
  },
  {
    name: "Ananya Roy",
    role: "TOEFL Aspirant",
    text: "The instant feedback on grammar and contextual definitions inside comprehension passages sped up my preparation immensely!",
    avatar: "AR",
    color: "linear-gradient(135deg, #0EA5E9, #0284C7)",
    badge: "TOEFL 112/120",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "University Researcher",
    text: "The academic sentence formation and essay structure feedback helped me publish my first research paper in English with confidence.",
    avatar: "DC",
    color: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    badge: "Academic Excellence",
    rating: 5,
  },
];

const ROW1_TESTIMONIALS = [...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(0, 3)];
const ROW2_TESTIMONIALS = [...TESTIMONIALS.slice(3, 6), ...TESTIMONIALS.slice(3, 6), ...TESTIMONIALS.slice(3, 6)];

// ─── Component ────────────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [marqueeHovered, setMarqueeHovered] = useState(false);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [testimonialHovered, setTestimonialHovered] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-root">
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className={`home-nav ${scrolled ? "home-nav--scrolled" : ""}`}>
        <div className="home-nav__inner">
          <a
            href="/"
            className="home-nav__logo"
            aria-label="English Tutor AI home"
            onClick={(e) => {
              if (window.scrollY > 80) {
                // User is scrolled down — go to top smoothly, no reload
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              // else: user is already at top — let the default reload happen
            }}
          >
            <div className="home-nav__logo-icon">
              <BookOpen size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="home-nav__logo-text">EnglishAI</span>
          </a>

          <div className="home-nav__links">
            <a href="#features" className="home-nav__link">Features</a>
            <a href="#testimonials" className="home-nav__link">Reviews</a>
            <a href="#cta" className="home-nav__link">Pricing</a>
          </div>

          <div className="home-nav__actions">
            <button className="home-btn home-btn--ghost" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button className="home-btn home-btn--primary" onClick={() => navigate("/register")}>
              Get started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="home-hero" ref={heroRef}>
        <div className="home-hero__orb home-hero__orb--1" />
        <div className="home-hero__orb home-hero__orb--2" />
        <div className="home-hero__orb home-hero__orb--3" />
        <div className="home-hero__grain" />

        <div className="home-hero__content">
          <div className="home-badge">
            <Sparkles size={14} />
            <span>Gemini AI · Real-time feedback</span>
          </div>

          <h1 className="home-hero__headline">
            Write better.<br />
            <span className="home-hero__headline-accent">Score higher.</span><br />
            Every day.
          </h1>

          <p className="home-hero__sub">
            The AI English tutor that reads what you write, spots every flaw, and explains exactly
            how to fix it — in plain language, without judgment.
          </p>

          <div className="home-hero__ctas">
            <button className="home-btn home-btn--hero-primary" onClick={() => navigate("/register")}>
              Start for free <ArrowRight size={18} />
            </button>
            <button className="home-btn home-btn--hero-ghost" onClick={() => navigate("/login")}>
              I have an account
            </button>
          </div>

          <div className="home-trust">
            <span className="home-trust__item"><CheckCircle size={14} /> No credit card</span>
            <span className="home-trust__sep" />
            <span className="home-trust__item"><Users size={14} /> 50,000+ learners</span>
            <span className="home-trust__sep" />
            <span className="home-trust__item"><Star size={14} /> 4.9 rating</span>
          </div>
        </div>

        {/* Hero card mockup */}
        <div className="home-hero__card-wrap">
          <div className="home-hero__card">
            <div className="home-hero__card-bar">
              <span className="home-hero__card-dot" style={{ background: "#FF5F57" }} />
              <span className="home-hero__card-dot" style={{ background: "#FEBC2E" }} />
              <span className="home-hero__card-dot" style={{ background: "#28C840" }} />
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#8B92B3" }}>AI Analysis</span>
            </div>

            <div className="home-hero__writing">
              <p className="home-hero__writing-label">Your writing</p>
              <p className="home-hero__writing-text">
                The experiment was{" "}
                <span className="home-hero__squiggle">very good</span> and the results
                showed that the hypothesis was{" "}
                <span className="home-hero__squiggle">basically right</span>.
              </p>
            </div>

            <div className="home-hero__suggestion">
              <div className="home-hero__suggestion-label">
                <Sparkles size={12} /> AI Suggestion
              </div>
              <p className="home-hero__suggestion-text">
                Replace <strong>"very good"</strong> → <em className="home-hero__highlight">exceptional</em>
                &nbsp;and&nbsp;<strong>"basically right"</strong> → <em className="home-hero__highlight">validated</em>
                &nbsp;for a more precise, academic tone.
              </p>
            </div>

            <div className="home-hero__scores">
              {[
                { label: "Grammar", val: 94 },
                { label: "Vocabulary", val: 81 },
                { label: "Tone", val: 88 },
              ].map(({ label, val }) => (
                <div key={label} className="home-hero__score-item">
                  <div className="home-hero__score-row">
                    <span>{label}</span>
                    <span className="home-hero__score-num">{val}</span>
                  </div>
                  <div className="home-hero__score-bar-bg">
                    <div className="home-hero__score-bar-fill" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="home-hero__card-glow" />
        </div>
      </section>

      {/* ── MARQUEE ────────────────────────────────────────────────── */}
      <section
        className="home-marquee-section"
        onMouseEnter={() => setMarqueeHovered(true)}
        onMouseLeave={() => setMarqueeHovered(false)}
      >
        <div className="home-marquee-section__fade-left" />
        <div className="home-marquee-section__fade-right" />

        <div
          className="home-marquee-track"
          style={{ animationPlayState: marqueeHovered ? "paused" : "running" }}
        >
          {MARQUEE_DOUBLED.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="home-marquee-pill"
                style={{ "--pill-color": item.color } as React.CSSProperties}
              >
                <span className="home-marquee-pill__icon" style={{ color: item.color }}>
                  <Icon size={15} />
                </span>
                {item.label}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="home-features" id="features">
        <div className="home-section-eyebrow">
          <Zap size={14} /> What you get
        </div>
        <h2 className="home-section-title">Every skill. One platform.</h2>
        <p className="home-section-sub">
          We cover the full breadth of English mastery — reading, writing, vocabulary, tone —
          and score every single exercise with AI the moment you finish it.
        </p>

        <div className="home-features__grid">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="home-feature-card" style={{ "--glow": f.glow } as React.CSSProperties}>
                <div className={`home-feature-card__icon bg-gradient-to-br ${f.gradient}`}>
                  <Icon size={22} color="#fff" />
                </div>
                <h3 className="home-feature-card__title">{f.title}</h3>
                <p className="home-feature-card__desc">{f.desc}</p>
                <div className="home-feature-card__arrow">
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="home-stats">
        <div className="home-stats__bg" />
        <div className="home-stats__grid">
          {STATS.map((s, i) => (
            <div key={i} className="home-stat">
              <div className="home-stat__value">{s.value}</div>
              <div className="home-stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS MARQUEE ───────────────────────────────────── */}
      <section className="home-testimonials-section" id="testimonials">
        <div className="home-testimonials__header">
          <div>
            <div className="home-section-eyebrow">
              <Star size={14} /> Real results
            </div>
            <h2 className="home-section-title">Students who made the leap</h2>
            <p className="home-section-sub">
              Hear from learners, test takers, and educators achieving real progress with AI-guided tutoring.
            </p>
          </div>

          <div className="home-testimonials__controls">
            <button
              className="home-testimonials__control-btn"
              onClick={() => setTestimonialPaused(!testimonialPaused)}
              aria-label={testimonialPaused ? "Resume auto scroll" : "Pause auto scroll"}
            >
              {testimonialPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{testimonialPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>
        </div>

        <div
          className="home-testimonials-marquee-wrap"
          onMouseEnter={() => setTestimonialHovered(true)}
          onMouseLeave={() => setTestimonialHovered(false)}
        >
          <div className="home-marquee-section__fade-left" />
          <div className="home-marquee-section__fade-right" />

          {/* Row 1: Leftward infinite scroll */}
          <div
            className="home-testimonials-marquee-track"
            style={{
              animationPlayState: (testimonialPaused || testimonialHovered) ? "paused" : "running"
            }}
          >
            {ROW1_TESTIMONIALS.map((t, i) => (
              <div key={`r1-${i}`} className="home-testimonial-card--marquee">
                <div>
                  <div className="home-testimonial-card__header">
                    <div className="home-testimonial-card__stars">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="home-testimonial-card__badge">{t.badge}</span>
                  </div>
                  <Quote size={20} className="home-testimonial-card__quote-icon" />
                  <p className="home-testimonial-card__text">"{t.text}"</p>
                </div>
                <div className="home-testimonial-card__author">
                  <div className="home-testimonial-card__avatar" style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="home-testimonial-card__name">{t.name}</div>
                    <div className="home-testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Rightward infinite scroll */}
          <div
            className="home-testimonials-marquee-track home-testimonials-marquee-track--reverse"
            style={{
              animationPlayState: (testimonialPaused || testimonialHovered) ? "paused" : "running",
              marginTop: "1.25rem"
            }}
          >
            {ROW2_TESTIMONIALS.map((t, i) => (
              <div key={`r2-${i}`} className="home-testimonial-card--marquee">
                <div>
                  <div className="home-testimonial-card__header">
                    <div className="home-testimonial-card__stars">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="home-testimonial-card__badge">{t.badge}</span>
                  </div>
                  <Quote size={20} className="home-testimonial-card__quote-icon" />
                  <p className="home-testimonial-card__text">"{t.text}"</p>
                </div>
                <div className="home-testimonial-card__author">
                  <div className="home-testimonial-card__avatar" style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="home-testimonial-card__name">{t.name}</div>
                    <div className="home-testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="home-cta" id="cta">
        <div className="home-cta__orb home-cta__orb--1" />
        <div className="home-cta__orb home-cta__orb--2" />
        <div className="home-cta__inner">
          <div className="home-cta__badge">
            <Sparkles size={14} /> Free to start
          </div>
          <h2 className="home-cta__title">Ready to write like you mean it?</h2>
          <p className="home-cta__sub">
            Join 50,000 learners who stopped guessing and started improving.
            No credit card. No commitments.
          </p>
          <div className="home-cta__actions">
            <button className="home-btn home-btn--hero-primary" onClick={() => navigate("/register")}>
              Create free account <ArrowRight size={18} />
            </button>
            <button className="home-btn home-btn--hero-ghost" onClick={() => navigate("/login")}>
              Sign in instead
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <div className="home-nav__logo">
              <div className="home-nav__logo-icon">
                <BookOpen size={16} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="home-nav__logo-text">EnglishAI</span>
            </div>
            <p className="home-footer__tagline">
              Personalized English education, powered by AI.
            </p>
            <div className="home-footer__socials">
              <a href="#" aria-label="Twitter" className="home-footer__social"><Twitter size={16} /></a>
              <a href="#" aria-label="GitHub" className="home-footer__social"><Github size={16} /></a>
              <a href="#" aria-label="LinkedIn" className="home-footer__social"><Linkedin size={16} /></a>
            </div>
          </div>

          <div className="home-footer__col">
            <h4 className="home-footer__col-title">Platform</h4>
            <a href="#features" className="home-footer__link">Features</a>
            <a href="#" className="home-footer__link">For Schools</a>
            <a href="#" className="home-footer__link">Pricing</a>
            <a href="#" className="home-footer__link">Roadmap</a>
          </div>

          <div className="home-footer__col">
            <h4 className="home-footer__col-title">Account</h4>
            <button onClick={() => navigate("/register")} className="home-footer__link">Sign up</button>
            <button onClick={() => navigate("/login")} className="home-footer__link">Sign in</button>
            <a href="#" className="home-footer__link">Dashboard</a>
            <a href="#" className="home-footer__link">Profile</a>
          </div>

          <div className="home-footer__col">
            <h4 className="home-footer__col-title">Legal</h4>
            <button onClick={() => navigate("/privacy-policy")} className="home-footer__link">Privacy Policy</button>
            <button onClick={() => navigate("/terms-of-service")} className="home-footer__link">Terms of Service</button>
            <button onClick={() => navigate("/cookie-policy")} className="home-footer__link">Cookie Policy</button>
          </div>
        </div>

        <div className="home-footer__bottom">
          <span>© {new Date().getFullYear()} EnglishAI. All rights reserved.</span>
          <span>Made with ♥ for learners everywhere</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
