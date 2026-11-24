<script setup lang="ts">
import { IonDatetime, IonIcon, IonPopover } from '@ionic/vue';
import { formatLongDate } from '@/core/utils/date';
import { calendarIcon } from '@/shared/icons';

const date = defineModel<string | null>({ required: true });

function onChange(value: string | string[] | null | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  date.value = v ? v.slice(0, 10) : null;
}
</script>

<template>
  <button id="due-date-trigger" type="button" class="field" aria-label="Due date">
    <span :class="{ placeholder: !date }">{{ date ? formatLongDate(date) : 'Set due date' }}</span>
    <IonIcon :icon="calendarIcon" aria-hidden="true" />
  </button>

  <IonPopover
    trigger="due-date-trigger"
    trigger-action="click"
    class="date-popover"
    :keep-contents-mounted="false"
  >
    <IonDatetime
      presentation="date"
      :value="date ?? undefined"
      :show-clear-button="true"
      :show-default-buttons="false"
      :prefer-wheel="false"
      @ion-change="onChange($event.detail.value)"
    />
  </IonPopover>
</template>

<style scoped>
.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 0 14px 0 16px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.field:hover {
  background: var(--c-surface-hover);
}

.placeholder {
  color: var(--c-text-subtle);
}

ion-icon {
  font-size: 18px;
  color: var(--c-text-muted);
}

ion-datetime {
  --background: #fff;
  width: 100%;
}
</style>
