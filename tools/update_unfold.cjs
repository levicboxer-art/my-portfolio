const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add isUnfolded state and overflow logic
app = app.replace(
  /const \[nameOffset, setNameOffset\] = useState\(\{ x: 0, y: 0 \}\);/,
  `const [nameOffset, setNameOffset] = useState({ x: 0, y: 0 });\n  const [isUnfolded, setIsUnfolded] = useState(false);\n\n  useEffect(() => {\n    if (!isUnfolded) {\n      document.body.style.overflow = 'hidden';\n      const handleWheel = (e: WheelEvent) => {\n        if (e.deltaY > 0) setIsUnfolded(true);\n      };\n      window.addEventListener('wheel', handleWheel);\n      return () => {\n        document.body.style.overflow = '';\n        window.removeEventListener('wheel', handleWheel);\n      };\n    } else {\n      setTimeout(() => {\n        document.body.style.overflow = '';\n      }, 1200);\n    }\n  }, [isUnfolded]);`
);

// 2. Replace intro-name-section with intro-curtain
const introRegex = /<section id="intro-name" className="intro-name-section"[\s\S]*?<\/section>/;
const newIntro = `<div 
        className={\`intro-curtain \${isUnfolded ? 'unfolded' : ''}\`}
        onClick={() => setIsUnfolded(true)}
        onMouseMove={handleNameMouseMove} 
        onMouseLeave={handleNameMouseLeave}
      >
        <div 
          className="intro-name-content" 
          style={{ 
            transform: \`perspective(1000px) rotateY(\${nameOffset.x}deg) rotateX(\${-nameOffset.y}deg)\`, 
            transition: nameOffset.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s linear', 
            transformStyle: 'preserve-3d' 
          }}
        >
          <h1 className="intro-name-text reveal">Ngenzi<br /><span>Levique</span></h1>
          <p className="intro-hint reveal delay-three">
            Click or scroll to unfold <ArrowDown size={17} />
          </p>
        </div>
      </div>`;

app = app.replace(introRegex, newIntro);
fs.writeFileSync('src/App.tsx', app, 'utf-8');

let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace .intro-name-section css with .intro-curtain
css = css.replace(
  /\.intro-name-section \{[\s\S]*?cursor: pointer;\n\}/,
  `.intro-curtain {
  position: absolute;
  top: 0; left: 0; right: 0; height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  color: var(--ink);
  cursor: pointer;
  z-index: 100;
  transform-origin: top center;
  transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 1.2s ease-in-out;
  backface-visibility: hidden;
}

.intro-curtain.unfolded {
  transform: perspective(2000px) rotateX(100deg);
  opacity: 0;
  pointer-events: none;
}`
);

// Lower the transcript text by 25px
css = css.replace(
  /\.transcript-text \{/,
  `.transcript-text {\n  transform: translateY(25px);`
);

fs.writeFileSync('src/index.css', css, 'utf-8');
