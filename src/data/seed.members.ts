import type { Member } from '@/features/members/types';

const avatar = (id: string) => `/avatars/${id}.svg`;

/** Avatar colours sampled from the reference design (images: `npm run avatars`). */
export const SEED_MEMBERS: Member[] = [
  {
    id: 'm_andi',
    name: 'Andi Saputra',
    email: 'andi@example.com',
    color: '#5fc39c',
    avatarUrl: avatar('m_andi'),
  },
  {
    id: 'm_bella',
    name: 'Bella Rahma',
    email: 'bella@example.com',
    color: '#e2717f',
    avatarUrl: avatar('m_bella'),
  },
  {
    id: 'm_citra',
    name: 'Citra Lestari',
    email: 'citra@example.com',
    color: '#6cc3dc',
    avatarUrl: avatar('m_citra'),
  },
  {
    id: 'm_dimas',
    name: 'Dimas Arya',
    email: 'dimas@example.com',
    color: '#b88be6',
    avatarUrl: avatar('m_dimas'),
  },
  {
    id: 'm_eka',
    name: 'Eka Putri',
    email: 'eka@example.com',
    color: '#f2a65e',
    avatarUrl: avatar('m_eka'),
  },
  {
    id: 'm_fajar',
    name: 'Fajar Nugroho',
    email: 'fajar@example.com',
    color: '#5b8fe0',
    avatarUrl: avatar('m_fajar'),
  },
];
