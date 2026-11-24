<script setup lang="ts">
import type { Member } from '@/features/members/types';

withDefaults(defineProps<{ member: Member; size?: number }>(), { size: 32 });
</script>

<template>
  <span
    class="avatar"
    :style="{ width: `${size}px`, height: `${size}px`, background: member.color }"
    :title="member.name"
  >
    <img :src="member.avatarUrl" :alt="member.name" draggable="false" loading="lazy" />
  </span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 0 2px var(--avatar-ring, #fff);
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
