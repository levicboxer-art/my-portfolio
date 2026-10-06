import React, { useRef, useState, useMemo } from 'react';

/**
 * PORTRAIT + INTRODUCTION
 *
 * The portrait is the original photograph, shown naturally and untouched —
 * no facial animation, no overlays, no warping. What remains is the recorded
 * introduction: a simple audio player with a transcript that highlights each
 * phrase as it is spoken.
 */

// Spoken phrases for synchronized transcript display
interface TranscriptPhrase {
  id: number;
  text: string;
  start: number;
  end: number;
}

const PHRASES: TranscriptPhrase[] = [
  { id: 1, text: "Hi, I'm Ngenzi Levique.", start: 0.28, end: 2.32 },
  { id: 2, text: "Welcome to my portfolio.", start: 2.54, end: 3.92 },
  { id: 3, text: "I'm passionate about technology, innovation,", start: 4.20, end: 6.06 },
  { id: 4, text: "and creating solutions that make a difference.", start: 6.24, end: 8.92 },
];

export const TalkingPortrait: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded,  setHasEnded]  = useState(false);
  const [duration,  setDuration]  = useState(8.93);
  const [progress,  setProgress]  = useState(0);
  // Portrait image readiness: drives the loading / error overlay
  const [assetState, setAssetState] = useState<'loading' | 'ready' | 'error'>('loading');

  // Active phrase index
  const activePhraseId = useMemo(() => {
    const found = PHRASES.find(p => progress >= p.start && progress <= p.end);
    return found ? found.id : (progress > 0 && progress < 8.92 ? 1 : 0);
  }, [progress]);

  // ── Audio Controls ────────────────────────────────────────────────────────
  const handlePlay = async () => {
    if (!audioRef.current) return;
    if (hasEnded) {
      audioRef.current.currentTime = 0;
      setHasEnded(false);
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleReplay = async () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setHasEnded(false);
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn('Replay error:', e);
    }
  };

  return (
    <div className="tp-container">
      {/* ── Portrait — the original photograph, natural ── */}
      <div className="tp-canvas-wrap">
        <img
          src="/images/portrait.webp"
          alt="Ngenzi Levique"
          className={`tp-canvas${isPlaying ? ' tp-is-talking' : ''}`}
          onLoad={() => setAssetState('ready')}
          onError={() => setAssetState('error')}
          draggable={false}
        />
        <div className="tp-ambient" aria-hidden="true" />
        {assetState !== 'ready' && (
          <div className="tp-asset-status" role="status">
            {assetState === 'error'
              ? 'The portrait could not be loaded — please check your connection and refresh.'
              : 'Loading portrait…'}
          </div>
        )}
      </div>

      {/* ── Introduction Speech & Interface Panel ── */}
      <div className="tp-panel">

        {/* Live Status Badge */}
        <div className="tp-status-row">
          <span className={`tp-dot${isPlaying ? ' tp-dot--live' : ''}`} />
          <span className="tp-status-label">
            {isPlaying ? 'Speaking live' : hasEnded ? 'Introduction completed' : 'Portrait'}
          </span>
          <span className="tp-time">{audioRef.current ? `${progress.toFixed(1)}s / ${duration.toFixed(1)}s` : ''}</span>
        </div>

        {/* Synchronized Live Speech Transcript */}
        <div className="tp-transcript-box" aria-live="polite">
          <div className="tp-transcript-lead">Personal Introduction</div>
          <div className="tp-transcript-body">
            {PHRASES.map((phrase) => {
              const isActive = activePhraseId === phrase.id;
              const isPast   = progress > phrase.end;
              return (
                <span
                  key={phrase.id}
                  className={`tp-phrase${isActive ? ' tp-phrase--active' : ''}${isPast ? ' tp-phrase--spoken' : ''}`}
                >
                  {phrase.text}{' '}
                </span>
              );
            })}
          </div>
        </div>

        {/* Click-to-seek Progress Bar */}
        <div
          className="tp-bar-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={duration}
          onClick={(e) => {
            if (!audioRef.current) return;
            const r = e.currentTarget.getBoundingClientRect();
            const t = Math.max(0, Math.min(duration, ((e.clientX - r.left) / r.width) * duration));
            audioRef.current.currentTime = t;
            // Seeking after playback finished returns the UI to the idle state
            if (hasEnded) setHasEnded(false);
          }}
        >
          <div className="tp-bar-fill" style={{ width: `${(progress / duration) * 100}%` }} />
        </div>

        {/* Action Controls */}
        <div className="tp-btns">
          {hasEnded ? (
            <button className="tp-btn tp-btn--primary" onClick={handleReplay}>
              ↺ Replay Introduction
            </button>
          ) : isPlaying ? (
            <button className="tp-btn tp-btn--primary" onClick={handlePause}>
              ⏸ Pause
            </button>
          ) : (
            <button className="tp-btn tp-btn--primary tp-btn--pulse" onClick={handlePlay}>
              ▶ Play Introduction
            </button>
          )}
        </div>
      </div>

      {/* Hidden authoritative audio element */}
      <audio
        ref={audioRef}
        src="/audio/introduction.mp3"
        preload="auto"
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration || 8.93);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setProgress(audioRef.current.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setHasEnded(true);
        }}
      />
    </div>
  );
};

export default TalkingPortrait;
