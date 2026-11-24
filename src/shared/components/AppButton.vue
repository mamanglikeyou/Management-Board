<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

withDefaults(
  defineProps<{
    variant?: 'soft' | 'primary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
    icon?: string;
    block?: boolean;
    type?: 'button' | 'submit';
  }>(),
  { variant: 'soft', size: 'md', type: 'button', icon: undefined },
);
</script>

<template>
  <button :type="type" class="btn" :class="[`is-${variant}`, `is-${size}`, { 'is-block': block }]">
    <IonIcon v-if="icon" :icon="icon" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  border-radius: var(--r-md);
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
}

.btn:active {
  transform: scale(0.97);
}

.is-md {
  height: 36px;
  padding: 0 16px;
  font-size: var(--fs-md);
}

.is-sm {
  height: 30px;
  padding: 0 10px;
  font-size: var(--fs-sm);
}

.is-block {
  display: flex;
  width: 100%;
}

.is-soft {
  background: var(--c-surface);
  color: var(--c-text);
}

.is-soft:hover {
  background: var(--c-surface-hover);
}

.is-primary {
  background: var(--c-primary);
  color: #fff;
  font-weight: 600;
}

.is-primary:hover {
  background: var(--c-primary-hover);
}

.is-ghost {
  background: transparent;
  color: var(--c-text);
}

.is-ghost:hover {
  background: var(--c-surface);
}

.is-danger {
  background: var(--c-danger-soft);
  color: var(--c-danger);
}

ion-icon {
  font-size: 1.25em;
}
</style>
