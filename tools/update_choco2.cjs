const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace the background of intro-portrait-section
css = css.replace(
  /(\.intro-portrait-section \{[\s\S]*?background:\s*)(.*?)(;[\s\S]*?\})/,
  '$1#5c3a21$3' // Warm rich chocolate
);

fs.writeFileSync('src/index.css', css, 'utf-8');
