const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// The appended CSS starts at .intro-name-screen
const splitIndex = css.indexOf('.intro-name-screen {');
if (splitIndex !== -1) {
    css = css.substring(0, splitIndex);
}

const newCss = `
.intro-name-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  color: var(--ink);
  z-index: 50;
  cursor: pointer;
  transition: opacity 1s ease-in-out;
}

.intro-name-text {
  text-align: center;
  font-size: clamp(68px, 10.5vw, 158px);
  text-transform: uppercase;
  font-weight: 800;
  line-height: 0.84;
  letter-spacing: -.08em;
  animation: fade-in-up 1.5s ease-out forwards;
}

.intro-name-text span {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #8c7b6c;
}

.intro-hint {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #66564a;
  font-size: 14px;
  animation: pulse-hint 2s infinite;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-hint {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.intro-portrait-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: radial-gradient(circle at 50% 50%, #ffffff 0%, var(--cream) 80%);
  z-index: 40;
}

.portrait-environment {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.integrated-portrait {
  width: 100%;
  max-width: 700px;
  object-fit: contain;
  object-position: bottom;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
  filter: contrast(1.02) drop-shadow(0 20px 40px rgba(0,0,0,0.15));
  transition: transform 0.3s ease;
  animation: fade-in-scale 1.5s ease-out forwards;
}

.integrated-portrait.speaking {
  animation: subtle-breathe 2s ease-in-out infinite alternate;
}

@keyframes fade-in-scale {
  from { opacity: 0; transform: scale(1.05) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes subtle-breathe {
  from { transform: scale(1); }
  to { transform: scale(1.01); }
}

.intro-controls {
  position: absolute;
  bottom: 40px;
  display: flex;
  gap: 20px;
  z-index: 50;
  animation: fade-in-up 1s ease-out 1s forwards;
  opacity: 0;
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

.control-btn.secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid rgba(22, 20, 19, 0.2);
}

.control-btn.secondary:hover {
  background: rgba(22, 20, 19, 0.05);
}

.portfolio-container {
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease-in-out, visibility 1s ease-in-out;
  position: absolute;
  inset: 0;
}

.portfolio-container.visible {
  opacity: 1;
  visibility: visible;
  position: relative;
}

.audio-error-msg {
  position: absolute;
  bottom: -30px;
  color: #ff6b6b;
  font-size: 12px;
  white-space: nowrap;
}
`;

fs.writeFileSync('src/index.css', css + newCss, 'utf-8');
