<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { formatLongDate, formatShortDate } from '@/core/utils/date';
import { timerIcon } from '@/shared/icons';

defineProps<{ date: string }>();
</script>

<template>
  <span class="chip" :title="`Due ${formatLongDate(date)}`">
    <IonIcon :icon="timerIcon" aria-hidden="true" />
    {{ formatShortDate(date) }}
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 21px;
  padding: 0 7px 0 8px;
  border-radius: var(--r-pill);
  border: 1px solid var(--c-chip-date-border);
  background: var(--c-chip-date-bg);
  color: var(--c-chip-date-ink);
  font-size: var(--fs-sm);
  font-weight: 500;
  white-space: nowrap;
}

ion-icon {
  font-size: 13px;
}
</style>
