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

function App() {
  const [activeChapter, setActiveChapter] = useState('about');
  const [navOpen, setNavOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        
        if (visible) {
          if (visible.target.id === 'intro-name' || visible.target.id === 'intro-portrait') {
            setShowNav(false);
          } else {
            setShowNav(true);
            setActiveChapter(visible.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] },
    );

    document.querySelectorAll('section, footer').forEach((section) => observer.observe(section));
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    }, 100);
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const portraitObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && audioRef.current && !isPlaying) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
            console.warn('Autoplay blocked');
          });
        }
      },
      { threshold: 0.5 }
    );
    
    const portraitSection = document.getElementById('intro-portrait');
    if (portraitSection) portraitObserver.observe(portraitSection);
    
    return () => portraitObserver.disconnect();
  }, [isPlaying]);

  const activeIndex = useMemo(() => chapters.findIndex((chapter) => chapter.id === activeChapter), [activeChapter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  const handlePlayClick = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setAudioError(true));
    }
  };

  return (
    <main className="site-shell" style={{ overflowX: 'hidden' }}>
      
      {/* 1. Opening Screen - My Name */}
      <section id="intro-name" className="intro-name-section">
        <div className="intro-name-content" onClick={() => scrollTo('intro-portrait')}>
          <h1 className="intro-name-text reveal">Ngenzi<br /><span>Levique</span></h1>
          <p className="intro-hint reveal delay-three">
            Click or scroll to enter <ArrowDown size={17} />
          </p>
        </div>
      </section>
      
      {/* 2. My Portrait & Audio */}
      <section id="intro-portrait" className="intro-portrait-section">
        <div className="portrait-environment">
          <img 
            src="/images/portrait.png" 
            alt="Ngenzi Levique" 
            className={\`integrated-portrait reveal \${isPlaying ? 'speaking' : ''}\`} 
          />
          <div className="lip-sync-placeholder" aria-hidden="true" />
        </div>

        <div className="intro-controls">
          <audio 
            ref={audioRef} 
            src="/audio/introduction.m4a" 
            onPlay={() => setIsPlaying(true)}
            onEnded={() => setIsPlaying(false)}
            onError={() => setAudioError(true)}
          />
          
          {!isPlaying && !audioError && (
            <button className="control-btn pulse" onClick={handlePlayClick}>
              <Play size={18} /> Play Introduction
            </button>
          )}
        </div>
      </section>

      {/* 3. Main Portfolio */}
      <div className={\`portfolio-container \${showNav ? 'visible' : ''}\`}>
        <div className="chapter-progress" aria-hidden="true" style={{ opacity: showNav ? 1 : 0, transition: 'opacity 0.5s' }}>
          <span style={{ height: \`\${Math.max(10, ((activeIndex + 1) / chapters.length) * 100)}%\` }} />
        </div>
        
        <header className={\`site-nav \${activeChapter === 'future' ? 'nav-light' : 'nav-dark'}\`} style={{ opacity: showNav ? 1 : 0, pointerEvents: showNav ? 'auto' : 'none', transition: 'opacity 0.5s' }}>
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
