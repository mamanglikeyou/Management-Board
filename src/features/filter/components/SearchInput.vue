<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { IonIcon } from '@ionic/vue';
import { closeIcon, searchIcon } from '@/shared/icons';
import { useFilterStore } from '../stores/filter.store';

const filters = useFilterStore();
const text = ref(filters.filter.query);
let timer: ReturnType<typeof setTimeout> | undefined;

// Debounced so typing stays smooth on large boards.
watch(text, (value) => {
  clearTimeout(timer);
  timer = setTimeout(() => filters.setQuery(value), 150);
});

watch(
  () => filters.filter.query,
  (value) => {
    if (value !== text.value) text.value = value;
  },
);

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <label class="search">
    <IonIcon :icon="searchIcon" class="icon" aria-hidden="true" />
    <input v-model="text" type="search" placeholder="Search Tasks" aria-label="Search tasks" />
    <button v-if="text" type="button" class="clear" aria-label="Clear search" @click="text = ''">
      <IonIcon :icon="closeIcon" aria-hidden="true" />
    </button>
  </label>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 300px;
  height: 36px;
  padding: 0 12px 0 16px;
  border-radius: var(--r-md);
  background: var(--c-surface);
  cursor: text;
  transition: box-shadow 0.15s ease;
}

.search:focus-within {
  box-shadow:
    0 0 0 2px var(--c-primary-soft),
    0 0 0 1px var(--c-primary) inset;
}

.icon {
  flex: none;
  font-size: 17px;
  color: var(--c-text-muted);
}

input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--c-text);
  font: inherit;
  font-size: var(--fs-md);
  outline: none;
}

input::placeholder {
  color: #8c969e;
}

input::-webkit-search-cancel-button {
  display: none;
}

.clear {
  display: grid;
  place-items: center;
  padding: 2px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
}
</style>
