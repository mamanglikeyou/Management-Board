<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

/** Text + icon button used in the board toolbar ("Filter", "Export / Import"). */
withDefaults(defineProps<{ icon: string; text: string; badge?: number }>(), { badge: 0 });
</script>

<template>
  <button type="button" class="action" :aria-label="text" :title="text">
    <IonIcon :icon="icon" aria-hidden="true" />
    <span class="text">{{ text }}</span>
    <span v-if="badge" class="badge">{{ badge }}</span>
  </button>
</template>

<style scoped>
.action {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-lg);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.action:hover {
  background: var(--c-surface);
}

ion-icon {
  font-size: 18px;
}

.badge {
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--r-pill);
  background: var(--c-primary);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 600;
}

@media (max-width: 1023px) {
  .text {
    display: none;
  }

  .badge {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
