const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add state for name hover
app = app.replace(
  /const \[showNav, setShowNav\] = useState\(false\);/,
  `const [showNav, setShowNav] = useState(false);\n  const [nameOffset, setNameOffset] = useState({ x: 0, y: 0 });\n\n  const handleNameMouseMove = (e: MouseEvent<HTMLElement>) => {\n    const { clientX, clientY } = e;\n    const { innerWidth, innerHeight } = window;\n    setNameOffset({\n      x: ((clientX / innerWidth) - 0.5) * 20,\n      y: ((clientY / innerHeight) - 0.5) * 20,\n    });\n  };\n\n  const handleNameMouseLeave = () => {\n    setNameOffset({ x: 0, y: 0 });\n  };`
);

// 2. Add event listeners to intro-name-section
app = app.replace(
  /<section id="intro-name" className="intro-name-section">/,
  `<section id="intro-name" className="intro-name-section" onMouseMove={handleNameMouseMove} onMouseLeave={handleNameMouseLeave}>`
);

// 3. Add transform to intro-name-content
app = app.replace(
  /<div className="intro-name-content" onClick=\{\(\) => scrollTo\('intro-portrait'\)\}>/,
  `<div className="intro-name-content" onClick={() => scrollTo('intro-portrait')} style={{ transform: \`perspective(1000px) rotateY(\${nameOffset.x}deg) rotateX(\${-nameOffset.y}deg)\`, transition: nameOffset.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s linear', transformStyle: 'preserve-3d' }}>`
);

// 4. Update the transcript text to have some animation classes
app = app.replace(
  /className="transcript-text"/,
  `className="transcript-text text-reveal-anim"`
);

fs.writeFileSync('src/App.tsx', app, 'utf-8');

let css = fs.readFileSync('src/index.css', 'utf-8');

// Update portrait layout to be closer to the laptop
const cssUpdateRegex = /\.portrait-environment \{[\s\S]*?\.transcript-container \{[\s\S]*?padding-bottom: 10vh;\n\}/;
const newCssLayout = `.portrait-environment {
  position: relative;
  flex: 0 0 auto;
  width: auto; /* Let the image dictate the width */
  height: 85vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.integrated-portrait {
  width: auto;
  height: 100%;
  max-width: 60vw; /* Don't overflow the screen */
  object-fit: contain;
  object-position: bottom left;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  filter: contrast(1.02) drop-shadow(0 20px 40px rgba(0,0,0,0.15));
  transition: transform 0.3s ease;
}

.transcript-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding-bottom: 15vh;
  padding-left: 20px; /* Space exactly next to the laptop */
}`;

css = css.replace(cssUpdateRegex, newCssLayout);

// Add animations
css += `
.text-reveal-anim {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  animation: reveal-text 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes reveal-text {
  0% { transform: translateY(100px); opacity: 0; clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0% 100%); }
  100% { transform: translateY(0); opacity: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}

.intro-name-text {
  /* Ensure it pops in 3D */
  transform: translateZ(50px);
}

.intro-hint {
  transform: translateZ(20px);
}

/* Subtle magnetic hover effect for all buttons in portfolio */
button {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
button:hover {
  transform: scale(1.05);
}

.reveal.is-visible {
  animation: fade-in-up 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Interactive elements polish */
.site-shell {
  scroll-behavior: smooth;
}
`;

fs.writeFileSync('src/index.css', css, 'utf-8');
