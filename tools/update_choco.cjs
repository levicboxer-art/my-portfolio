const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace the background of intro-portrait-section
css = css.replace(
  /(\.intro-portrait-section \{[\s\S]*?background:\s*)(.*?)(;[\s\S]*?\})/,
  '$1#3E2723$3' // Rich dark chocolate color
);

// We also need to update the secondary button colors if they are inside the dark section
// Actually, I can just add a specific rule for intro-controls inside intro-portrait-section
const overrides = `
.intro-portrait-section .control-btn.secondary {
  color: var(--cream);
  border-color: rgba(239, 233, 223, 0.3);
}
.intro-portrait-section .control-btn.secondary:hover {
  background: rgba(239, 233, 223, 0.1);
}
`;

fs.writeFileSync('src/index.css', css + overrides, 'utf-8');
