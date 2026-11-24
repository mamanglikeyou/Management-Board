/**
 * Generates the team avatars once as static SVG files (public/avatars/<id>.svg).
 * Keeps the illustration generator out of the runtime bundle.
 * Usage: npm run avatars
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { createAvatar } from '@dicebear/core';
import * as notionists from '@dicebear/notionists';

const members = [
  { id: 'm_andi', seed: 'Andi', color: '5fc39c' },
  { id: 'm_bella', seed: 'Bella', color: 'e2717f' },
  { id: 'm_citra', seed: 'Citra', color: '6cc3dc' },
  { id: 'm_dimas', seed: 'Dimas', color: 'b88be6' },
  { id: 'm_eka', seed: 'Eka', color: 'f2a65e' },
  { id: 'm_fajar', seed: 'Fajar', color: '5b8fe0' },
];

mkdirSync('public/avatars', { recursive: true });
for (const m of members) {
  const svg = createAvatar(notionists, {
    seed: m.seed,
    backgroundColor: [m.color],
    gestureProbability: 0,
  }).toString();
  writeFileSync(`public/avatars/${m.id}.svg`, svg);
  console.log(`public/avatars/${m.id}.svg`);
}
