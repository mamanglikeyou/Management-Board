<script setup lang="ts">
import { computed } from 'vue';
import { useMemberStore } from '@/features/members/stores/member.store';
import AvatarStack from '@/shared/components/AvatarStack.vue';
import DateChip from '@/shared/components/DateChip.vue';
import LabelBadge from '@/shared/components/LabelBadge.vue';
import MetaCount from '@/shared/components/MetaCount.vue';
import ProgressBar from '@/shared/components/ProgressBar.vue';
import { attachmentIcon, checklistIcon } from '@/shared/icons';
import type { Task } from '../types';
import { getChecklistProgress } from '../utils/progress';

const props = defineProps<{ task: Task }>();
defineEmits<{ open: [] }>();

const members = useMemberStore();

const assignees = computed(() => members.byIds(props.task.assigneeIds));
const progress = computed(() => getChecklistProgress(props.task.subtasks));
const isComplete = computed(
  () => props.task.completed || (progress.value.total > 0 && progress.value.ratio === 1),
);
const showProgress = computed(() => progress.value.total > 0 || props.task.completed);
const hasMeta = computed(
  () =>
    Boolean(props.task.dueDate) ||
    progress.value.total > 0 ||
    props.task.attachments.length > 0 ||
    assignees.value.length > 0,
);
</script>

<template>
  <article
    class="card"
    :class="{ 'has-cover': task.coverImage }"
    tabindex="0"
    role="button"
    :aria-label="`Open task ${task.title}`"
    @click="$emit('open')"
    @keydown.enter.prevent="$emit('open')"
  >
    <div v-if="task.coverImage" class="cover">
      <img :src="task.coverImage" alt="" loading="lazy" draggable="false" />
    </div>

    <div class="body">
      <div v-if="task.label" class="label-row">
        <LabelBadge :label="task.label" />
      </div>

      <ProgressBar
        v-if="showProgress"
        :value="isComplete ? 1 : progress.ratio"
        :tone="isComplete ? 'success' : 'primary'"
        :label="`Checklist ${progress.done} of ${progress.total}`"
      />

      <h3 class="title">{{ task.title }}</h3>

      <footer v-if="hasMeta" class="meta">
        <div class="meta-left">
          <DateChip v-if="task.dueDate" :date="task.dueDate" />
          <MetaCount v-if="progress.total" :icon="checklistIcon" label="Checklist">
            {{ progress.done }}/{{ progress.total }}
          </MetaCount>
          <MetaCount v-if="task.attachments.length" :icon="attachmentIcon" label="Attachments">
            {{ task.attachments.length }}
          </MetaCount>
        </div>
        <AvatarStack :members="assignees" :size="26" :overlap="6" :max="3" class="assignees" />
      </footer>
    </div>
  </article>
</template>

<style scoped>
.card {
  --avatar-ring: #fff;
  display: block;
  border-radius: var(--r-lg);
  background: var(--c-surface);
  cursor: grab;
  user-select: none;
  outline: none;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s var(--ease);
}

.card:hover {
  background: var(--c-surface-hover);
}

.card:focus-visible {
  box-shadow: 0 0 0 2px var(--c-primary);
}

.card:active {
  cursor: grabbing;
}

.cover {
  padding: 8px 8px 0;
}

.cover img {
  display: block;
  width: 100%;
  height: 198px;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--c-surface-strong);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 16px var(--card-pad) 16px;
}

.has-cover .body {
  padding-top: 24px;
}

.label-row {
  display: flex;
}

.title {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: 400;
  line-height: 22px;
  color: var(--c-text-body);
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 26px;
  margin-top: 3px;
}

.meta-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.assignees {
  margin-left: auto;
}
</style>
