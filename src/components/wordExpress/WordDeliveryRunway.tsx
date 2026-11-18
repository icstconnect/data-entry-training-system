import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Flame, Sparkles, Check, ArrowRight, ArrowDown } from 'lucide-react';
import { CarrierTier } from '../../types/wordExpress';
import { TypingTheme } from '../../types/touchTyping';
import { getNextCarrierTier } from '../../data/wordExpressData';
import { DeliveryCarrierSVG } from './DeliveryCarrierSVG';

export interface DepartingDeliveryItem {
  uid: number;
  word: string;
  carrier: CarrierTier;
}

export interface FleetDowngradeEvent {
  tick: number;
  fromName: string;
  toCarrier: CarrierTier;
}

export interface WordDeliveryRunwayProps {
  currentWord: string;
  wordIndex: number;
  totalWords: number;
  letterIndex: number;
  nextWord: string | null;
  upcomingWordAfterNext: string | null;
  /** Carrier locked to the current center word (never changes mid-word) */
  centerCarrier: CarrierTier;
  /** Carrier waiting in the left queue for the NEXT word (downgrades on wrong key, upgrades on streak) */
  nextCarrier: CarrierTier;
  departingItems: DepartingDeliveryItem[];
  streak: number;
  isError: boolean;
  /** Incremented on every wrong keystroke to trigger crisp center vibration */
  errorVibrationTick: number;
  /** Fired whenever a wrong key downgrades the next fleet to the previous tier */
  downgradeEvent: FleetDowngradeEvent | null;
  beamCenterPct: number;
  theme: TypingTheme;
}

interface DepartingUnitProps {
  item: DepartingDeliveryItem;
}

const DepartingUnit: React.FC<DepartingUnitProps> = ({ item }) => {
  const unitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = unitRef.current;
    if (!el) return;

    const anim = animate(el, {
      translateX: [0, 440],
      translateY: [0, item.carrier.trackTheme === 'sky' || item.carrier.trackTheme === 'space' ? -16 : 0],
      opacity: [1, 1, 0],
      scale: [1, 1.05],
      duration: item.carrier.exitMs,
      ease: 'inCubic'
    });

    return () => {
      anim.pause();
    };
  }, [item]);

  return (
    <div ref={unitRef} className="we-departing-unit" aria-hidden="true">
      <div
        className="we-word-parcel is-delivered"
        style={{ borderColor: '#10b981', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)' }}
      >
        <Check size={13} color="#10b981" strokeWidth={3} />
        <span>{item.word}</span>
      </div>
      <div className="we-carrier-wrap">
        <span
          className="we-speed-trail"
          style={{ background: `linear-gradient(90deg, transparent, ${item.carrier.accent})` }}
        />
        <DeliveryCarrierSVG carrierId={item.carrier.id} accent={item.carrier.accent} size={74} boosted />
      </div>
    </div>
  );
};

export const WordDeliveryRunway: React.FC<WordDeliveryRunwayProps> = ({
  currentWord,
  wordIndex,
  totalWords,
  letterIndex,
  nextWord,
  upcomingWordAfterNext,
  centerCarrier,
  nextCarrier,
  departingItems,
  streak,
  isError,
  errorVibrationTick,
  downgradeEvent,
  beamCenterPct,
  theme
}) => {
  const isDark = theme === 'dark';
  const activeUnitRef = useRef<HTMLDivElement | null>(null);
  const centerVibrationRef = useRef<HTMLDivElement | null>(null);
  const queueUnitRef = useRef<HTMLDivElement | null>(null);
  const queueCarrierRef = useRef<HTMLDivElement | null>(null);
  const downgradePillRef = useRef<HTMLDivElement | null>(null);
  const tierBadgeRef = useRef<HTMLDivElement | null>(null);

  // Keep latest enterMs in a ref so entrance animation ONLY fires when wordIndex changes
  const enterMsRef = useRef<number>(centerCarrier.enterMs);
  enterMsRef.current = centerCarrier.enterMs;

  // 1. Center Fleet Left-to-Center Glide: ONLY when a brand-new word arrives (wordIndex changes)
  useEffect(() => {
    const el = activeUnitRef.current;
    if (!el) return;

    const anim = animate(el, {
      translateX: [-230, 0],
      scale: [0.84, 1],
      opacity: [0.45, 1],
      duration: enterMsRef.current,
      ease: 'outCubic'
    });

    return () => {
      anim.pause();
    };
  }, [wordIndex]);

  // 2. Left Queue Entrance: ONLY when a new upcoming word enters the queue (wordIndex changes)
  useEffect(() => {
    const el = queueUnitRef.current;
    if (!el || !nextWord) return;

    const anim = animate(el, {
      translateX: [-120, 0],
      opacity: [0, 0.94],
      duration: 200,
      ease: 'outCubic'
    });

    return () => {
      anim.pause();
    };
  }, [wordIndex, nextWord]);

  // 3. Visual Vibration on Wrong Key Press (Center Fleet stays firmly locked at center!)
  useEffect(() => {
    if (errorVibrationTick === 0) return;
    const el = centerVibrationRef.current;
    if (!el) return;

    const anim = animate(el, {
      translateX: [-8, 8, -7, 7, -5, 5, -2, 2, 0],
      translateY: [-2, 2, -2, 1, 0],
      rotate: [-2.2, 2.2, -1.6, 1.6, -0.8, 0.8, 0],
      duration: 300,
      ease: 'inOutQuad'
    });

    return () => {
      anim.pause();
    };
  }, [errorVibrationTick]);

  // 4. Next Fleet Downgrade Animation (Left Queue visibly steps down to previous fleet!)
  useEffect(() => {
    if (!downgradeEvent) return;
    const carrierEl = queueCarrierRef.current;
    const pillEl = downgradePillRef.current;

    const animations: Array<{ pause: () => void }> = [];

    if (carrierEl) {
      animations.push(
        animate(carrierEl, {
          translateX: [16, -10, 4, 0],
          scale: [1.15, 0.82, 1.04, 1],
          rotate: [-6, 4, 0],
          duration: 380,
          ease: 'outBack'
        })
      );
    }

    if (pillEl) {
      animations.push(
        animate(pillEl, {
          translateY: [8, -4, -10],
          opacity: [0, 1, 1, 0],
          duration: 1100,
          ease: 'outCubic'
        })
      );
    }

    return () => {
      animations.forEach(a => a.pause());
    };
  }, [downgradeEvent]);

  // 5. Tier Badge Pop when live streak tier changes
  useEffect(() => {
    const el = tierBadgeRef.current;
    if (!el) return;

    const anim = animate(el, {
      scale: [0.9, 1.08, 1],
      duration: 280,
      ease: 'outBack'
    });

    return () => {
      anim.pause();
    };
  }, [nextCarrier.tier]);

  // HUD reflects current live streak tier (what the next fleet is set to) while center displays the locked carrier
  const liveTier = nextCarrier;
  const nextUpgradeTier = getNextCarrierTier(liveTier.tier);
  const tierProgressPct = nextUpgradeTier
    ? Math.min(
      100,
      Math.max(
        0,
        Math.round(
          ((streak - liveTier.minStreak) / Math.max(1, nextUpgradeTier.minStreak - liveTier.minStreak)) * 100
        )
      )
    )
    : 100;
  const remainingForNextTier = nextUpgradeTier ? Math.max(1, nextUpgradeTier.minStreak - streak) : 0;

  return (
    <div
      className={`we-runway-shell track-${centerCarrier.trackTheme} ${isDark ? 'is-dark' : 'is-light'} ${isError ? 'has-impact' : ''}`}
      style={{ '--carrier-accent': centerCarrier.accent, '--carrier-glow': centerCarrier.glow } as React.CSSProperties}
    >
      {/* Top Runway Telemetry Strip: Live Fleet Tier + Streak Upgrade Bar + Word Queue Counter */}
      <div className="we-runway-hud">
        <div ref={tierBadgeRef} className="we-carrier-badge" style={{ borderColor: liveTier.accent }}>
          <span className="we-tier-num" style={{ background: liveTier.accent }}>
            T{liveTier.tier}/16
          </span>
          <span className="we-tier-name">{liveTier.name}</span>
          <span className="we-tier-speed">{liveTier.speedTag}</span>
        </div>

        <div className="we-streak-upgrade-box">
          <div className="we-streak-meta">
            <span className="we-streak-pill">
              <Flame size={12} color="#f59e0b" />
              <span>Streak {streak}</span>
            </span>
            {nextUpgradeTier ? (
              <span className="we-next-tier-hint">
                <ArrowRight size={11} />
                <span>{nextUpgradeTier.name} in {remainingForNextTier}</span>
              </span>
            ) : (
              <span className="we-next-tier-hint is-max">
                <Sparkles size={11} />
                <span>MAX TIER • UFO 3!</span>
              </span>
            )}
          </div>
          <div className="we-tier-progress-track">
            <div
              className="we-tier-progress-fill"
              style={{ width: `${tierProgressPct}%`, background: liveTier.accent }}
            />
          </div>
        </div>

        <div className="we-word-counter">
          <span>Word</span>
          <strong>{Math.min(wordIndex + 1, totalWords)}</strong>
          <span>/ {totalWords}</span>
        </div>
      </div>

      {/* Main 3-Zone Animated Conveyor / Skyway Stage */}
      <div className="we-runway-stage">
        {/* Ambient Moving Track Decor */}
        <div className="we-ambient-layer" aria-hidden="true">
          {centerCarrier.trackTheme === 'space' && (
            <>
              <span className="we-star s1" />
              <span className="we-star s2" />
              <span className="we-star s3" />
              <span className="we-star s4" />
              <span className="we-star s5" />
              <span className="we-star s6" />
            </>
          )}
          {centerCarrier.trackTheme === 'sky' && (
            <>
              <span className="we-cloud c1" />
              <span className="we-cloud c2" />
              <span className="we-cloud c3" />
            </>
          )}
          {(centerCarrier.trackTheme === 'road' || centerCarrier.trackTheme === 'race') && (
            <div className={`we-road-surface ${centerCarrier.trackTheme === 'race' ? 'is-race' : ''}`}>
              <div className="we-road-dashes" />
            </div>
          )}
        </div>

        {/* ZONE 1 (LEFT): Incoming Queued Word & Next Fleet (Animates Downgrade on Wrong Key!) */}
        <div className="we-zone-left">
          {upcomingWordAfterNext && (
            <div className="we-far-queue-chip" title="Up next in queue">
              {upcomingWordAfterNext}
            </div>
          )}
          {nextWord ? (
            <div ref={queueUnitRef} className="we-queued-unit">
              {/* Floating Downgrade Notification Pill */}
              {downgradeEvent && (
                <div
                  key={downgradeEvent.tick}
                  ref={downgradePillRef}
                  className="we-downgrade-pill"
                  aria-live="polite"
                >
                  <ArrowDown size={11} />
                  <span>{downgradeEvent.toCarrier.name}</span>
                </div>
              )}

              <div className="we-queued-word-tag">
                <span className="we-queue-lbl">NEXT</span>
                <span className="we-queue-text">{nextWord}</span>
              </div>

              <div ref={queueCarrierRef} className="we-queued-carrier">
                <DeliveryCarrierSVG
                  carrierId={nextCarrier.id}
                  accent={nextCarrier.accent}
                  size={54}
                />
              </div>
              <span className="we-queued-tier-caption" style={{ color: nextCarrier.accent }}>
                T{nextCarrier.tier} {nextCarrier.name}
              </span>
            </div>
          ) : (
            <div className="we-queue-final-tag">FINAL WORD</div>
          )}
        </div>

        {/* ZONE 2 (CENTER): Locked Active Word + Delivering Carrier (Stays Center & Vibrates on Error!) */}
        <div className="we-zone-center">
          <div ref={activeUnitRef} className="we-active-unit">
            <div ref={centerVibrationRef} className="we-center-vibrate-wrap">
              <div
                className={`we-word-banner ${isError ? 'has-error' : ''}`}
                style={{
                  borderColor: isError ? '#ef4444' : centerCarrier.accent,
                  boxShadow: isError
                    ? '0 0 22px rgba(239, 68, 68, 0.55)'
                    : `0 6px 22px ${centerCarrier.glow}`
                }}
              >
                {currentWord.split('').map((ch, idx) => {
                  const isDone = idx < letterIndex;
                  const isCurr = idx === letterIndex;
                  return (
                    <span
                      key={`${wordIndex}-${idx}`}
                      className={`we-letter ${isDone ? 'is-done' : ''} ${isCurr ? 'is-current' : ''} ${isCurr && isError ? 'is-error' : ''}`}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>

              <div className={`we-active-carrier-bob ${isError ? 'is-impacted' : ''}`}>
                <DeliveryCarrierSVG
                  carrierId={centerCarrier.id}
                  accent={centerCarrier.accent}
                  size={84}
                  boosted={centerCarrier.tier >= 5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 3 (RIGHT): Departure Lane */}
        <div className="we-zone-right" aria-hidden="true">
          <span className="we-exit-arrow-hint">DELIVERED →</span>
        </div>

        {/* Non-blocking Departing Overlay Layer */}
        <div className="we-departing-layer" aria-hidden="true">
          {departingItems.map(item => (
            <DepartingUnit key={item.uid} item={item} />
          ))}
        </div>
      </div>

      {/* Glowing Light Beam pointing down to the active keyboard key */}
      <div
        className={`we-downward-beam ${isError ? 'is-error' : ''}`}
        style={{ left: `${beamCenterPct}%` }}
        aria-hidden="true"
      />
    </div>
  );
};
