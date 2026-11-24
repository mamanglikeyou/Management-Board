export const POSITION_STEP = 1024;

/**
 * Fractional indexing: returns a sort key that sits between two neighbours,
 * so moving a card only rewrites that single card.
 */
export function positionBetween(before: number | null, after: number | null): number {
  if (before === null && after === null) return POSITION_STEP;
  if (before === null) return after! - POSITION_STEP;
  if (after === null) return before + POSITION_STEP;
  return (before + after) / 2;
}
