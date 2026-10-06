const fs = require('fs');

// Read only the BASE CSS (before any intro additions) — up to intro-name-screen or intro-curtain
let css = fs.readFileSync('src/index.css', 'utf-8');
const cutMarker = css.indexOf('.intro-curtain {');
const cutMarker2 = css.indexOf('.intro-name-section {');
const cut = Math.min(
  cutMarker !== -1 ? cutMarker : Infinity,
  cutMarker2 !== -1 ? cutMarker2 : Infinity
);
const baseCss = cut !== Infinity ? css.substring(0, cut) : css;

const addedCss = `
/* -----------------------------------------------
   CURTAIN — Landing Screen
----------------------------------------------- */
.intro-curtain {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  cursor: pointer;
  transform-origin: top center;
  transition:
    transform 1.3s cubic-bezier(0.77, 0, 0.175, 1),
    opacity   1.3s cubic-bezier(0.77, 0, 0.175, 1);
  overflow: hidden;
}
.intro-curtain.unfolded {
  transform: perspective(2400px) rotateX(100deg) translateY(-20px);
  opacity: 0;
  pointer-events: none;
}

/* Animated subtle particles */
.curtain-particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(140,123,108,0.18);
  animation: float-particle 8s ease-in-out infinite alternate;
}
.p-0  { width: 260px; height: 260px; top: -60px; left: -80px; animation-delay: 0s; }
.p-1  { width: 180px; height: 180px; top: 60%;  right: -40px; animation-delay: 1s; }
.p-2  { width: 100px; height: 100px; top: 30%;  left: 12%;    animation-delay: 2s; }
.p-3  { width: 140px; height: 140px; bottom:-40px; left: 35%; animation-delay: 0.5s; }
.p-4  { width:  80px; height:  80px; top: 15%;  right: 20%;   animation-delay: 3s; }
.p-5  { width: 200px; height: 200px; bottom: 10%;right: -60px; animation-delay: 1.5s; }

@keyframes float-particle {
  0%   { transform: translateY(0) scale(1); opacity: 0.5; }
  100% { transform: translateY(-40px) scale(1.12); opacity: 1; }
}

.curtain-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #8c7b6c;
  margin-bottom: 28px;
  display: block;
  text-align: center;
}
.intro-name-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}
.intro-name-text {
  text-align: center;
  font-size: clamp(72px, 11vw, 164px);
  text-transform: uppercase;
  font-weight: 800;
  line-height: 0.82;
  letter-spacing: -0.08em;
  color: var(--ink);
  transform: translateZ(50px);
}
.intro-name-text em {
  font-style: normal;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: #8c7b6c;
}
.curtain-tagline {
  margin-top: 24px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #8c7b6c;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.intro-hint {
  margin-top: 52px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #66564a;
  font-size: 13px;
  font-family: 'DM Mono', monospace;
  animation: pulse-hint 2.4s ease-in-out infinite;
  transform: translateZ(20px);
}
@keyframes pulse-hint {
  0%, 100% { opacity: 0.45; }
  50%       { opacity: 1; }
}

/* -----------------------------------------------
   PORTRAIT SECTION
----------------------------------------------- */
.intro-portrait-section {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  background: #5c3a21;
  padding-right: 60px;
  overflow: hidden;
  position: relative;
}

.portrait-side {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  padding-left: 30px; /* exactly 30px from the left */
  height: 92vh;
}

.integrated-portrait {
  height: 100%;
  width: auto;
  max-width: 55vw;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  filter: drop-shadow(30px 0 60px rgba(0,0,0,0.35));
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
  animation: portrait-enter 1.4s cubic-bezier(0.165,0.84,0.44,1) forwards;
  opacity: 0;
}
@keyframes portrait-enter {
  0%   { opacity: 0; transform: translateX(-40px) scale(0.97); }
  100% { opacity: 1; transform: translateX(0)     scale(1); }
}
.integrated-portrait.speaking {
  animation: portrait-enter 1.4s cubic-bezier(0.165,0.84,0.44,1) forwards,
             subtle-breathe 2.8s ease-in-out 1.5s infinite alternate;
}
@keyframes subtle-breathe {
  from { transform: scale(1); }
  to   { transform: scale(1.015); }
}

/* Transcript: starts aligned to the bottom 25px lower than laptop end */
.transcript-side {
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-bottom: 10vh;
  /* The 25px drop requested */
  transform: translateY(25px);
}
.transcript-inner {
  max-width: 420px;
}
.transcript-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #b9907a;
  margin-bottom: 20px;
}
.transcript-quote {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 3.2vw, 46px);
  line-height: 1.35;
  color: var(--cream);
  font-style: italic;
  margin: 0 0 36px;
  border: none;
  padding: 0;
}
.transcript-quote strong {
  font-style: normal;
  color: #ffffff;
  font-weight: 700;
}
.transcript-quote span {
  color: #d1b9a8;
}

/* Play button */
.control-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 28px;
  background: var(--cream);
  color: var(--ink);
  border: none;
  border-radius: 40px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s ease;
}
.control-btn:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 14px 28px rgba(0,0,0,0.2);
}
.control-btn.pulse {
  animation: pulse-cream 2.2s ease-in-out infinite;
}
@keyframes pulse-cream {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,233,223,0.5); }
  60%       { box-shadow: 0 0 0 12px rgba(239,233,223,0); }
}

/* Waveform */
.waveform {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  margin-top: 4px;
}
.waveform span {
  width: 4px;
  background: var(--cream);
  border-radius: 2px;
  animation: wave-bar 1.1s ease-in-out infinite alternate;
}
.waveform span:nth-child(1) { animation-delay: 0s;    height: 14px; }
.waveform span:nth-child(2) { animation-delay: 0.15s; height: 22px; }
.waveform span:nth-child(3) { animation-delay: 0.30s; height: 30px; }
.waveform span:nth-child(4) { animation-delay: 0.45s; height: 22px; }
.waveform span:nth-child(5) { animation-delay: 0.60s; height: 14px; }
@keyframes wave-bar {
  0%   { transform: scaleY(0.4); opacity: 0.6; }
  100% { transform: scaleY(1);   opacity: 1; }
}

/* -----------------------------------------------
   PORTFOLIO CONTAINER
----------------------------------------------- */
.portfolio-container {
  position: relative;
  width: 100%;
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
}
.portfolio-container.visible {
  opacity: 1;
  pointer-events: auto;
}

/* -----------------------------------------------
   ABOUT — Coral + Hanging Tablet
----------------------------------------------- */
.chapter-coral {
  background: #e5534b;
  color: var(--cream);
}

.hanging-scene {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: 80px;
  padding-top: 80px;
  margin-bottom: 80px;
  position: relative;
}

/* Wire from top of screen */
.hanging-wire-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: gentle-sway 5s ease-in-out infinite alternate;
  transform-origin: top center;
}
@keyframes gentle-sway {
  0%   { transform: rotate(-2.5deg); }
  100% { transform: rotate(2.5deg); }
}
.hanging-wire {
  width: 6px;
  height: 200px;
  background: linear-gradient(to bottom, #0a0a0a, #2a2a2a);
  position: absolute;
  top: -200px;
  border-radius: 3px;
  box-shadow: 2px 0 8px rgba(0,0,0,0.3);
}
.hanging-clip {
  width: 36px;
  height: 10px;
  background: #1a1a1a;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.tablet-frame {
  width: 300px;
  height: 390px;
  background: #111;
  border-radius: 22px;
  border: 12px solid #1c1c1c;
  box-shadow:
    inset 0 0 30px rgba(0,0,0,0.7),
    0 30px 60px rgba(0,0,0,0.4),
    0 0 0 1px rgba(255,255,255,0.04);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tablet-face {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transform: scale(1.12);
  transition: transform 0.5s ease;
}
.tablet-frame:hover .tablet-face { transform: scale(1.18); }

.about-greeting {
  flex: 1;
  max-width: 480px;
  padding-bottom: 30px;
}
.about-hello {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(44px, 5.5vw, 72px);
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}
.about-bio {
  font-size: 17px;
  line-height: 1.75;
  color: rgba(239,233,223,0.85);
}
.about-bio strong { font-weight: 800; color: #fff; }

.about-icons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
}
.icon-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 40px;
  font-size: 13px;
  font-family: 'DM Mono', monospace;
  color: var(--cream);
  cursor: default;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}
.icon-pill:hover {
  background: rgba(255,255,255,0.22);
  transform: translateY(-3px);
}

/* -----------------------------------------------
   REVEAL ANIMATIONS
----------------------------------------------- */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.85s cubic-bezier(0.165,0.84,0.44,1),
              transform 0.85s cubic-bezier(0.165,0.84,0.44,1);
}
.reveal.delay-one   { transition-delay: 0.15s; }
.reveal.delay-two   { transition-delay: 0.30s; }
.reveal.delay-three { transition-delay: 0.45s; }
.reveal.is-visible  { opacity: 1; transform: translateY(0); }

/* -----------------------------------------------
   RESPONSIVE
----------------------------------------------- */
@media (max-width: 900px) {
  .intro-portrait-section {
    flex-direction: column;
    align-items: center;
    padding-right: 0;
    padding-bottom: 50px;
  }
  .portrait-side {
    padding-left: 0;
    height: 55vh;
    justify-content: center;
  }
  .integrated-portrait { max-width: 90vw; }
  .transcript-side {
    transform: translateY(0);
    padding: 0 24px 40px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .transcript-quote { font-size: 26px; }

  .hanging-scene {
    flex-direction: column;
    align-items: center;
    padding-top: 180px;
    gap: 40px;
  }
  .hanging-wire { height: 120px; top: -120px; }
  .tablet-frame { width: 240px; height: 310px; }
  .about-greeting { text-align: center; }
  .about-icons { justify-content: center; }
}
`;

fs.writeFileSync('src/index.css', baseCss + addedCss, 'utf-8');
