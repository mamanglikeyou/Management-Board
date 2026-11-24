import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SEED_MEMBERS } from '@/data/seed.members';
import type { Member } from '../types';

export const useMemberStore = defineStore('members', () => {
  const members = ref<Member[]>(SEED_MEMBERS.map((m) => ({ ...m })));

  const map = computed(() => new Map(members.value.map((m) => [m.id, m])));

  function byId(id: string): Member | undefined {
    return map.value.get(id);
  }

  function byIds(ids: string[]): Member[] {
    return ids.map((id) => map.value.get(id)).filter((m): m is Member => Boolean(m));
  }

  return { members, byId, byIds };
});
