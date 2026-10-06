const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

const aboutReplaceRegex = /<section id="about" className="chapter-black chapter-padding">[\s\S]*?<div className="about-grid">/;

const newAboutHeader = `<section id="about" className="chapter-coral chapter-padding relative">
        {/* Hanging Tablet Layout */}
        <div className="hanging-tablet-wrapper reveal">
          <div className="hanging-cord-container">
            <div className="hanging-cord" />
            <div className="tablet-connector" />
            <div className="tablet-container">
              <img src="/images/portrait.png" alt="Ngenzi Levique" className="tablet-image" />
            </div>
          </div>
          
          <div className="about-text-container">
            <h2 className="about-hello">Hello!</h2>
            <p className="about-bio">
              Hi, my name is <strong>Ngenzi Levique</strong>, a Networking & Internet Technology graduate based in Kigali, dedicated to crafting clean, functional, and highly scalable technology solutions.
            </p>
            <div className="flex gap-6 mt-6 items-center">
               <div className="tech-icon-wrapper"><Network size={28} color="#e85d4e" /></div>
               <div className="tech-icon-wrapper"><Cloud size={28} color="#e85d4e" /></div>
               <div className="tech-icon-wrapper"><Cpu size={28} color="#e85d4e" /></div>
            </div>
          </div>
        </div>

        <div className="about-grid mt-32">`;

app = app.replace(aboutReplaceRegex, newAboutHeader);
fs.writeFileSync('src/App.tsx', app, 'utf-8');

let css = fs.readFileSync('src/index.css', 'utf-8');

const newStyles = `
/* Coral Chapter for About */
.chapter-coral {
  background-color: #e5534b; /* Vibrant coral red matching the screenshot */
  color: var(--cream);
  overflow: hidden;
}

/* Hanging Tablet Elements */
.hanging-tablet-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 80px;
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 100px;
}

.hanging-cord-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: gentle-swing 4s ease-in-out infinite alternate;
  transform-origin: top center;
}

.hanging-cord {
  width: 8px;
  height: 250px;
  background-color: #111;
  position: absolute;
  top: -250px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
}

.tablet-connector {
  width: 40px;
  height: 12px;
  background-color: #222;
  border-radius: 4px 4px 0 0;
  margin-bottom: -1px;
  z-index: 2;
}

.tablet-container {
  width: 320px;
  height: 420px;
  background-color: #111;
  border-radius: 24px;
  border: 14px solid #1a1a1a;
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.8),
    15px 20px 40px rgba(0,0,0,0.4);
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tablet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transform: scale(1.1); /* Zoom slightly into the portrait */
}

@keyframes gentle-swing {
  0% { transform: rotate(-3deg); }
  100% { transform: rotate(3deg); }
}

.about-text-container {
  flex: 1;
  max-width: 500px;
}

.about-hello {
  font-family: 'Manrope', sans-serif;
  font-size: 56px;
  font-weight: 800;
  color: var(--cream);
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.about-bio {
  font-size: 18px;
  line-height: 1.7;
  color: #fcebe9;
  font-weight: 400;
}

.about-bio strong {
  font-weight: 800;
  color: #ffffff;
}

.tech-icon-wrapper {
  width: 50px;
  height: 50px;
  background: var(--cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.tech-icon-wrapper:hover {
  transform: translateY(-5px) scale(1.1);
}

@media (max-width: 900px) {
  .hanging-tablet-wrapper {
    flex-direction: column;
    gap: 40px;
    padding-top: 150px;
  }
  .hanging-cord {
    height: 150px;
    top: -150px;
  }
  .tablet-container {
    width: 260px;
    height: 340px;
  }
  .about-text-container {
    text-align: center;
  }
  .flex.gap-6 {
    justify-content: center;
  }
}
`;

fs.writeFileSync('src/index.css', css + newStyles, 'utf-8');
