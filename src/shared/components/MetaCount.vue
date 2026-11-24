<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{ icon: string; label: string }>();
</script>

<template>
  <span class="meta" :aria-label="label" :title="label">
    <IonIcon :icon="icon" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.meta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  white-space: nowrap;
}

ion-icon {
  font-size: 14px;
}
</style>
