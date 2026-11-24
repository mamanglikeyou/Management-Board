<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import IconButton from '@/shared/components/IconButton.vue';
import { editIcon } from '@/shared/icons';

const props = defineProps<{ autofocus?: boolean }>();
const title = defineModel<string>({ required: true });

const editing = ref(Boolean(props.autofocus));
const input = ref<HTMLInputElement>();

async function startEdit() {
  editing.value = true;
  await nextTick();
  input.value?.focus();
}

/* Ionic moves focus into the modal while it animates in, so focus once it has presented. */
onMounted(() => {
  if (!props.autofocus) return;
  const modal = input.value?.closest('ion-modal');
  modal?.addEventListener('ionModalDidPresent', () => input.value?.focus(), { once: true });
});

function stopEdit() {
  title.value = title.value.replace(/\s+/g, ' ').trimStart();
  if (title.value.trim()) editing.value = false;
}
</script>

<template>
  <div class="title-field">
    <input
      v-if="editing"
      ref="input"
      v-model="title"
      class="input"
      placeholder="Task title"
      aria-label="Task title"
      maxlength="140"
      @keydown.enter.prevent="stopEdit"
      @blur="stopEdit"
    />
    <template v-else>
      <h1 class="title" @click="startEdit">{{ title }}</h1>
      <IconButton :icon="editIcon" label="Edit title" :size="30" @click="startEdit" />
    </template>
  </div>
</template>

<style scoped>
.title-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  margin-bottom: 22px;
}

.title,
.input {
  font-size: var(--fs-3xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.title {
  margin: 0;
  overflow-wrap: anywhere;
  cursor: text;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  margin-left: -10px;
  border: 1.5px solid var(--c-primary);
  border-radius: var(--r-md);
  background: #fff;
  font-family: inherit;
  outline: none;
}

.input::placeholder {
  color: var(--c-text-subtle);
  font-weight: 600;
}
</style>
