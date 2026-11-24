<script setup lang="ts">
import { ref } from 'vue';
import { IonCheckbox } from '@ionic/vue';
import AppButton from '@/shared/components/AppButton.vue';
import IconButton from '@/shared/components/IconButton.vue';
import InlineInput from '@/shared/components/InlineInput.vue';
import ProgressBar from '@/shared/components/ProgressBar.vue';
import { addIcon, closeIcon } from '@/shared/icons';
import type { Subtask } from '../../types';
import type { ChecklistProgress } from '../../utils/progress';

defineProps<{ subtasks: Subtask[]; progress: ChecklistProgress }>();
const emit = defineEmits<{ add: [title: string]; toggle: [id: string]; remove: [id: string] }>();

const adding = ref(false);
</script>

<template>
  <div class="checklist">
    <span class="count">{{ progress.done }}/{{ progress.total }}</span>
    <!-- An empty checklist renders as a full bar, exactly like the design. -->
    <ProgressBar
      :value="progress.total ? progress.ratio : 1"
      :tone="progress.total && progress.ratio === 1 ? 'success' : 'primary'"
      label="Checklist progress"
    />

    <TransitionGroup v-if="subtasks.length" tag="ul" name="list" class="items">
      <li v-for="item in subtasks" :key="item.id" class="item" :class="{ 'is-done': item.done }">
        <IonCheckbox
          :checked="item.done"
          label-placement="end"
          justify="start"
          @ion-change="emit('toggle', item.id)"
        >
          {{ item.title }}
        </IonCheckbox>
        <IconButton
          :icon="closeIcon"
          :label="`Remove ${item.title}`"
          class="remove"
          @click="emit('remove', item.id)"
        />
      </li>
    </TransitionGroup>

    <div class="add" :class="{ 'is-first': !subtasks.length }">
      <InlineInput
        v-if="adding"
        label="New subtask"
        placeholder="Subtask title, press Enter to add"
        keep-open
        @commit="emit('add', $event)"
        @cancel="adding = false"
      />
      <AppButton v-else block :icon="addIcon" @click="adding = true">Add subtask</AppButton>
    </div>
  </div>
</template>

<style scoped>
.count {
  display: block;
  margin-bottom: 6px;
  color: var(--c-text);
  font-size: var(--fs-sm);
}

.items {
  display: grid;
  gap: 2px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 4px 0 8px;
  border-radius: var(--r-md);
  transition: background-color 0.15s ease;
}

.item:hover {
  background: var(--c-surface);
}

ion-checkbox {
  --size: 18px;
  --checkbox-background-checked: var(--c-primary);
  --border-color: #a8b4bd;
  --border-radius: 5px;
  flex: 1;
  font-size: var(--fs-md);
  color: var(--c-text);
}

ion-checkbox::part(label) {
  margin-inline-start: 10px;
  white-space: normal;
  transition: color 0.15s ease;
}

.is-done ion-checkbox::part(label) {
  color: var(--c-text-subtle);
  text-decoration: line-through;
}

.remove {
  opacity: 0;
}

.item:hover .remove,
.remove:focus-visible {
  opacity: 1;
}

@media (hover: none) {
  .remove {
    opacity: 1;
  }
}

.add {
  margin-top: 16px;
}

.add.is-first {
  margin-top: 48px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s var(--ease);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
