const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const aboutMatch = content.match(/(<section id="about"[\s\S]*?<section id="skills")/);
if (aboutMatch) {
  console.log(aboutMatch[1].substring(0, 1000)); // Just get the start of the section to see its structure
}
