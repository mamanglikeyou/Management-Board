import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/** Share of a column the finger must travel before we flip to the next one. */
const FLIP_THRESHOLD = 0.15;
/** Time without scroll events before a gesture is considered finished. */
const SETTLE_DELAY = 110;

/**
 * Column-by-column paging for the board on phones.
 *
 * CSS `scroll-snap` only flips a column after more than half of it has been
 * swiped, which feels stuck on a phone. Here a short swipe in either direction
 * is enough, and the same API powers the column tabs (`activeIndex`, `goTo`).
 */
export function useColumnPager(container: Ref<HTMLElement | undefined>, enabled: Ref<boolean>) {
  const activeIndex = ref(0);

  let touching = false;
  let gesture: { startIndex: number; startLeft: number } | null = null;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;

  const pages = (): HTMLElement[] =>
    container.value
      ? Array.from(container.value.querySelectorAll<HTMLElement>(':scope > [data-page]'))
      : [];

  function offsetOf(page: HTMLElement): number {
    const el = container.value!;
    return page.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || '0');
  }

  function nearestIndex(left: number): number {
    let best = 0;
    let bestDistance = Infinity;
    pages().forEach((page, index) => {
      const distance = Math.abs(offsetOf(page) - left);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best;
  }

  function goTo(index: number, smooth = true) {
    const list = pages();
    const el = container.value;
    if (!el || list.length === 0) return;
    const target = Math.min(Math.max(index, 0), list.length - 1);
    activeIndex.value = target;
    el.scrollTo({ left: offsetOf(list[target]), behavior: smooth ? 'smooth' : 'auto' });
  }

  /** A card is being dragged — let Sortable's auto-scroll work undisturbed. */
  const isDraggingCard = () => Boolean(document.querySelector('.sortable-fallback'));

  function settle() {
    const el = container.value;
    if (!el || !gesture || touching) return;
    if (isDraggingCard()) {
      settleTimer = setTimeout(settle, 200);
      return;
    }

    const { startIndex, startLeft } = gesture;
    gesture = null;
    const delta = el.scrollLeft - startLeft;
    if (delta === 0) return;

    let target = nearestIndex(el.scrollLeft);
    const pageWidth = pages()[startIndex]?.offsetWidth ?? el.clientWidth;
    if (target === startIndex && Math.abs(delta) > pageWidth * FLIP_THRESHOLD) {
      target = startIndex + Math.sign(delta);
    }
    goTo(target);
  }

  function scheduleSettle() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, SETTLE_DELAY);
  }

  function onTouchStart() {
    const el = container.value;
    if (!enabled.value || !el) return;
    touching = true;
    clearTimeout(settleTimer);
    gesture = { startIndex: nearestIndex(el.scrollLeft), startLeft: el.scrollLeft };
  }

  function onTouchEnd() {
    touching = false;
    if (gesture) scheduleSettle();
  }

  function onScroll() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (container.value) activeIndex.value = nearestIndex(container.value.scrollLeft);
    });
    if (gesture && !touching) scheduleSettle();
  }

  onMounted(() => {
    const el = container.value;
    if (!el) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('scroll', onScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    const el = container.value;
    clearTimeout(settleTimer);
    cancelAnimationFrame(frame);
    if (!el) return;
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchend', onTouchEnd);
    el.removeEventListener('touchcancel', onTouchEnd);
    el.removeEventListener('scroll', onScroll);
  });

  return { activeIndex, goTo };
}
