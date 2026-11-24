<script setup lang="ts" generic="T extends string">
import { IonSelect, IonSelectOption } from '@ionic/vue';
import { chevronDownIcon } from '@/shared/icons';

/** Ionic select styled as the flat grey field from the design. */
withDefaults(
  defineProps<{
    options: { value: T; text: string }[];
    label: string;
    placeholder?: string;
    clearable?: boolean;
  }>(),
  { placeholder: '', clearable: false },
);

const model = defineModel<T | null>({ required: true });
const CLEAR = '__clear__';

function onChange(value: string) {
  model.value = value === CLEAR ? null : (value as T);
}
</script>

<template>
  <div class="field">
    <IonSelect
      :value="model"
      :aria-label="label"
      :placeholder="placeholder"
      interface="popover"
      :interface-options="{ cssClass: 'app-popover select-popover', size: 'cover' }"
      :toggle-icon="chevronDownIcon"
      justify="space-between"
      @ion-change="onChange($event.detail.value)"
    >
      <IonSelectOption v-if="clearable && model" :value="CLEAR">— None —</IonSelectOption>
      <IonSelectOption v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.text }}
      </IonSelectOption>
    </IonSelect>
  </div>
</template>

<style scoped>
.field {
  height: 36px;
  border-radius: var(--r-md);
  background: var(--c-surface);
  transition: background-color 0.15s ease;
}

.field:hover {
  background: var(--c-surface-hover);
}

ion-select {
  --padding-start: 16px;
  --padding-end: 14px;
  --padding-top: 0;
  --padding-bottom: 0;
  --placeholder-color: var(--c-text-subtle);
  --placeholder-opacity: 1;
  min-height: 36px;
  height: 36px;
  width: 100%;
  font-size: var(--fs-md);
  color: var(--c-text);
}

/* Without a visible label Ionic sizes the text to its content; stretch it so the chevron sits right. */
ion-select::part(container) {
  flex: 1;
}

ion-select::part(icon) {
  color: var(--c-icon);
  font-size: 16px;
  opacity: 1;
}
</style>
