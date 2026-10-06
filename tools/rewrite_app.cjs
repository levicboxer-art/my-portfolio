const fs = require('fs');

const content = fs.readFileSync('src/App.tsx.backup', 'utf-8');

// Extract skillGroups
const skillGroupsMatch = content.match(/(const skillGroups = \[[\s\S]*?\];)/);
const skillGroups = skillGroupsMatch ? skillGroupsMatch[1] : '';

// Extract certifications
const certsMatch = content.match(/(const certifications = \[[\s\S]*?\];)/);
const certs = certsMatch ? certsMatch[1] : '';

// Extract sections
const aboutMatch = content.match(/(<section id="about"[\s\S]*?<\/section>)/);
const skillsMatch = content.match(/(<section id="skills"[\s\S]*?<\/section>)/);
const expMatch = content.match(/(<section id="experience"[\s\S]*?<\/section>)/);
const leadMatch = content.match(/(<section id="leadership"[\s\S]*?<\/section>)/);
const projMatch = content.match(/(<section id="projects"[\s\S]*?<\/section>)/);
const certMatch = content.match(/(<section id="certifications"[\s\S]*?<\/section>)/);
const futureMatch = content.match(/(<section id="future"[\s\S]*?<\/section>)/);
const contactMatch = content.match(/(<footer id="contact"[\s\S]*?<\/footer>)/);

let contactFooter = contactMatch ? contactMatch[1] : '';
contactFooter = contactFooter.replace(/scrollTo\('home'\)/g, "scrollTo('about')");

const newApp = `import { useEffect, useMemo, useState, useRef, type MouseEvent } from 'react';
import {
  ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Cloud,
  Cpu, Globe2, GraduationCap, Layers3, Mail, Menu, Network, Quote, Router,
  Send, Sparkles, Trophy, Volume2, VolumeX,
  Users, X, Zap, Play, SkipForward
} from 'lucide-react';

type Chapter = {
  id: string;
  label: string;
};

const chapters: Chapter[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'future', label: 'Future' },
  { id: 'contact', label: 'Contact' },
];

${skillGroups}

${certs}

function IntroName({ onContinue }: { onContinue: () => void }) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) onContinue();
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onContinue]);

  return (
    <div className="intro-name-screen" onClick={onContinue}>
      <h1 className="intro-name-text">Ngenzi<br /><span>Levique</span></h1>
      <p className="intro-hint">
        Click or scroll to enter <ArrowDown size={17} />
      </p>
    </div>
  );
}

function IntroPortrait({ onFinish }: { onFinish: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasStarted(true);
        }
      } catch (err) {
        console.warn("Autoplay blocked, waiting for user click.");
      }
    };
    playAudio();
  }, []);

  const handlePlayClick = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => setAudioError(true));
    }
  };

  return (
    <div className="intro-portrait-screen">
      <div className="portrait-environment">
        <img 
          src="/images/portrait.png" 
          alt="Ngenzi Levique" 
          className={\`integrated-portrait \${isPlaying ? 'speaking' : ''}\`} 
        />
        <div className="lip-sync-placeholder" aria-hidden="true" />
      </div>

      <div className="intro-controls">
        <audio 
          ref={audioRef} 
          src="/audio/introduction.m4a" 
          onPlay={() => setIsPlaying(true)}
          onEnded={() => {
            setIsPlaying(false);
            onFinish();
          }}
          onError={() => setAudioError(true)}
        />
        
        {!isPlaying && !hasStarted && !audioError && (
          <button className="control-btn pulse" onClick={handlePlayClick}>
            <Play size={18} /> Play Introduction
          </button>
        )}
        
        <button className="control-btn secondary" onClick={onFinish}>
          <SkipForward size={18} /> Skip to Portfolio
        </button>
      </div>
    </div>
  );
}

function App() {
  const [appPhase, setAppPhase] = useState<'name' | 'portrait' | 'portfolio'>('name');
  const [activeChapter, setActiveChapter] = useState('about');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (appPhase !== 'portfolio') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveChapter(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] },
    );
    chapters.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [appPhase]);

  useEffect(() => {
    if (appPhase !== 'portfolio') return;
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    }, 100);
    return () => revealObserver.disconnect();
  }, [appPhase]);

  const activeIndex = useMemo(() => chapters.findIndex((chapter) => chapter.id === activeChapter), [activeChapter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  return (
    <main className="site-shell">
      {appPhase === 'name' && (
        <IntroName onContinue={() => setAppPhase('portrait')} />
      )}
      
      {appPhase === 'portrait' && (
        <IntroPortrait onFinish={() => setAppPhase('portfolio')} />
      )}

      <div className={\`portfolio-container \${appPhase === 'portfolio' ? 'visible' : 'hidden'}\`}>
        <div className="chapter-progress" aria-hidden="true">
          <span style={{ height: \`\${Math.max(10, ((activeIndex + 1) / chapters.length) * 100)}%\` }} />
        </div>
        
        <header className={\`site-nav \${activeChapter === 'future' ? 'nav-light' : 'nav-dark'}\`}>
          <button className="brand-mark" onClick={() => scrollTo('about')} aria-label="Back to top">
            <span>NL</span><small>PORTFOLIO / 2026</small>
          </button>
          <button className="menu-toggle" onClick={() => setNavOpen((open) => !open)} aria-label="Toggle navigation">
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={navOpen ? 'nav-links open' : 'nav-links'}>
            {chapters.map((chapter) => (
              <button className={activeChapter === chapter.id ? 'active' : ''} key={chapter.id} onClick={() => scrollTo(chapter.id)}>
                {chapter.label}
              </button>
            ))}
          </nav>
          <a className="nav-contact" href="mailto:ngenzilevique@gmail.com">Get in touch <ArrowUpRight size={15} /></a>
        </header>

        ${aboutMatch ? aboutMatch[1] : ''}
        ${skillsMatch ? skillsMatch[1] : ''}
        ${expMatch ? expMatch[1] : ''}
        ${leadMatch ? leadMatch[1] : ''}
        ${projMatch ? projMatch[1] : ''}
        ${certMatch ? certMatch[1] : ''}
        ${futureMatch ? futureMatch[1] : ''}
        ${contactFooter}
      </div>
    </main>
  );
}

export default App;
`;

fs.writeFileSync('src/App.tsx', newApp, 'utf-8');
