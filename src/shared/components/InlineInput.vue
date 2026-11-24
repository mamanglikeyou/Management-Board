<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

/**
 * Text input that commits on Enter / blur and cancels on Escape.
 * Used for renaming lists, adding lists and adding subtasks.
 */
const props = withDefaults(
  defineProps<{ initial?: string; placeholder?: string; label: string; keepOpen?: boolean }>(),
  { initial: '', placeholder: '', keepOpen: false },
);
const emit = defineEmits<{ commit: [value: string]; cancel: [] }>();

const value = ref(props.initial);
const input = ref<HTMLInputElement>();
let done = false;

onMounted(async () => {
  await nextTick();
  input.value?.focus();
  input.value?.select();
});

function commit() {
  if (done) return;
  const text = value.value.trim();
  if (!text) return cancel();
  emit('commit', text);
  if (props.keepOpen) {
    value.value = '';
  } else {
    done = true;
  }
}

function cancel() {
  if (done) return;
  done = true;
  emit('cancel');
}

/** Leaving the field keeps typed text, then closes the input. */
function onBlur() {
  if (props.keepOpen && value.value.trim()) emit('commit', value.value.trim());
  if (props.keepOpen) return cancel();
  commit();
}
</script>

<template>
  <input
    ref="input"
    v-model="value"
    class="inline-input"
    :placeholder="placeholder"
    :aria-label="label"
    maxlength="120"
    @keydown.enter.prevent="commit"
    @keydown.esc.prevent="cancel"
    @blur="onBlur"
  />
</template>

<style scoped>
.inline-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1.5px solid var(--c-primary);
  border-radius: var(--r-md);
  background: #fff;
  color: var(--c-text);
  font: inherit;
  font-size: var(--fs-md);
  outline: none;
}
</style>
