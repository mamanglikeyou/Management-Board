<script setup lang="ts">
import { IonIcon, IonPopover } from '@ionic/vue';

export interface ActionMenuItem {
  key: string;
  text: string;
  icon?: string;
  danger?: boolean;
}

/** Dropdown menu bound to any element id (Ionic popover under the hood). */
defineProps<{ trigger: string; items: ActionMenuItem[] }>();
const emit = defineEmits<{ select: [key: string] }>();
</script>

<template>
  <IonPopover
    :trigger="trigger"
    trigger-action="click"
    class="app-popover"
    :dismiss-on-select="true"
    alignment="start"
  >
    <ul class="menu" role="menu">
      <li v-for="item in items" :key="item.key">
        <button
          type="button"
          role="menuitem"
          class="menu-item"
          :class="{ 'is-danger': item.danger }"
          @click="emit('select', item.key)"
        >
          <IonIcon v-if="item.icon" :icon="item.icon" aria-hidden="true" />
          {{ item.text }}
        </button>
      </li>
    </ul>
  </IonPopover>
</template>

<style scoped>
.menu {
  margin: 0;
  padding: 6px;
  list-style: none;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-md);
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--c-surface);
}

.menu-item ion-icon {
  font-size: 17px;
  color: var(--c-text-muted);
}

.is-danger,
.is-danger ion-icon {
  color: var(--c-danger);
}
</style>
