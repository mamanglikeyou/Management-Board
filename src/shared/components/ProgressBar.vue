<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ value: number; tone?: 'primary' | 'success'; height?: number; label?: string }>(),
  { tone: 'primary', height: 4, label: 'Progress' },
);

const percent = computed(() => Math.round(Math.min(1, Math.max(0, props.value)) * 100));
</script>

<template>
  <div
    class="track"
    :class="`is-${tone}`"
    :style="{ height: `${height}px` }"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="fill" :style="{ width: `${percent}%` }" />
  </div>
</template>

<style scoped>
.track {
  width: 100%;
  border-radius: var(--r-pill);
  background: var(--c-progress-track);
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: inherit;
  background: var(--c-primary);
  transition: width 0.35s var(--ease);
}

.is-success,
.is-success .fill {
  background: var(--c-success);
}
</style>
