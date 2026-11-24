<script setup lang="ts">
import { IonPopover } from '@ionic/vue';
import { useMemberStore } from '@/features/members/stores/member.store';
import { LABEL_OPTIONS } from '@/features/task/constants';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import HeaderAction from '@/shared/components/HeaderAction.vue';
import LabelBadge from '@/shared/components/LabelBadge.vue';
import { filterIcon } from '@/shared/icons';
import { useFilterStore } from '../stores/filter.store';
import { DUE_FILTER_OPTIONS } from '../types';

const filters = useFilterStore();
const members = useMemberStore();
</script>

<template>
  <HeaderAction id="filter-trigger" :icon="filterIcon" text="Filter" :badge="filters.activeCount" />

  <IonPopover trigger="filter-trigger" trigger-action="click" class="app-popover filter-popover">
    <div class="panel">
      <header class="panel-header">
        <h3>Filter tasks</h3>
        <button
          type="button"
          class="link"
          :disabled="filters.activeCount === 0"
          @click="filters.clearFilters()"
        >
          Clear all
        </button>
      </header>

      <fieldset>
        <legend>Assignee</legend>
        <div class="members">
          <button
            v-for="m in members.members"
            :key="m.id"
            type="button"
            class="member"
            :class="{ 'is-active': filters.filter.assigneeIds.includes(m.id) }"
            :aria-pressed="filters.filter.assigneeIds.includes(m.id)"
            @click="filters.toggleAssignee(m.id)"
          >
            <BaseAvatar :member="m" :size="26" />
            <span>{{ m.name }}</span>
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Label</legend>
        <div class="chips">
          <button
            v-for="opt in LABEL_OPTIONS"
            :key="opt.value"
            type="button"
            class="chip"
            :class="{ 'is-active': filters.filter.labels.includes(opt.value) }"
            :aria-pressed="filters.filter.labels.includes(opt.value)"
            @click="filters.toggleLabel(opt.value)"
          >
            <LabelBadge :label="opt.value" />
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Due date</legend>
        <div class="chips">
          <button
            v-for="opt in DUE_FILTER_OPTIONS"
            :key="opt.value"
            type="button"
            class="pill"
            :class="{ 'is-active': filters.filter.due === opt.value }"
            :aria-pressed="filters.filter.due === opt.value"
            @click="filters.setDue(opt.value, filters.filter.dueDate)"
          >
            {{ opt.text }}
          </button>
        </div>
        <input
          v-if="filters.filter.due === 'date'"
          type="date"
          class="date-input"
          aria-label="Due on"
          :value="filters.filter.dueDate ?? ''"
          @input="filters.setDue('date', ($event.target as HTMLInputElement).value || null)"
        />
      </fieldset>
    </div>
  </IonPopover>
</template>

<style scoped>
.panel {
  width: min(340px, calc(100vw - 32px));
  max-height: min(560px, 80vh);
  overflow-y: auto;
  padding: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

h3 {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: 600;
}

.link {
  border: 0;
  background: none;
  color: var(--c-primary);
  font-size: var(--fs-sm);
  font-weight: 500;
  cursor: pointer;
}

.link:disabled {
  color: var(--c-text-subtle);
  cursor: default;
}

fieldset {
  margin: 0;
  padding: 12px 0 4px;
  border: 0;
  border-top: 1px solid var(--c-border-soft);
}

fieldset + fieldset {
  margin-top: 8px;
}

legend {
  float: left;
  width: 100%;
  margin-bottom: 10px;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.members {
  display: grid;
  gap: 2px;
  clear: both;
}

.member {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-md);
  text-align: left;
  cursor: pointer;
}

.member:hover {
  background: var(--c-surface);
}

.member.is-active {
  background: var(--c-primary-soft);
  font-weight: 600;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  clear: both;
}

.chip {
  padding: 4px;
  border: 1.5px solid transparent;
  border-radius: var(--r-pill);
  background: transparent;
  cursor: pointer;
}

.chip.is-active {
  border-color: var(--c-primary);
}

.pill {
  height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--r-pill);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-sm);
  font-weight: 500;
  cursor: pointer;
}

.pill.is-active {
  background: var(--c-primary);
  color: #fff;
}

.date-input {
  width: 100%;
  height: 36px;
  margin-top: 10px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--c-surface);
  color: var(--c-text);
  font: inherit;
  font-size: var(--fs-md);
}
</style>
