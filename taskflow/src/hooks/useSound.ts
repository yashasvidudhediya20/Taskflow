import { useCallback, useRef } from 'react';

type SoundType = 'complete' | 'create' | 'nav' | 'delete' | 'drop' | 'focus';

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'sine',
  startTime = 0,
  fadeStart?: number,
) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startTime + 0.01);
  const fs = fadeStart ?? (startTime + duration - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + fs + 0.05);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration + 0.06);
}

const SOUNDS: Record<SoundType, (ctx: AudioContext) => void> = {
  // Satisfying two-tone chord on task complete
  complete: (ctx) => {
    playTone(ctx, 523.25, 0.18, 0.12, 'sine', 0);       // C5
    playTone(ctx, 659.25, 0.18, 0.09, 'sine', 0.03);    // E5
    playTone(ctx, 783.99, 0.22, 0.07, 'sine', 0.07);    // G5
  },
  // Soft pop on create
  create: (ctx) => {
    playTone(ctx, 440, 0.08, 0.08, 'sine', 0);
    playTone(ctx, 554.37, 0.12, 0.07, 'sine', 0.05);    // C#5
  },
  // Ultra-soft click for nav
  nav: (ctx) => {
    playTone(ctx, 320, 0.06, 0.05, 'sine', 0);
  },
  // Descending soft tone for delete
  delete: (ctx) => {
    playTone(ctx, 392, 0.08, 0.06, 'sine', 0);
    playTone(ctx, 311.13, 0.1, 0.05, 'sine', 0.05);
  },
  // Light thud for drag drop
  drop: (ctx) => {
    playTone(ctx, 180, 0.12, 0.09, 'sine', 0);
    playTone(ctx, 220, 0.08, 0.05, 'sine', 0.01);
  },
  // Calm bell for focus session start
  focus: (ctx) => {
    playTone(ctx, 528, 0.5, 0.1, 'sine', 0);
    playTone(ctx, 660, 0.5, 0.07, 'sine', 0.1);
    playTone(ctx, 792, 0.6, 0.05, 'sine', 0.2);
  },
};

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((type: SoundType) => {
    if (!enabled) return;
    try {
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = createAudioContext();
      }
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      SOUNDS[type](ctx);
    } catch {
      // Silently ignore audio errors
    }
  }, [enabled]);

  return { play };
}
