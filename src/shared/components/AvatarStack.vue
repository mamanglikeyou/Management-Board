<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '@/features/members/types';
import BaseAvatar from './BaseAvatar.vue';

const props = withDefaults(
  defineProps<{ members: Member[]; max?: number; size?: number; overlap?: number }>(),
  { max: 4, size: 32, overlap: 8 },
);

const visible = computed(() => props.members.slice(0, props.max));
const hidden = computed(() => Math.max(0, props.members.length - props.max));
</script>

<template>
  <div class="stack" :style="{ '--overlap': `-${overlap}px`, '--size': `${size}px` }">
    <BaseAvatar v-for="m in visible" :key="m.id" :member="m" :size="size" class="item" />
    <span v-if="hidden" class="item more" :title="`${hidden} more`">+{{ hidden }}</span>
  </div>
</template>

<style scoped>
.stack {
  display: inline-flex;
  align-items: center;
  padding-left: calc(var(--overlap) * -1);
}

.item {
  margin-left: var(--overlap);
}

.more {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--c-primary);
  color: #fff;
  font-size: calc(var(--size) * 0.36);
  font-weight: 600;
  box-shadow: 0 0 0 2px var(--avatar-ring, #fff);
}
</style>
