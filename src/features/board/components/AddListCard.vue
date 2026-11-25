<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import InlineInput from '@/shared/components/InlineInput.vue';
import { addIcon } from '@/shared/icons';
import { useBoardActions } from '../composables/useBoardActions';

const adding = ref(false);
const { addColumn } = useBoardActions();

function commit(title: string) {
  addColumn(title);
  adding.value = false;
}
</script>

<template>
  <div class="add-list" data-page>
    <div v-if="adding" class="form">
      <InlineInput
        label="List name"
        placeholder="Enter list name…"
        @commit="commit"
        @cancel="adding = false"
      />
      <p class="help">Press Enter to add, Esc to cancel</p>
    </div>
    <button v-else type="button" class="trigger" @click="adding = true">
      <IonIcon :icon="addIcon" aria-hidden="true" />
      Add new List
    </button>
  </div>
</template>

<style scoped>
.add-list {
  flex: none;
  width: 327px;
  margin-top: 4px;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 68px;
  border: 0;
  border-radius: var(--r-lg);
  background: #f3f6f8;
  color: var(--c-text);
  font-size: var(--fs-lg);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.trigger:hover {
  background: var(--c-surface);
}

.trigger ion-icon {
  font-size: 22px;
}

.form {
  padding: 16px;
  border-radius: var(--r-lg);
  background: #f3f6f8;
}

.help {
  margin: 8px 0 0;
  color: var(--c-text-subtle);
  font-size: var(--fs-sm);
}
</style>
