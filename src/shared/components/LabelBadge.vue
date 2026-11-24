<script setup lang="ts">
import { labelText } from '@/features/task/constants';
import type { TaskLabel } from '@/features/task/types';

defineProps<{ label: TaskLabel }>();
</script>

<template>
  <span class="badge" :class="`is-${label}`">{{ labelText(label) }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: 21px;
  padding: 0 7px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  font-size: var(--fs-sm);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.is-feature {
  background: var(--c-label-feature-bg);
  border-color: var(--c-label-feature-border);
  color: var(--c-label-feature-ink);
}

.is-bug {
  background: var(--c-label-bug-bg);
  border-color: var(--c-label-bug-border);
  color: var(--c-label-bug-ink);
}

.is-issue {
  background: var(--c-label-issue-bg);
  border-color: var(--c-label-issue-border);
  color: var(--c-label-issue-ink);
}

/* "Undefined" is rendered as plain bold text in the design. */
.is-undefined {
  padding: 0;
  color: var(--c-label-undefined-ink);
  font-weight: 600;
}
</style>
