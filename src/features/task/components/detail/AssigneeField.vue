<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon, IonPopover } from '@ionic/vue';
import { useMemberStore } from '@/features/members/stores/member.store';
import AvatarStack from '@/shared/components/AvatarStack.vue';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import IconButton from '@/shared/components/IconButton.vue';
import { addIcon, checkIcon } from '@/shared/icons';

const ids = defineModel<string[]>({ required: true });
const members = useMemberStore();
const assigned = computed(() => members.byIds(ids.value));

function toggle(id: string) {
  ids.value = ids.value.includes(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id];
}
</script>

<template>
  <div class="assignees">
    <AvatarStack v-if="assigned.length" :members="assigned" :max="4" :size="32" :overlap="6" />
    <span v-else class="empty">Unassigned</span>
    <IconButton
      id="assignee-trigger"
      :icon="addIcon"
      label="Add assignee"
      variant="round"
      :size="36"
    />

    <IonPopover trigger="assignee-trigger" trigger-action="click" class="app-popover">
      <ul class="list" role="listbox" aria-multiselectable="true" aria-label="Assignees">
        <li v-for="m in members.members" :key="m.id">
          <button
            type="button"
            role="option"
            :aria-selected="ids.includes(m.id)"
            :class="{ 'is-active': ids.includes(m.id) }"
            @click="toggle(m.id)"
          >
            <BaseAvatar :member="m" :size="28" />
            <span>{{ m.name }}</span>
            <IonIcon v-if="ids.includes(m.id)" :icon="checkIcon" class="check" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </IonPopover>
  </div>
</template>

<style scoped>
.assignees {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 36px;
}

.assignees :deep(.icon-btn ion-icon) {
  font-size: 22px;
}

.empty {
  color: var(--c-text-subtle);
  font-size: var(--fs-md);
}

.list {
  width: 240px;
  margin: 0;
  padding: 6px;
  list-style: none;
}

.list button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-md);
  text-align: left;
  cursor: pointer;
}

.list button:hover {
  background: var(--c-surface);
}

.list button.is-active {
  font-weight: 600;
}

.check {
  margin-left: auto;
  color: var(--c-primary);
  font-size: 18px;
}
</style>
