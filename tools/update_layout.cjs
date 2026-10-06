const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the intro-portrait section in App.tsx
const portraitSectionRegex = /<section id="intro-portrait" className="intro-portrait-section">[\s\S]*?<\/section>/;
const newPortraitSection = `<section id="intro-portrait" className="intro-portrait-section">
        <div className="portrait-environment">
          <img 
            src="/images/portrait.png" 
            alt="Ngenzi Levique" 
            className={\`integrated-portrait reveal \${isPlaying ? 'speaking' : ''}\`} 
          />
          <div className="lip-sync-placeholder" aria-hidden="true" />
        </div>

        <div className="transcript-container reveal delay-three">
          <h2 className="transcript-text">
            “Hi, my name is Ngenzi Levique.<br/>
            <span className="text-highlight">Welcome to my portfolio website.</span>”
          </h2>
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
        </div>
      </section>`;

app = app.replace(portraitSectionRegex, newPortraitSection);
fs.writeFileSync('src/App.tsx', app, 'utf-8');

// Now update CSS
let css = fs.readFileSync('src/index.css', 'utf-8');
const portraitCssRegex = /\.intro-portrait-section \{[\s\S]*?(?=\.portfolio-container \{)/;

const newPortraitCss = `.intro-portrait-section {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  background: #5c3a21;
  padding-left: 30px;
  padding-right: 30px;
  gap: 40px;
}

.portrait-environment {
  position: relative;
  width: 50%;
  height: 85vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.integrated-portrait {
  width: 100%;
  max-width: 650px;
  object-fit: contain;
  object-position: bottom left;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  filter: contrast(1.02) drop-shadow(0 20px 40px rgba(0,0,0,0.15));
  transition: transform 0.3s ease;
}

.integrated-portrait.speaking {
  animation: subtle-breathe 2s ease-in-out infinite alternate;
}

@keyframes subtle-breathe {
  from { transform: scale(1); }
  to { transform: scale(1.01); }
}

.transcript-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding-bottom: 10vh;
}

.transcript-text {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 4vw, 56px);
  color: var(--cream);
  line-height: 1.3;
  margin-bottom: 40px;
}

.transcript-text .text-highlight {
  color: #d1bca6;
  font-style: italic;
}

.intro-controls {
  display: flex;
  gap: 20px;
  z-index: 10;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: var(--ink);
  color: var(--cream);
  border: none;
  border-radius: 30px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.control-btn.pulse {
  animation: pulse-btn-light 2s infinite;
}

@keyframes pulse-btn-light {
  0% { box-shadow: 0 0 0 0 rgba(22, 20, 19, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(22, 20, 19, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 20, 19, 0); }
}

@media (max-width: 900px) {
  .intro-portrait-section {
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 20px;
    padding-right: 20px;
  }
  .portrait-environment, .transcript-container {
    width: 100%;
  }
  .transcript-container {
    height: auto;
    padding-bottom: 40px;
    align-items: center;
    text-align: center;
  }
}

`;

css = css.replace(portraitCssRegex, newPortraitCss);
fs.writeFileSync('src/index.css', css, 'utf-8');
