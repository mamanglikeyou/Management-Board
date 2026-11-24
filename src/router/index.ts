import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/board' },
  {
    path: '/board',
    name: 'board',
    component: () => import('@/features/board/views/BoardPage.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/board' },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
