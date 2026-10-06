import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  ArrowDown, ArrowUp, ArrowUpRight, Award, CheckCircle2,
  Cloud, Cpu, Github, Globe2, Layers3, Linkedin, Mail, Menu,
  Network, Quote, Send, ShieldCheck, Sparkles, Terminal,
  Trophy, Users, X, Zap,
} from 'lucide-react';
import { TalkingPortrait } from './components/TalkingPortrait';
import { ErrorBoundary } from './components/ErrorBoundary';

type Chapter = { id: string; label: string };

const chapters: Chapter[] = [
  { id: 'about',          label: 'About' },
  { id: 'skills',         label: 'Skills' },
  { id: 'experience',     label: 'Experience' },
  { id: 'leadership',     label: 'Leadership' },
  { id: 'projects',       label: 'Projects' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'future',         label: 'Future' },
  { id: 'contact',        label: 'Contact' },
];

const skillGroups = [
  {
    number: '01', title: 'Technology', icon: Network, accent: 'line-red',
    items: ['Networking','IT support','Cloud computing','Linux','IoT','Cybersecurity fundamentals','Fiber optics','CCTV','Switching & routing','Troubleshooting'],
  },
  {
    number: '02', title: 'Digital & practical', icon: Cpu, accent: 'line-gold',
    items: ['Smart systems','Sensors','Automation','Web technologies','Database technologies','Digital technologies','Embedded systems'],
  },
  {
    number: '03', title: 'Customer & business', icon: Users, accent: 'line-cream',
    items: ['Customer service','Customer engagement','Sales fundamentals','Active listening','Complaint handling','Data entry','Rapid typing','Attention to detail'],
  },
  {
    number: '04', title: 'Leadership & communication', icon: Quote, accent: 'line-red',
    items: ['Leadership','Public speaking','Debate','Presentation','Teamwork','Coordination','Communication','Problem-solving','Critical thinking'],
  },
];

function App() {
  const [activeChapter, setActiveChapter]   = useState('about');
  const [navOpen, setNavOpen]               = useState(false);
  const [showNav, setShowNav]               = useState(false);
  const [isUnfolded, setIsUnfolded]         = useState(false);
  const [nameOffset, setNameOffset]         = useState({ x: 0, y: 0 });

  /* ── lock scroll until curtain unfolds ── */
  useEffect(() => {
    if (!isUnfolded) {
      document.body.style.overflow = 'hidden';
      const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) setIsUnfolded(true); };
      window.addEventListener('wheel', onWheel);
      return () => { document.body.style.overflow = ''; window.removeEventListener('wheel', onWheel); };
    }
    setTimeout(() => { document.body.style.overflow = ''; }, 1300);
  }, [isUnfolded]);

  /* ── section tracking ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis) return;
        const id = vis.target.id;
        if (id === 'intro-portrait') { setShowNav(false); return; }
        setShowNav(true);
        setActiveChapter(id);
      },
      { rootMargin: '-25% 0px -50% 0px', threshold: [0.05, 0.2, 0.5] },
    );
    document.querySelectorAll('section[id], footer[id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── scroll-reveal animations ── */
  useEffect(() => {
    const revObs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.10 },
    );
    setTimeout(() => document.querySelectorAll('.reveal').forEach(el => revObs.observe(el)), 120);
    return () => revObs.disconnect();
  }, []);

  /* ── hanging tablet: scroll-driven drift ──
     The rig eases down from the top of the chapter and settles toward the
     middle as the scene crosses the viewport, with a slight pendulum tilt.
     The inner wire-group keeps its idle sway animation independently. */
  useEffect(() => {
    const scene = document.querySelector('.hanging-scene');
    const rig = document.querySelector<HTMLElement>('.hanging-rig');
    if (!scene || !rig) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = scene.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      rig.style.transform = `translateY(${(-90 + 150 * p).toFixed(1)}px) rotate(${(-2.4 + 4.8 * p).toFixed(2)}deg)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── experience cards: scroll-driven spotlight ──
     Whichever process card sits nearest the viewport center lights up in the
     coral accent (hover-hold look); the others rest in clean white. */
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.exp-float-card'));
    if (!cards.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = card; }
      }
      cards.forEach(c => c.classList.toggle('card-active', c === best));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── certifications rail: sequential per-item reveal + growing rail line ── */
  useEffect(() => {
    const certObs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.4 },
    );
    setTimeout(() => document.querySelectorAll('.cert-rail-item').forEach(el => certObs.observe(el)), 120);
    return () => certObs.disconnect();
  }, []);

  useEffect(() => {
    const rail = document.querySelector('.cert-rail');
    const fill = document.querySelector<HTMLElement>('.cert-rail-fill');
    if (!rail || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = rail.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.15)));
      fill.style.height = `${(p * 100).toFixed(1)}%`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── projects: cursor-driven 3D tilt + glare on the showcase cards ── */
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.pro-tilt'));
    const cleanups: Array<() => void> = [];
    for (const card of cards) {
      const glare = card.querySelector<HTMLElement>('.pro-glare');
      const onMove = (e: PointerEvent) => {
        // First contact switches the card from its slow scroll-reveal
        // transition to a snappy cursor-following one.
        if (card.dataset.tiltLive !== '1') {
          card.dataset.tiltLive = '1';
          card.style.transition =
            'transform 0.15s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease';
        }
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--tx', `${((px - 0.5) * -4).toFixed(2)}deg`);
        card.style.setProperty('--ty', `${((py - 0.5) * 4).toFixed(2)}deg`);
        if (glare) {
          glare.style.opacity = '1';
          glare.style.transform = `translate(${(px * 100 - 50).toFixed(1)}%, ${(py * 100 - 50).toFixed(1)}%)`;
        }
      };
      const onLeave = () => {
        card.style.setProperty('--tx', '0deg');
        card.style.setProperty('--ty', '0deg');
        if (glare) glare.style.opacity = '0';
      };
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    }
    return () => cleanups.forEach(fn => fn());
  }, []);

  const activeIndex = useMemo(() => chapters.findIndex(c => c.id === activeChapter), [activeChapter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  const handleNameMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setNameOffset({
      x: ((e.clientX / window.innerWidth)  - 0.5) * 22,
      y: ((e.clientY / window.innerHeight) - 0.5) * 22,
    });
  };

  return (
    <main className="site-shell">

      {/* ══════════════════════════════════════
          1 · CURTAIN — Name Screen
      ══════════════════════════════════════ */}
      <div
        className={`intro-curtain${isUnfolded ? ' unfolded' : ''}`}
        onClick={() => setIsUnfolded(true)}
        onMouseMove={handleNameMouseMove}
        onMouseLeave={() => setNameOffset({ x: 0, y: 0 })}
      >
        {/* Animated background particles */}
        <div className="curtain-particles" aria-hidden="true">
          {[...Array(6)].map((_, i) => <span key={i} className={`particle p-${i}`} />)}
        </div>

        <div
          className="intro-name-content"
          style={{
            transform: `perspective(1000px) rotateY(${nameOffset.x}deg) rotateX(${-nameOffset.y}deg)`,
            transition: nameOffset.x === 0 ? 'transform 0.6s ease-out' : 'transform 0.08s linear',
            transformStyle: 'preserve-3d',
          }}
        >
          <span className="curtain-eyebrow reveal">Portfolio · 2026</span>
          <h1 className="intro-name-text reveal">
            Ngenzi<br /><em>Levique</em>
          </h1>
          <p className="curtain-tagline reveal delay-two">
            Networking & Internet Technology · IT Professional
          </p>
          <p className="intro-hint reveal delay-three">
            Click or scroll to enter <ArrowDown size={16} />
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          2 · REALISTIC TALKING PORTRAIT + TRANSCRIPT
      ══════════════════════════════════════ */}
      <section id="intro-portrait" className="intro-portrait-section">
        <ErrorBoundary>
          <TalkingPortrait />
        </ErrorBoundary>
      </section>

      {/* ══════════════════════════════════════
          3 · MAIN PORTFOLIO
      ══════════════════════════════════════ */}
      <div className={`portfolio-container${showNav ? ' visible' : ''}`}>

        {/* Progress bar */}
        <div className="chapter-progress" aria-hidden="true" style={{ opacity: showNav ? 1 : 0, transition: 'opacity 0.5s' }}>
          <span style={{ height: `${Math.max(10, ((activeIndex + 1) / chapters.length) * 100)}%` }} />
        </div>

        {/* Navigation */}
        <header
          className={`site-nav${activeChapter === 'future' ? ' nav-light' : ' nav-dark'}`}
          style={{ opacity: showNav ? 1 : 0, pointerEvents: showNav ? 'auto' : 'none', transition: 'opacity 0.5s' }}
        >
          <button className="brand-mark" onClick={() => scrollTo('about')} aria-label="Back to top">
            <span>NL</span><small>PORTFOLIO / 2026</small>
          </button>
          <button className="menu-toggle" onClick={() => setNavOpen(o => !o)} aria-label="Toggle navigation">
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={navOpen ? 'nav-links open' : 'nav-links'}>
            {chapters.map(ch => (
              <button key={ch.id} className={activeChapter === ch.id ? 'active' : ''} onClick={() => scrollTo(ch.id)}>
                {ch.label}
              </button>
            ))}
          </nav>
          <a className="nav-contact" href="mailto:ngenzilevique@gmail.com">Get in touch <ArrowUpRight size={15} /></a>
        </header>

        {/* ── About ─────────────────────────── */}
        <section id="about" className="chapter-coral chapter-padding">

          {/* Hanging-tablet hero inspired by screenshot */}
          <div className="hanging-scene reveal">
            <div className="hanging-rig">
              <div className="hanging-wire-group">
                <div className="hanging-wire" />
                <div className="hanging-clip" />
                <div className="tablet-frame">
                  <img src="/images/portrait.webp" alt="Ngenzi Levique" className="tablet-face" />
                </div>
              </div>
            </div>

            <div className="about-greeting">
              <h2 className="about-hello reveal delay-one">Hello!</h2>
              <p className="about-bio reveal delay-two">
                Hi, my name is <strong>Ngenzi Levique</strong> — a Networking &amp; Internet
                Technology graduate based in Kigali, dedicated to building clean, functional,
                and scalable technology solutions.
              </p>
              <div className="about-icons reveal delay-three">
                <div className="icon-pill"><Network size={22} />Networking</div>
                <div className="icon-pill"><Cloud size={22} />Cloud</div>
                <div className="icon-pill"><Cpu size={22} />IoT</div>
              </div>
            </div>
          </div>

          {/* Secondary bio */}
          <div className="about-grid">
            <h2 className="display-heading reveal">Learning is<br /><span>the constant.</span></h2>
            <div className="about-copy reveal delay-one">
              <p className="large-copy">I am a Level 5 graduate in <strong>Networking and Internet Technology</strong> from the International Technical School of Kigali.</p>
              <p>My path brings together practical technology, communication, leadership, and a genuine interest in people. From networking infrastructure and cloud systems to debate rooms and customer conversations, I enjoy understanding the problem before building the answer.</p>
              <p>I am adaptable, resilient, detail-oriented, and motivated by opportunities to keep growing through hands-on work and collaboration.</p>
              <div className="signature-line"><span /> <em>Ngenzi Levique</em></div>
            </div>
          </div>
          <div className="about-trail reveal">
            <div><span>2024—25</span><strong>Natcom Academy</strong><small>Practical internship</small></div>
            <div><span>2026</span><strong>ITS Kigali</strong><small>Level 5 graduate</small></div>
            <div><span>Next</span><strong>Keep building</strong><small>Learning in motion</small></div>
          </div>
        </section>

        {/* ── Skills ────────────────────────── */}
        <section id="skills" className="chapter-charcoal chapter-padding">
          <div className="section-kicker light reveal"><span>03</span><span>Technical journey</span></div>
          <div className="section-intro reveal">
            <h2 className="display-heading">Many tools.<br /><span>One mindset.</span></h2>
            <p>Technology is never just a checklist. It is the practice of staying curious, patient, and useful when systems or situations get complicated.</p>
          </div>
          <div className="skill-grid">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article className="skill-group reveal" key={group.number}>
                  <div className="skill-top"><span>{group.number}</span><Icon size={21} strokeWidth={1.5} /></div>
                  <h3>{group.title}</h3>
                  <div className={`skill-rule ${group.accent}`} />
                  <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Experience: Where theory met reality ────────────────────── */}
        <section id="experience" className="chapter-red chapter-padding experience-process-section">
          <div className="section-kicker light reveal"><span>04</span><span>Experience &amp; Process</span></div>
          
          <div className="exp-flow-container">
            {/* Left Column: Heading + Subtitle + Vertical Anchor Rail (Screenshot 1 Style) */}
            <div className="exp-flow-intro">
              <div className="exp-side-rail" aria-hidden="true">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub" className="rail-icon"><Terminal size={14} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="rail-icon"><Globe2 size={14} /></a>
                <a href="#contact" title="Direct Contact" className="rail-icon"><Mail size={14} /></a>
                <span className="rail-line" />
              </div>

              <div className="exp-intro-content">
                <h2 className="display-heading reveal">Where theory<br /><span>met reality.</span></h2>
                <p className="exp-lead-copy reveal delay-one">
                  I follow a structured, hands-on, and disciplined technical approach to turn networking architecture and systems engineering into dependable, real-world solutions.
                </p>
                <div className="exp-meta-badge reveal delay-two">
                  <span className="exp-meta-dot" />
                  <span>3+ Years Practical Field Experience</span>
                </div>
              </div>
            </div>

            {/* Right Column: Connected Floating Process Cards with Curving Flight Path (Screenshot 1 Style) */}
            <div className="exp-cards-canvas reveal delay-one">
              {/* SVG Flow Connector Path */}
              <svg className="exp-flow-svg" viewBox="0 0 600 720" fill="none" preserveAspectRatio="none" aria-hidden="true">
                {/* Path from Card 1 to Card 2 */}
                <path
                  d="M 420 130 C 260 170, 180 240, 190 320"
                  stroke="rgba(255, 255, 255, 0.40)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="exp-flow-dash"
                />
                {/* Directional Paperplane / Navigation icon on path 1 */}
                <g transform="translate(260, 205) rotate(155)">
                  <polygon points="0,0 14,5 0,10 3,5" fill="#ffffff" opacity="0.9" />
                </g>

                {/* Path from Card 2 to Card 3 */}
                <path
                  d="M 230 460 C 290 530, 390 540, 420 580"
                  stroke="rgba(255, 255, 255, 0.40)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="exp-flow-dash"
                />
                {/* Directional Paperplane on path 2 */}
                <g transform="translate(325, 520) rotate(35)">
                  <polygon points="0,0 14,5 0,10 3,5" fill="#ffffff" opacity="0.9" />
                </g>
              </svg>

              {/* Floating Card 1 (lights up with the coral accent as it scrolls by) */}
              <div className="exp-float-card card-light card-pos-1">
                <div className="card-top-row">
                  <span className="card-number-badge">01</span>
                  <span className="card-tag">Concept &amp; Foundation</span>
                </div>
                <h3 className="card-title">Natcom Academy</h3>
                <h4 className="card-subtitle">Practical Networking Internship · 2024–25</h4>
                <p className="card-body">
                  Two years of rigorous hands-on technical immersion covering physical network infrastructure, Cisco routing &amp; switching, structured fiber-optic cabling, and CCTV security deployment.
                </p>
                <div className="card-pills">
                  <span>Cisco IOS</span>
                  <span>Fiber Optics</span>
                  <span>Switching</span>
                  <span>CCTV</span>
                </div>
              </div>

              {/* Floating Card 2 (Middle White/Cream Card with subtle tilt & shadow) */}
              <div className="exp-float-card card-light card-pos-2">
                <div className="card-top-row">
                  <span className="card-number-badge">02</span>
                  <span className="card-tag">Systems &amp; Cloud Lab</span>
                </div>
                <h3 className="card-title">Bridge / Unipod / KIST</h3>
                <h4 className="card-subtitle">Level 5 Practical Lab Experience · 2026</h4>
                <p className="card-body">
                  Deploying and configuring Linux server environments, IoT sensor integrations, cloud architectures, and executing hands-on cybersecurity penetration-testing fundamentals.
                </p>
                <div className="card-pills">
                  <span>Linux Administration</span>
                  <span>Cloud Computing</span>
                  <span>IoT Sensors</span>
                  <span>Cybersecurity</span>
                </div>
              </div>

              {/* Floating Card 3 (Bottom Card - Execution & Collaboration) */}
              <div className="exp-float-card card-light card-pos-3">
                <div className="card-top-row">
                  <span className="card-number-badge">03</span>
                  <span className="card-tag">Execution &amp; Readiness</span>
                </div>
                <h3 className="card-title">Harambee Youth Accelerator</h3>
                <h4 className="card-subtitle">Work Readiness Program · GBO Sector · 2026</h4>
                <p className="card-body">
                  Mastering customer engagement excellence, rapid problem resolution, agile technical troubleshooting, resilience under pressure, and active collaborative teamwork.
                </p>
                <div className="card-pills">
                  <span>Technical Support</span>
                  <span>Active Listening</span>
                  <span>Cross-Team Agility</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Leadership ────────────────────── */}
        <section id="leadership" className="chapter-burgundy chapter-padding">
          <div className="section-kicker light reveal"><span>05</span><span>Leadership</span></div>
          <div className="leadership-editorial">
            <div className="leadership-head">
              <h2 className="display-heading reveal">Find your voice.<br /><span>Bring others with you.</span></h2>
              <figure className="leadership-quote reveal delay-one">
                <span className="lq-mark">“</span>
                <blockquote>Leadership, to me, is the courage to contribute — then make room for others to do the same.</blockquote>
                <figcaption>— Ngenzi Levique</figcaption>
              </figure>
            </div>

            <div className="leadership-journey">
              <div className="lj-step reveal">
                <span className="lj-index">01</span>
                <span className="lj-role">Coordinator</span>
                <strong className="lj-org">PLP Inganji</strong>
                <p>Recruitment, member engagement, rules, coordination, and shared objectives.</p>
              </div>
              <div className="lj-step reveal delay-one">
                <span className="lj-index">02</span>
                <span className="lj-role">Advisor</span>
                <strong className="lj-org">ITS YoungLife Club</strong>
                <p>Guidance, collaboration, communication, teamwork, and interpersonal skills.</p>
              </div>
              <div className="lj-step lj-featured reveal delay-two">
                <span className="lj-index">03</span>
                <span className="lj-role"><Trophy size={14} /> Featured Role</span>
                <strong className="lj-org">Debate Club Lead</strong>
                <p>Organized events, trained new members, and helped build communication and public-speaking confidence.</p>
                <div className="lj-stats"><span><b>2</b> trophies</span><i /><span><b>6</b> gold medals</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects: Build. Test. Make it real. ──────────────────────── */}
        <section id="projects" className="chapter-warm chapter-padding projects-pro-section">
          <div className="section-kicker reveal"><span>06</span><span>Projects &amp; Innovation</span></div>
          
          <div className="project-heading">
            <h2 className="display-heading reveal">Build. Test.<br /><span>Make it real.</span></h2>
            <p className="reveal delay-one">
              A practical curiosity spanning connected systems, digital infrastructure, hackathon innovation, and collaborative engineering.
            </p>
          </div>

          <div className="pro-projects-showcase">
            {/* Featured Flagship Project Hero */}
            <article className="pro-project-hero pro-tilt reveal">
              <div className="pro-glare" />
              <div className="pro-hero-header">
                <div className="pro-category-tag">
                  <Layers3 size={15} />
                  <span>01 / Systems &amp; IoT</span>
                </div>
                <div className="pro-status-badge">
                  <span className="status-live-pulse" />
                  <span>Active Hardware Implementation</span>
                </div>
              </div>

              <div className="pro-hero-body">
                <div className="pro-hero-main">
                  <h3>Smart Environmental &amp; Connected Telemetry System</h3>
                  <p>
                    Engineered an autonomous embedded sensor node network for real-time temperature, humidity, and air quality telemetry. Microcontroller firmware transmits sensor payloads over lightweight MQTT protocols to a centralized monitoring dashboard with automated threshold alerting.
                  </p>
                  <div className="pro-tech-row">
                    <span>ESP32 / Arduino</span>
                    <span>MQTT Protocol</span>
                    <span>Sensors (DHT22 / MQ-135)</span>
                    <span>C++ Firmware</span>
                    <span>Real-time Dashboard</span>
                  </div>
                </div>

                <div className="pro-hero-metrics">
                  <div className="metric-box">
                    <strong>&lt; 500ms</strong>
                    <small>Telemetry Latency</small>
                  </div>
                  <div className="metric-box">
                    <strong>99.8%</strong>
                    <small>Uptime Reliability</small>
                  </div>
                  <div className="metric-box">
                    <strong>Autonomous</strong>
                    <small>Alert Triggering</small>
                  </div>
                </div>
              </div>
            </article>

            {/* International Flagship: Global Space Connectivity & Sustainable Events in Saudi Arabia */}
            <div className="pro-bento-row">
            <article className="pro-project-hero global-space-hero pro-tilt reveal delay-one">
              <div className="pro-glare" />
              <div className="pro-hero-header">
                <div className="pro-category-tag space-cat-tag">
                  <Globe2 size={15} />
                  <span>02 / International Delegation · Space &amp; Connectivity</span>
                </div>
                <div className="pro-status-badge space-status-badge">
                  <span className="status-live-pulse gold-pulse" />
                  <span>CST Headquarters · Riyadh, Saudi Arabia</span>
                </div>
              </div>

              <div className="pro-hero-body">
                <div className="pro-hero-main">
                  <h3>Global Space Connectivity &amp; Sustainable Events</h3>
                  <p>
                    Attended and represented as an international participant at the high-level Global Space Connectivity and Sustainability Events in Riyadh, Saudi Arabia (12–14 October 2026). Engaged with leading global satellite telecommunications experts, space industry engineers, and policymakers on non-terrestrial networks (NTN), orbital spectrum sustainability, next-generation satellite broadband, and bridging the global digital divide.
                  </p>
                  <div className="pro-tech-row space-tech-row">
                    <span>Satellite Telecommunications</span>
                    <span>Space Connectivity</span>
                    <span>Non-Terrestrial Networks (NTN)</span>
                    <span>Sustainable Orbital Tech</span>
                    <span>Riyadh, Saudi Arabia</span>
                    <span>International Delegate</span>
                  </div>
                </div>

                <div className="pro-hero-metrics space-metrics">
                  <div className="metric-box">
                    <strong>Riyadh, KSA</strong>
                    <small>CST Headquarters</small>
                  </div>
                  <div className="metric-box">
                    <strong>12–14 Oct</strong>
                    <small>Global Space Summit · 2026</small>
                  </div>
                  <div className="metric-box">
                    <strong>Delegate</strong>
                    <small>Ngenzi Levique</small>
                  </div>
                </div>
              </div>
            </article>

            {/* Split Grid for Infrastructure & Innovation */}
            <div className="pro-projects-split">
              {/* Project 3: Cloud & Linux Infrastructure */}
              <article className="pro-project-card pro-tilt reveal delay-one">
                <div className="pro-glare" />
                <div className="pro-card-header">
                  <span className="pro-card-cat"><Cloud size={14} /> 03 / Infrastructure</span>
                  <span className="pro-card-tag">Enterprise Testbed</span>
                </div>
                <h3>Cloud, Linux &amp; Virtualized Network Lab</h3>
                <p>
                  Designed and configured multi-VLAN virtualized enterprise testbeds featuring Linux server administration, DHCP/DNS services, packet inspection, and penetration-testing defense protocols.
                </p>
                <div className="pro-tech-row">
                  <span>Ubuntu Server</span>
                  <span>VLAN Segmentation</span>
                  <span>Wireshark</span>
                  <span>Cisco Packet Tracer</span>
                  <span>Firewalls</span>
                </div>
              </article>

              {/* Project 4: Hackathons & Competitions */}
              <article className="pro-project-card pro-tilt reveal delay-two">
                <div className="pro-glare" />
                <div className="pro-card-header">
                  <span className="pro-card-cat"><Sparkles size={14} /> 04 / Competitions</span>
                  <span className="pro-card-tag award-tag"><Trophy size={12} /> Award Honors</span>
                </div>
                <h3>Robotics, Hackathons &amp; Collaborative Innovation</h3>
                <p>
                  Active competitor in FIRST LEGO League 2025 robotics programming, REMA Tech Hackathon environmental solutions, district-level tech challenges, and Codex collaborative technical initiatives.
                </p>
                <div className="pro-highlights-row">
                  <div className="pro-pill-accent"><b>2</b> Trophies</div>
                  <div className="pro-pill-accent"><b>6</b> Gold Medals</div>
                  <div className="pro-pill-accent">Team Leadership</div>
                </div>
              </article>
            </div>
            </div>
          </div>
        </section>

        {/* ── Certifications: Proof of the practice ────────────────── */}
        <section id="certifications" className="chapter-black chapter-padding cert-screenshot-section">

          {/* S-wave decorative SVG background */}
          <svg className="cert-swave-bg" viewBox="0 0 1400 700" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M -100 250 C 150 100, 350 420, 600 270 S 950 80, 1200 300 S 1400 450, 1600 260"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="260"
            />
            <path
              d="M -100 250 C 150 100, 350 420, 600 270 S 950 80, 1200 300 S 1400 450, 1600 260"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="360"
            />
            <path
              d="M -100 250 C 150 100, 350 420, 600 270 S 950 80, 1200 300 S 1400 450, 1600 260"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="500"
            />
          </svg>

          <div className="section-kicker light reveal text-center"><span>07</span><span>Learning Archive</span></div>

          {/* Centred heading */}
          <div className="cert-screenshot-header text-center reveal">
            <h2 className="display-heading">Certifications</h2>
            <p className="cert-screenshot-sub">
              Industry-recognised credentials and international badges that validate my technical expertise, networking mastery, and professional leadership.
            </p>
          </div>

          {/* Prominent ITU Badge Feature Card (Centered In-Between) */}
          <div className="cert-itu-featured-wrap reveal delay-one">
            <div className="cert-itu-badge-card">
              <div className="itu-badge-glow" />
              <div className="itu-badge-left">
                <div className="itu-emblem-box">
                  <Globe2 size={28} />
                  <span className="itu-emblem-ring" />
                </div>
                <div className="itu-badge-text">
                  <div className="itu-tag-row">
                    <span className="itu-pill-un">United Nations Specialized Agency</span>
                    <span className="itu-pill-verified"><ShieldCheck size={13} /> Official ITU Badge</span>
                  </div>
                  <h3>ITU — International Telecommunication Union</h3>
                  <p>Global Telecommunications, Spectrum &amp; ICT Infrastructure Standards</p>
                </div>
              </div>
              <div className="itu-badge-right">
                <div className="itu-metric-badge">
                  <strong>ITU</strong>
                  <small>Global Badge</small>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical certification rail — each entry snaps in as it scrolls in */}
          <div className="cert-rail">
            <div className="cert-rail-fill" aria-hidden="true" />

            <div className="cert-rail-item tone-gold">
              <div className="cert-rail-node cert-icon--gold"><Award size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Harambee Youth Employment Accelerator</h4>
                  <p>Work Readiness Program, GBO Sector — 2026</p>
                </div>
                <span className="cert-verified-pill cert-pill--gold"><CheckCircle2 size={12} /> Certified GBO</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Users size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Leadership Essentials</h4>
                  <p>NonprofitReady.org</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> Leadership</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Sparkles size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Effective Leadership</h4>
                  <p>HP LIFE</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> Leadership</span>
              </div>
            </div>

            <div className="cert-rail-item tone-cyan">
              <div className="cert-rail-node cert-icon--cyan"><ShieldCheck size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Cisco Network Security, Secure Routing &amp; Switching</h4>
                  <p>LinkedIn Learning</p>
                </div>
                <span className="cert-verified-pill cert-pill--cyan"><CheckCircle2 size={12} /> Infrastructure</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Zap size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Managing Your Time</h4>
                  <p>LinkedIn Learning</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> Productivity</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Layers3 size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Project Management for Foundations / Requirements</h4>
                  <p>LinkedIn Learning</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> PM</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Quote size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Communication Skills</h4>
                  <p>SkillUp</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> Soft Skills</span>
              </div>
            </div>

            <div className="cert-rail-item tone-gold">
              <div className="cert-rail-node cert-icon--gold"><Trophy size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>Debating Certificate</h4>
                  <p>iDebate Rwanda</p>
                </div>
                <span className="cert-verified-pill cert-pill--gold"><CheckCircle2 size={12} /> Public Speaking</span>
              </div>
            </div>

            <div className="cert-rail-item">
              <div className="cert-rail-node"><Globe2 size={17} /></div>
              <div className="cert-rail-card">
                <div className="cert-screen-info">
                  <h4>EF SET English Certificate — B2 Upper-Intermediate</h4>
                  <p>EF Standard English Test</p>
                </div>
                <span className="cert-verified-pill"><CheckCircle2 size={12} /> B2 English</span>
              </div>
            </div>

          </div>

          {/* Language Fluency Strip */}
          <div className="languages-strip reveal delay-two">
            <span className="languages-title">Language Fluency</span>
            <div className="languages-items">
              <div className="lang-pill"><strong>Kinyarwanda</strong><small>Native / Fluent</small></div>
              <div className="lang-pill"><strong>English</strong><small>B2 Upper-Intermediate (EF SET)</small></div>
              <div className="lang-pill"><strong>French</strong><small>Basic Communication</small></div>
            </div>
          </div>
        </section>

        {/* ── Future ────────────────────────── */}
        <section id="future" className="chapter-cream future-section chapter-padding">
          <div className="future-glow" />
          <div className="section-kicker reveal"><span>08</span><span>Global exposure · What's next</span></div>
          <div className="future-layout">
            <div>
              <p className="eyebrow reveal"><span className="eyebrow-line" /> The next horizon</p>
              <h2 className="display-heading reveal delay-one">Still becoming<br /><span>what's possible.</span></h2>
              <p className="future-copy reveal delay-two">I am a young technology professional continuing to learn, build, collaborate, and grow — with the ambition to create digital solutions that are useful, thoughtful, and built to last.</p>
              <button className="text-button dark reveal delay-three" onClick={() => scrollTo('contact')}>Start a conversation <ArrowUpRight size={17} /></button>
            </div>
            <div className="global-card reveal delay-one">
              <Globe2 size={27} />
              <span>Global exposure</span>
              <strong>Global Space Connectivity &amp; Sustainability Events</strong>
              <p>Participant — Ngenzi Levique</p>
              <small>12–14 October 2026<br />CST Headquarters, Riyadh, Saudi Arabia</small>
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────── */}
        <footer id="contact" className="contact-footer">
          <div className="section-kicker light reveal"><span>09</span><span>Contact</span></div>

          <div className="contact-callout">
            <div className="contact-intro">
              <p className="eyebrow light reveal"><span className="eyebrow-line" /> Let's connect</p>
              <h2 className="footer-title reveal delay-one">Let's make<br /><em>something useful.</em></h2>
              <p className="contact-note reveal delay-two">
                Open to meaningful conversations, collaborations, and opportunities
                where technology turns into practical value.
              </p>
            </div>

            <div className="contact-panel reveal delay-two">
              <a className="contact-tile" href="mailto:ngenzilevique@gmail.com">
                <span className="ct-icon"><Mail size={20} /></span>
                <span className="ct-body"><small>Email me</small><strong>ngenzilevique@gmail.com</strong></span>
                <ArrowUpRight size={18} className="ct-arrow" />
              </a>
              <a className="contact-tile" href="tel:+250791376727">
                <span className="ct-icon"><Send size={20} /></span>
                <span className="ct-body"><small>Call / WhatsApp</small><strong>+250 791 376 727</strong></span>
                <ArrowUpRight size={18} className="ct-arrow" />
              </a>
              <div className="contact-availability">
                <span className="status-live-pulse" />
                <span>Available for opportunities &amp; collaborations</span>
              </div>
            </div>
          </div>

          <div className="footer-socials reveal delay-two">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:ngenzilevique@gmail.com" aria-label="Email"><Mail size={18} /></a>
          </div>

          <div className="footer-bottom">
            <span>NGENZI LEVIQUE</span>
            <small>Not just a CV. A journey in motion.</small>
            <button onClick={() => scrollTo('about')} aria-label="Back to top"><ArrowUp size={16} /></button>
          </div>
        </footer>

      </div>
    </main>
  );
}

export default App;
