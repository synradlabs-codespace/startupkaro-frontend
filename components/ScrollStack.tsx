import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  /** Extra px of scroll buffer after the last card. Reduce to close the gap with the next section. Default: 800 */
  scrollBuffer?: number;
  onStackComplete?: () => void;
}

/**
 * Card-stacking effect built entirely on native `position: sticky` and a passive
 * scroll listener (no smooth-scroll library, no scroll hijacking).
 *
 * Pinning is handled by the browser compositor via `position: sticky` — cards later
 * in the DOM stick at a slightly greater `top` offset than earlier ones and simply
 * paint over them as the user scrolls, which is the standard native technique for
 * this effect and costs nothing on the main thread.
 *
 * The only per-frame JS is a small scale/rotation calculation, coalesced through a
 * single requestAnimationFrame per scroll notification and using cached card
 * offsets (no per-frame layout reads), so it never blocks the browser's own scroll
 * handling — unlike a scroll-hijacking library, native scroll keeps running on the
 * compositor regardless of what this handler does.
 */

/** Walk the offsetParent chain to get layout position from the document top.
 *  Unlike getBoundingClientRect, this ignores CSS transforms, preventing feedback loops. */
function getLayoutTop(element: HTMLElement): number {
  let top = 0;
  let el: HTMLElement | null = element;
  while (el) {
    top += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  return top;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scrollBuffer = 800,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardTopsRef = useRef<number[]>([]);
  const cardTopsPxRef = useRef<number[]>([]); // sticky `top` offset per card, cached at layout time
  const lastTransformsRef = useRef(new Map<number, { scale: number; rotation: number }>());

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }
    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller ? scroller.scrollTop : 0,
      containerHeight: scroller ? scroller.clientHeight : 0
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => (useWindowScroll ? getLayoutTop(element) : element.offsetTop),
    [useWindowScroll]
  );

  /** Recompute cached card offsets and the sticky `top` px each card should pin at. */
  const recomputeLayout = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const { containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);

    cardTopsRef.current = cards.map(card => getElementOffset(card));
    cardTopsPxRef.current = cards.map((_, i) => stackPositionPx + itemStackDistance * i);

    cards.forEach((card, i) => {
      card.style.top = `${cardTopsPxRef.current[i]}px`;
    });
  }, [getScrollData, parsePercentage, stackPosition, itemStackDistance, getElementOffset]);

  const updateCardTransforms = useCallback(() => {
    rafRef.current = null;
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    let topCardIndex = 0;
    if (blurAmount) {
      cardsRef.current.forEach((_, j) => {
        const jTriggerStart = cardTopsRef.current[j] - stackPositionPx - itemStackDistance * j;
        if (scrollTop >= jTriggerStart) topCardIndex = j;
      });
    }

    cardsRef.current.forEach((card, i) => {
      const cardTop = cardTopsRef.current[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      const newTransform = {
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1;

      if (hasChanged) {
        card.style.transform = `scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        if (blurAmount) {
          const depthInStack = i < topCardIndex ? topCardIndex - i : 0;
          const blur = Math.max(0, depthInStack * blurAmount);
          card.style.filter = blur > 0 ? `blur(${Math.round(blur * 100) / 100}px)` : '';
        }
        lastTransformsRef.current.set(i, newTransform);
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    getScrollData,
    calculateProgress,
    parsePercentage
  ]);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = blurAmount ? 'transform, filter' : 'transform';
      card.style.transformOrigin = 'top center';
      card.style.position = 'sticky';
    });

    recomputeLayout();
    updateCardTransforms();

    const scrollTarget: EventTarget = useWindowScroll ? window : (scrollerRef.current as HTMLDivElement);
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      recomputeLayout();
      updateCardTransforms();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let observer: IntersectionObserver | null = null;
    if (onStackComplete && endSentinelRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) onStackComplete();
        },
        { threshold: 0 }
      );
      observer.observe(endSentinelRef.current);
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      scrollTarget.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
      cardsRef.current = [];
      cardTopsRef.current = [];
      cardTopsPxRef.current = [];
      transformsCache.clear();
    };
  }, [
    itemDistance,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    handleScroll,
    recomputeLayout,
    updateCardTransforms
  ]);

  return (
    <div
      className={`relative w-full h-full ${useWindowScroll ? 'overflow-y-visible' : 'overflow-y-auto'} overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: useWindowScroll ? 'auto' : 'contain',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="scroll-stack-inner pt-[20vh] px-20 min-h-screen" style={{ paddingBottom: `${scrollBuffer}px` }}>
        {children}
        <div ref={endSentinelRef} className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
