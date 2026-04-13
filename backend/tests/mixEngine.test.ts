import { buildTransitionPlan, computeTempoAdjustPercent, detectLoopWindow } from '../src/services/mixEngine';

describe('mixEngine', () => {
  it('caps tempo adjustment to safe range', () => {
    expect(computeTempoAdjustPercent(90, 140)).toBe(8);
    expect(computeTempoAdjustPercent(140, 90)).toBe(-8);
  });

  it('detects a loop window inside duration', () => {
    const loop = detectLoopWindow(180);
    expect(loop.start).toBeGreaterThanOrEqual(0);
    expect(loop.end).toBeGreaterThan(loop.start);
  });

  it('builds transition plan with crossfade duration', () => {
    const plan = buildTransitionPlan(
      { id: 1, title: 'A', filename: 'a.mp3', path: '/a', bpm: 120, duration: 180, createdAt: '' },
      { id: 2, title: 'B', filename: 'b.mp3', path: '/b', bpm: 128, duration: 200, createdAt: '' },
      10
    );

    expect(plan.crossfadeDurationMs).toBe(10000);
    expect(plan.toSongId).toBe(2);
  });
});
