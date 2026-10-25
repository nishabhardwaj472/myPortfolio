import { createFileRoute } from "@tanstack/react-router";
import useGitHubRepos from "@/hooks/useGitHubRepos";
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import spaceBackground from "@/assets/cinematic-space-bg.jpg";

const navigation = [
  ["HOME", "home"],
  ["ABOUT", "about"],
  ["PROJECTS", "projects"],
  ["EXPERIENCE", "experience"],
  ["ACHIEVEMENTS", "achievements"],
  ["CONTACT", "contact"],
] as const;

const projects = [
  {
    number: "01",
    id: "synapsefi",
    title: "SynapseFI",
    subtitle: "AI-Powered Fintech Platform",
    category: "AI · FINTECH INFRASTRUCTURE",
    description:
      "A full-stack SaaS platform helping startups discover, integrate, and manage financial APIs through an AI-powered recommendation engine.",
    highlights: ["Gemini AI recommendations", "API marketplace & subscriptions", "Analytics and transaction monitoring", "API key lifecycle management"],
    technologies: "React.js · TypeScript · Node.js · Express.js · MongoDB · Gemini AI · REST APIs · Tailwind CSS",
    style: "project-fintech",
    mark: "S",
  },
  {
    number: "02",
    id: "medislot",
    title: "MediSlot",
    subtitle: "Hospital Management Platform",
    category: "HEALTHCARE · RESOURCE MANAGEMENT",
    description:
      "A hospital management platform connecting patients, doctors, and administrators with timely appointment and resource visibility.",
    highlights: ["Doctor availability and appointment tracking", "Medicine, bed, and oxygen resources", "Threshold-based low-resource alerts"],
    technologies: "React.js · Node.js · Express.js · MongoDB · JWT · REST APIs · Vite",
    style: "project-health",
    mark: "+",
  },
  {
    number: "03",
    id: "medichain",
    title: "MediChain",
    subtitle: "Blockchain Healthcare Platform",
    category: "BLOCKCHAIN · HEALTHCARE ACCESS",
    description:
      "A hackathon prototype exploring secure medical-record access and privacy-focused healthcare data sharing through blockchain.",
    highlights: ["Secure medical record access", "Transparent, immutable record history", "Privacy-focused information sharing", "Hackathon prototype development"],
    technologies: "React.js · Node.js · Express.js · MongoDB · Blockchain · Web3",
    style: "project-chain",
    mark: "⌘",
  },
  {
    number: "04",
    id: "codepilot",
    title: "CodePilot",
    subtitle: "AI Code Assistant",
    category: "AI · PRODUCTIVITY",
    description: "An AI-powered tool to help developers write, understand, and refactor code faster.",
    highlights: ["Code suggestions", "Documentation generation", "Error detection"],
    technologies: "React.js · TypeScript · OpenAI API",
    style: "project-web",
    mark: "C",
  },
  {
    number: "05",
    id: "koru_pa",
    title: "Koru_PA",
    subtitle: "Personal Assistant for Wellness",
    category: "HEALTH & WELLNESS",
    description: "A personal assistant platform that helps users maintain mental and physical health.",
    highlights: ["Mood tracking", "Habit formation", "AI coaching"],
    technologies: "React.js · Node.js · MongoDB",
    style: "project-web",
    mark: "K",
  },
  {
    number: "06",
    id: "hirex",
    title: "HireX",
    subtitle: "Next‑gen Recruitment Platform",
    category: "HR · RECRUITMENT",
    description: "A platform that matches candidates with jobs using AI-driven recommendations.",
    highlights: ["Resume parsing", "Smart matching", "Interview scheduling"],
    technologies: "React.js · Node.js · PostgreSQL",
    style: "project-web",
    mark: "H",
  },
];

const skillGroups = [
  { label: "FRONTEND", items: ["React.js", "JavaScript", "TypeScript"] },
  { label: "BACKEND", items: ["Node.js", "Express.js", ".NET Framework", "REST APIs"] },
  { label: "PROGRAMMING & DATA", items: ["Python", "C++", "C", "SQL", "Data Structures & Algorithms"] },
  { label: "DATABASES", items: ["MongoDB", "SQL"] },
  { label: "TOOLS & AI", items: ["Git", "GitHub", "VS Code", "Postman", "Chart.js", "Gemini AI", "Cloudinary"] },
];

const experiences = [
  { role: "Junior Developer", place: "SPG Technologies (Salesnayak)", detail: "Business application development using the .NET Framework, with debugging, maintenance, and feature implementation." },
  { role: "Web Development Intern · Remote", place: "Agelix Consulting Pvt. Ltd.", detail: "Built and maintained responsive full-stack web applications using React.js, integrated REST APIs, and collaborated with a development team." },
  { role: "Industrial Training · Six weeks", place: "NIELIT", detail: "Completed industrial training in Python, learning programming fundamentals, problem-solving, and data handling." },
  { role: "Vocational Training", place: "BPO Services", detail: "Exposure to networking fundamentals, enterprise systems, IT infrastructure, and service workflows." },
];

const achievements = [
  "Cognizant Technoverse Hackathon 2026 · Participant",
  "Smart India Hackathon 2025 · Qualified for internal round",
  "National Kalam STEM Conclave 2025 · Participant",
];

const leadership = [
  "Placement Coordinator · Training & Placement Cell, MSIT",
  "Operational Lead · DSA Department, GDG MSIT",
  "Student Coordinator · Smart Bihar Hackathon",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nisha Bharti — Full-Stack Developer" },
      { name: "description", content: "Nisha Bharti is a full-stack developer exploring AI-powered products, fintech infrastructure, and meaningful web experiences." },
      { property: "og:title", content: "Nisha Bharti — Full-Stack Developer" },
      { property: "og:description", content: "Building full-stack applications, exploring AI, and creating useful digital experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
  // Adding GitHub projects fetch hook
  loader: async () => ({})
});

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  // Fetch GitHub repositories
  const { repositories: githubProjects, loading: githubLoading, error: githubError } = useGitHubRepos();

const liveUrls: Record<string, string> = {
  synapsefi: 'https://synapsefi.vercel.app',
  medislot: 'https://medislot.vercel.app',
  medichain: 'https://medichain.vercel.app',
  codepilot: 'https://codepilot.vercel.app',
  koru_pa: 'https://koru-pa.vercel.app',
  hirex: 'https://hirex.vercel.app',
};
  const [introActive, setIntroActive] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100, label: "" });
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorTarget = useRef({ x: -100, y: -100 });
  const cursorFrame = useRef<number | null>(null);
  const [formNotice, setFormNotice] = useState("");
  const [formSending, setFormSending] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = navigation.map(([, id]) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
      const current = sections.reduce<HTMLElement | null>((selected, section) =>
        section.getBoundingClientRect().top < window.innerHeight * 0.42 ? section : selected, null);
      if (current) setActiveSection(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      setCursor((current) => ({
        ...current,
        x: current.x + (cursorTarget.current.x - current.x) * 0.17,
        y: current.y + (cursorTarget.current.y - current.y) * 0.17,
      }));
      cursorFrame.current = window.requestAnimationFrame(tick);
    };
    cursorFrame.current = window.requestAnimationFrame(tick);
    const move = (event: PointerEvent) => {
      cursorTarget.current = { x: event.clientX, y: event.clientY };
      setCursorVisible(true);
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-cursor]") : null;
      const cursorLabel = target?.dataset["cursor"] ?? "";
      setCursor((current) => current.label === cursorLabel ? current : { ...current, label: cursorLabel });
    };
    const leave = () => setCursorVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      if (cursorFrame.current !== null) window.cancelAnimationFrame(cursorFrame.current);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  const replayIntro = () => {
    setIntroActive(false);
    window.requestAnimationFrame(() => setIntroActive(true));
    window.setTimeout(() => setIntroActive(false), 1700);
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      subject: String(values.get("subject") ?? "").trim(),
      message: String(values.get("message") ?? "").trim(),
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFormNotice("Please fill in all fields before sending.");
      return;
    }
    setFormSending(true);
    setFormNotice("");
    try {
      const apiUrl = (import.meta.env['VITE_API_URL'] as string | undefined) ?? "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({})) as { message?: string; error?: string };
      if (response.ok) {
        setFormNotice("✓ Message sent — I'll get back to you soon!");
        form.reset();
      } else {
        setFormNotice(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormNotice("Unable to reach the server. Please try again later.");
    } finally {
      setFormSending(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="portfolio" id="home">
      <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
        <a href="#home" className="brand" aria-label="Nisha Bharti, home" onClick={closeMenu}>
          <span className="brand-spark" aria-hidden="true">✳</span>
          <span className="brand-name">NISHA<span>BHARTI</span></span>
        </a>
        <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Main navigation">
          {navigation.map(([label, id]) => <a key={id} href={`#${id}`} className={activeSection === id ? "nav-active" : ""} onClick={closeMenu}>{label}</a>)}
        </nav>
        <a className="header-connect" href="#contact" data-cursor="LET’S TALK">LET’S CONNECT <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className={`hero ${introActive ? "hero-replay" : ""}`} aria-labelledby="hero-title" style={{ backgroundImage: `linear-gradient(90deg, var(--hero-fade) 0%, transparent 73%), linear-gradient(0deg, var(--hero-floor) 0%, transparent 41%), url("${spaceBackground}")` }}>
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-streak hero-streak-one" aria-hidden="true" />
        <div className="hero-streak hero-streak-two" aria-hidden="true" />
        <div className="hero-streak hero-streak-three" aria-hidden="true" />
        <div className="launch-shuttle" aria-hidden="true">
          <svg viewBox="0 0 180 360" role="img" aria-label="" className="shuttle-svg">
            <defs>
              <linearGradient id="fuselage" x1="0" x2="1"><stop stopColor="var(--shuttle-shadow)"/><stop offset=".35" stopColor="var(--shuttle-highlight)"/><stop offset=".7" stopColor="var(--shuttle-mid)"/><stop offset="1" stopColor="var(--shuttle-shadow)"/></linearGradient>
              <linearGradient id="flame" x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--shuttle-flare)"/><stop offset=".34" stopColor="var(--rose)" stopOpacity=".9"/><stop offset="1" stopColor="var(--lilac)" stopOpacity="0"/></linearGradient>
              <filter id="engineGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <g className="shuttle-flames" filter="url(#engineGlow)"><path fill="url(#flame)" d="M65 241 Q77 292 73 356 Q91 319 86 243Z"/><path fill="url(#flame)" d="M95 241 Q108 292 103 359 Q122 315 115 242Z"/><path fill="var(--shuttle-flare)" d="M76 246 Q83 279 82 315 Q93 280 87 245Z"/></g>
            <g className="shuttle-body" stroke="var(--shuttle-line)" strokeWidth="1.5" strokeLinejoin="round">
              <path fill="url(#fuselage)" d="M89 9 Q97 25 101 57 L108 187 L143 229 L135 239 L100 216 L98 244 L82 244 L80 216 L45 239 L37 229 L70 187 L77 57 Q81 25 89 9Z"/>
              <path fill="var(--shuttle-wing)" d="M79 134 L43 231 L78 218 L84 183Z"/><path fill="var(--shuttle-wing)" d="M99 134 L136 231 L100 218 L94 183Z"/>
              <path fill="var(--shuttle-glass)" d="M89 40 L95 66 L84 66Z"/>
              <path fill="none" d="M82 86 L97 86 M80 108 L99 108 M78 132 L101 132 M76 157 L102 157 M73 183 L105 183" opacity=".5"/>
              <path fill="var(--shuttle-booster)" d="M64 78 Q54 114 58 194 L72 184 L76 85Z"/><path fill="var(--shuttle-booster)" d="M113 78 Q123 114 119 194 L105 184 L101 85Z"/>
              <path fill="var(--shuttle-booster-tip)" d="M62 194 L70 194 L69 227 L60 231Z"/><path fill="var(--shuttle-booster-tip)" d="M111 194 L119 194 L121 231 L112 227Z"/>
              <path fill="none" d="M85 78 L95 78 M82 202 L98 202" stroke="var(--rose)" opacity=".6"/>
            </g>
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-copy reveal-in">
            <span className="eyebrow-pill"><span className="eyebrow-dot" /> FULL STACK DEVELOPER</span>
            <h1 id="hero-title">Building<br />what comes<br /><em>next.</em></h1>
            <p className="hero-description">I'm Nisha Bharti, a full-stack developer exploring AI-powered products, fintech infrastructure, and meaningful web experiences.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#projects" data-cursor="VIEW WORK">EXPLORE MY WORK <ArrowRight size={15} /></a>
              <button className="button-secondary" type="button" onClick={replayIntro} aria-label="Replay the launch animation"><span className="play-symbol">◉</span> WATCH INTRO</button>
            </div>
            <div className="availability"><span aria-hidden="true" /> OPEN TO OPPORTUNITIES</div>
          </div>
        </div>
        <aside className="hero-manifesto" aria-label="Ideas, products, people, impact"><span>IDEAS</span><span>PRODUCTS</span><span>PEOPLE</span><span>IMPACT</span></aside>
        <div className="hero-handwriting" aria-hidden="true">Let's build<br />a better internet <span>♡</span></div>
        <div className="hero-mission" aria-hidden="true"><span className="mission-line" /><span>001 — A NEW HORIZON</span><span>WEB · AI · FINTECH</span></div>
        <div className="hero-project-strip" aria-label="Featured projects">
          {projects.map((project) => <a className="hero-project" key={project.id} href={`#${project.id}`} data-cursor="VIEW PROJECT">
            <span className="project-number">{project.number}</span><span className="project-title-wrap"><span className="hero-project-title">{project.title}</span><span className="hero-project-subtitle">{project.subtitle}</span></span><ArrowUpRight className="project-arrow" size={18} />
          </a>)}
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
        <button className="skip-intro" type="button" onClick={() => setIntroActive(false)}>SKIP INTRO <span>×</span></button>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="section-kicker"><span>01 / THE PERSON</span><span className="kicker-rule" /></div>
        <div className="about-layout">
          <div className="about-heading">
            <p className="section-eyebrow">A LITTLE ABOUT ME</p>
            <h2>A little<br />about <em>me.</em></h2>
            <div className="about-image-wrap">
              <img
                src="/profile.jpeg"
                alt="Nisha Bharti"
                className="about-image"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-copy">
            <p className="about-lead">I'm Nisha Bharti, a developer passionate about building full-stack applications, exploring AI-powered solutions, and creating useful digital experiences.</p>
            <div className="about-facts">
            <article className="fact-block"><span className="fact-index">01</span><h3>B.Tech</h3><p>Electronics and Communication Engineering</p><span className="fact-score">GPA <b>8.88</b></span></article>
            <article className="fact-block"><span className="fact-index">02</span><h3>Diploma</h3><p>Engineering</p><span className="fact-score">CGPA <b>8.44</b></span></article>
            <article className="fact-block"><span className="fact-index">03</span><h3>Curious by nature</h3><p>Full-stack development, AI-powered products, and problem-solving.</p></article>
          </div></div>
        </div>
      </section>

      <section className="skills-section section-wrap" id="skills">
        <div className="section-kicker"><span>02 / THE TOOLKIT</span><span className="kicker-rule" /></div>
        <div className="skills-heading"><div><p className="section-eyebrow">TOOLS I BUILD WITH</p><h2>Tools I build<br /><em>with.</em></h2></div><p className="skills-intro">A growing toolkit for shaping ideas into useful, considered products.</p></div>
        <div className="skills-list">{skillGroups.map((group, index) => <div className="skill-row" key={group.label}><span className="skill-index">0{index + 1}</span><h3>{group.label}</h3><div className="skill-tags">{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div>
      </section>

      <section className="projects-section section-wrap" id="projects">
        <div className="section-kicker"><span>03 / SELECTED WORK</span><span className="kicker-rule" /></div>
        <div className="projects-heading"><div><p className="section-eyebrow">MADE WITH INTENTION</p><h2>Selected<br /><em>work.</em></h2></div><p className="projects-intro">Six ideas at the intersection of helpful technology and thoughtful design.</p></div>
        <hr className="projects-divider" aria-hidden="true" />
        <div className="case-studies">{projects.map((project) => <article className={`case-study ${project.style}`} id={project.id} key={project.id}>
          <div className="case-visual" aria-hidden="true"><div className="mock-window"><div className="mock-topbar"><span className="mock-dots"><i /><i /><i /></span><span>workspace / overview</span><span>↗</span></div>
            <div className="mock-body"><div className="mock-sidebar"><span className="mock-logo">{project.mark}</span><i /><i /><i /><i /></div><div className="mock-dashboard"><div className="mock-greeting"><span>GOOD AFTERNOON</span><b>{project.title}</b></div><div className="mock-stats"><div><span>{project.id === "synapsefi" ? "API CONNECTIONS" : project.id === "medislot" ? "TODAY'S VISITS" : project.id === "medichain" ? "SECURE RECORDS" : project.id === "codepilot" ? "CODE ASSISTS" : project.id === "koru_pa" ? "MOOD SCORE" : "MATCHES TODAY"}</span><b>{project.id === "synapsefi" ? "24" : project.id === "medislot" ? "08" : project.id === "medichain" ? "12" : project.id === "codepilot" ? "47" : project.id === "koru_pa" ? "94" : "16"}</b><small>↗ Updated just now</small></div><div className="mock-ring"><span>●<br />● ●</span></div></div><div className="mock-chart"><div className="chart-caption"><span>ACTIVITY OVERVIEW</span><span>THIS WEEK⌄</span></div><svg viewBox="0 0 320 80" preserveAspectRatio="none"><path className="chart-fill" d="M0 66 C35 61 37 46 72 50 S110 29 145 38 S182 47 220 25 S267 39 320 9 L320 80 L0 80Z"/><path className="chart-stroke" d="M0 66 C35 61 37 46 72 50 S110 29 145 38 S182 47 220 25 S267 39 320 9"/></svg></div></div></div>
          </div></div>
          <div className="case-content"><div className="case-topline"><span>{project.number} / CASE STUDY</span><span>{project.category}</span></div><h3>{project.title}</h3><p className="case-subtitle">{project.subtitle}</p><p className="case-description">{project.description}</p><ul className="case-highlights">{project.highlights.map((highlight) => <li key={highlight}><span>↗</span>{highlight}</li>)}</ul><div className="tech-list">{project.technologies}</div>
{liveUrls[project.id] && (
  <a className="button-primary" href={liveUrls[project.id]} target="_blank" rel="noreferrer">Rate My Work</a>
)}</div>
        </article>)}</div>
      </section>



      <section className="experience-section section-wrap" id="experience">
        <div className="section-kicker"><span>04 / THE JOURNEY</span><span className="kicker-rule" /></div>
        <div className="experience-layout"><div><p className="section-eyebrow">WHERE I'VE BEEN BUILDING</p><h2>Where I've been<br /><em>building.</em></h2><p className="experience-intro">Different teams, real-world problems, and a lot learned along the way.</p></div>
          <div className="timeline">{experiences.map((experience, index) => <article className="timeline-entry" key={experience.place}><span className="timeline-dot" /><span className="timeline-index">0{index + 1}</span><div><h3>{experience.place}</h3><p className="timeline-role">{experience.role}</p><p className="timeline-detail">{experience.detail}</p></div></article>)}</div>
        </div>
      </section>

      <section className="achievements-section section-wrap" id="achievements">
        <div className="section-kicker"><span>05 / BEYOND THE CODE</span><span className="kicker-rule" /></div>
        <div className="achievements-heading"><p className="section-eyebrow">MILESTONES & LEADERSHIP</p><h2>Beyond the<br /><em>code.</em></h2></div>
        <div className="achievement-columns"><div className="achievement-column"><h3>HACKATHONS & CONCLAVES</h3>{achievements.map((item, index) => <div className="achievement-row" key={item}><span>0{index + 1}</span><p>{item}</p><ArrowUpRight size={15} /></div>)}</div><div className="achievement-column"><h3>LEADERSHIP</h3>{leadership.map((item, index) => <div className="achievement-row" key={item}><span>0{index + 1}</span><p>{item}</p><ArrowUpRight size={15} /></div>)}</div></div>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="contact-orbit" aria-hidden="true"><span /><i /><b /></div>
        <div className="section-kicker"><span>06 / START A CONVERSATION</span><span className="kicker-rule" /></div>
        <div className="contact-layout"><div className="contact-copy"><p className="section-eyebrow">HAVE A GOOD ONE IN MIND?</p><h2>Let's build<br />something <em>meaningful.</em></h2><p>Have an interesting idea or a challenging problem? I'd love to connect.</p><a className="email-link" href="mailto:nishabhardwaj843328@gmail.com" data-cursor="LET’S TALK">nishabhardwaj843328@gmail.com <ArrowUpRight size={16} /></a><div className="social-links"><a href="https://github.com/nishabhardwaj472" target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor="LET’S TALK"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a><a href="https://www.linkedin.com/in/nisha-bharti-b8004b218/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor="LET’S TALK"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} /></a></div></div>
          <form className="contact-form" onSubmit={submitContact}><label>Your name<input name="name" autoComplete="name" placeholder="How should I call you?" required /></label><label>Your email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>Subject<input name="subject" placeholder="A little about your idea" required /></label><label>Your message<textarea name="message" rows={3} placeholder="Tell me what you're thinking..." required /></label><button className="button-primary form-submit" type="submit" disabled={formSending} aria-busy={formSending}>{formSending ? "SENDING…" : "SEND MESSAGE"} <Mail size={15} /></button>{formNotice && <p className={`form-notice${formNotice.startsWith("✓") ? " form-notice-ok" : ""}`} role="status">{formNotice}</p>}</form>
        </div>
      </section>

      <footer className="site-footer"><a className="footer-brand" href="#home"><span>✳</span> NISHA BHARTI</a><p>Curious minds make meaningful things.</p><span className="copyright">© {new Date().getFullYear()} NISHA BHARTI</span><a className="back-top" href="#home" aria-label="Back to top">BACK TO TOP <ArrowUpRight size={14} /></a></footer>
      <div className={`cat-cursor ${cursorVisible ? "cat-cursor-visible" : ""} ${cursor.label ? "cat-cursor-labeled" : ""}`} style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} aria-hidden="true">
        {cursor.label ? <span className="cursor-label">{cursor.label}</span> : <><svg viewBox="0 0 40 38"><path d="M6 16 8 4l10 7q2-.5 4 0l10-7 2 12q3 4 2 9-2 10-16 10T4 25q-1-5 2-9Z"/><path className="cat-eye" d="M12 22h.5m14 0h.5"/></svg><span className="cursor-spark">✦</span></>}
      </div>
    </main>
  );
}
