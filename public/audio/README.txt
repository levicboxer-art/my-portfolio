# Voice introduction audio
introduction.mp3 is the single source of truth, loaded by
src/components/TalkingPortrait.tsx (line: src="/audio/introduction.mp3").

The transcript phrases (PHRASES) in TalkingPortrait.tsx are hand-timed to
THIS exact file (duration: 8.93 s). If you replace the audio, re-time the
PHRASES array and the fallback duration (8.93) in the component, otherwise
the transcript highlighting will silently drift.

introduction.m4a is an unused duplicate kept only as a backup copy.
