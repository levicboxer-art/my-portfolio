import re

with open('src/App.tsx.backup', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract skillGroups
skill_groups_match = re.search(r'(const skillGroups = \[.*?\];)', content, re.DOTALL)
skill_groups = skill_groups_match.group(1)

# Extract certifications
certs_match = re.search(r'(const certifications = \[.*?\];)', content, re.DOTALL)
certs = certs_match.group(1)

# Extract sections
about_section = re.search(r'(<section id="about".*?</section>)', content, re.DOTALL).group(1)
skills_section = re.search(r'(<section id="skills".*?</section>)', content, re.DOTALL).group(1)
exp_section = re.search(r'(<section id="experience".*?</section>)', content, re.DOTALL).group(1)
lead_section = re.search(r'(<section id="leadership".*?</section>)', content, re.DOTALL).group(1)
proj_section = re.search(r'(<section id="projects".*?</section>)', content, re.DOTALL).group(1)
cert_section = re.search(r'(<section id="certifications".*?</section>)', content, re.DOTALL).group(1)
future_section = re.search(r'(<section id="future".*?</section>)', content, re.DOTALL).group(1)
contact_footer = re.search(r'(<footer id="contact".*?</footer>)', content, re.DOTALL).group(1)

# Fix contact footer scrollTo('home') to scrollTo('about')
contact_footer = contact_footer.replace("scrollTo('home')", "scrollTo('about')")

new_app = f'''import {{ useEffect, useMemo, useState, useRef, type MouseEvent }} from 'react';
import {{
  ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Cloud,
  Cpu, Globe2, GraduationCap, Layers3, Mail, Menu, Network, Quote, Router,
  Send, Sparkles, Trophy, Volume2, VolumeX,
  Users, X, Zap, Play, SkipForward
}} from 'lucide-react';

type Chapter = {{
  id: string;
  label: string;
}};

const chapters: Chapter[] = [
  {{ id: 'about', label: 'About' }},
  {{ id: 'skills', label: 'Skills' }},
  {{ id: 'experience', label: 'Experience' }},
  {{ id: 'leadership', label: 'Leadership' }},
  {{ id: 'projects', label: 'Projects' }},
  {{ id: 'certifications', label: 'Certificates' }},
  {{ id: 'future', label: 'Future' }},
  {{ id: 'contact', label: 'Contact' }},
];

{skill_groups}

{certs}

function IntroName({{ onContinue }}: {{ onContinue: () => void }}) {{
  useEffect(() => {{
    const handleWheel = (e: WheelEvent) => {{
      if (e.deltaY > 0) onContinue();
    }};
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }}, [onContinue]);

  return (
    <div className="intro-name-screen" onClick={{onContinue}}>
      <h1 className="intro-name-text">Ngenzi<br /><span>Levique</span></h1>
      <p className="intro-hint">
        Click or scroll to enter <ArrowDown size={{17}} />
      </p>
    </div>
  );
}}

function IntroPortrait({{ onFinish }}: {{ onFinish: () => void }}) {{
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {{
    const playAudio = async () => {{
      try {{
        if (audioRef.current) {{
          await audioRef.current.play();
          setIsPlaying(true);
          setHasStarted(true);
        }}
      }} catch (err) {{
        console.warn("Autoplay blocked, waiting for user click.");
      }}
    }};
    playAudio();
  }}, []);

  const handlePlayClick = () => {{
    if (audioRef.current) {{
      audioRef.current.play().then(() => {{
        setIsPlaying(true);
        setHasStarted(true);
      }}).catch(() => setAudioError(true));
    }}
  }};

  return (
    <div className="intro-portrait-screen">
      <div className="portrait-environment">
        <img 
          src="/images/portrait.png" 
          alt="Ngenzi Levique" 
          className={{`integrated-portrait ${{isPlaying ? 'speaking' : ''}}`}} 
        />
        <div className="lip-sync-placeholder" aria-hidden="true" />
      </div>

      <div className="intro-controls">
        <audio 
          ref={{audioRef}} 
          src="/audio/introduction.m4a" 
          onPlay={{() => setIsPlaying(true)}}
          onEnded={{() => {{
            setIsPlaying(false);
            onFinish();
          }}}}
          onError={{() => setAudioError(true)}}
        />
        
        {{!isPlaying && !hasStarted && !audioError && (
          <button className="control-btn pulse" onClick={{handlePlayClick}}>
            <Play size={{18}} /> Play Introduction
          </button>
        )}}
        
        <button className="control-btn secondary" onClick={{onFinish}}>
          <SkipForward size={{18}} /> Skip to Portfolio
        </button>
      </div>
    </div>
  );
}}

function App() {{
  const [appPhase, setAppPhase] = useState<'name' | 'portrait' | 'portfolio'>('name');
  const [activeChapter, setActiveChapter] = useState('about');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {{
    if (appPhase !== 'portfolio') return;
    const observer = new IntersectionObserver(
      (entries) => {{
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(visible.target.id);
      }},
      {{ rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] }},
    );
    chapters.forEach(({{ id }}) => {{
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }});
    return () => observer.disconnect();
  }}, [appPhase]);

  useEffect(() => {{
    if (appPhase !== 'portfolio') return;
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      {{ threshold: 0.12 }},
    );
    // Add small delay to ensure DOM is ready
    setTimeout(() => {{
      document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    }}, 100);
    return () => revealObserver.disconnect();
  }}, [appPhase]);

  const activeIndex = useMemo(() => chapters.findIndex((chapter) => chapter.id === activeChapter), [activeChapter]);

  const scrollTo = (id: string) => {{
    document.getElementById(id)?.scrollIntoView({{ behavior: 'smooth' }});
    setNavOpen(false);
  }};

  return (
    <main className="site-shell">
      {{appPhase === 'name' && (
        <IntroName onContinue={{() => setAppPhase('portrait')}} />
      )}}
      
      {{appPhase === 'portrait' && (
        <IntroPortrait onFinish={{() => setAppPhase('portfolio')}} />
      )}}

      <div className={{`portfolio-container ${{appPhase === 'portfolio' ? 'visible' : ''}}`}}>
        <div className="chapter-progress" aria-hidden="true">
          <span style={{{{ height: `${{Math.max(10, ((activeIndex + 1) / chapters.length) * 100)}}%` }}}} />
        </div>
        
        <header className={{`site-nav ${{activeChapter === 'future' ? 'nav-light' : 'nav-dark'}}`}}>
          <button className="brand-mark" onClick={{() => scrollTo('about')}} aria-label="Back to top">
            <span>NL</span><small>PORTFOLIO / 2026</small>
          </button>
          <button className="menu-toggle" onClick={{() => setNavOpen((open) => !open)}} aria-label="Toggle navigation">
            {{navOpen ? <X size={{20}} /> : <Menu size={{20}} />}}
          </button>
          <nav className={{navOpen ? 'nav-links open' : 'nav-links'}}>
            {{chapters.map((chapter) => (
              <button className={{activeChapter === chapter.id ? 'active' : ''}} key={{chapter.id}} onClick={{() => scrollTo(chapter.id)}}>
                {{chapter.label}}
              </button>
            ))}}
          </nav>
          <a className="nav-contact" href="mailto:ngenzilevique@gmail.com">Get in touch <ArrowUpRight size={{15}} /></a>
        </header>

        {about_section}
        {skills_section}
        {exp_section}
        {lead_section}
        {proj_section}
        {cert_section}
        {future_section}
        {contact_footer}
      </div>
    </main>
  );
}}

export default App;
'''

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_app)
