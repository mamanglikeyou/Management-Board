<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

withDefaults(
  defineProps<{
    icon: string;
    label: string;
    variant?: 'ghost' | 'soft' | 'primary-soft' | 'round';
    size?: number;
  }>(),
  { variant: 'ghost', size: 28 },
);
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    :class="`is-${variant}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :aria-label="label"
    :title="label"
  >
    <IonIcon :icon="icon" aria-hidden="true" />
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-grid;
  place-items: center;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--c-icon);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
}

.icon-btn:active {
  transform: scale(0.92);
}

ion-icon {
  font-size: 18px;
}

.is-ghost:hover {
  background: var(--c-surface);
}

.is-soft {
  background: var(--c-surface);
}

.is-soft:hover {
  background: var(--c-surface-hover);
}

.is-primary-soft {
  background: var(--c-primary-soft);
  color: var(--c-primary-ink);
}

.is-primary-soft:hover {
  background: #cfe2fc;
}

.is-round {
  border-radius: 50%;
  background: var(--c-surface);
}

.is-round:hover {
  background: var(--c-surface-hover);
}
</style>
