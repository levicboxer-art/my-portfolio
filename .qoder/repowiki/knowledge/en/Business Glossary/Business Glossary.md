---
kind: business_term
name: Business Glossary
category: business_term
scope:
    - '**'
---

### Talking Portrait
- Definition：The showpiece feature of the Levi portfolio: a canvas-rendered animation that warps a real photograph of Ngenzi Levique to lip-sync an 8.93s voice introduction, including per-row vertical deformation, per-column horizontal lip stretch/pucker, and a traveling-lid blink engine.

### phoneme/viseme timeline
- Definition：A hand-timed sequence of ~89 events mapping timestamps onto the MP3 audio track; each event drives a specific mouth shape (phoneme) and corresponding viseme state in the TalkingPortrait render loop. Changing the audio file without updating this timeline breaks lip-sync.
- Aliases：timeline

### face patches
- Definition：Photographic sub-images (open mouth, smile mouth, closed eyelid) composited over the base portrait on an offscreen canvas buffer before being warped into the final frame.
- Aliases：mouth patches、eyelid patch

### traveling lid
- Definition：The blink animation technique: a closed-eye photo is drawn as a moving 'lid' across the eye region with randomized timing, double-blink support, and speech-pause blinks, rather than a simple opacity toggle.
- Aliases：blink engine
