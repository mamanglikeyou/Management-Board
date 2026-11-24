<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonIcon } from '@ionic/vue';
import { editIcon } from '@/shared/icons';

const text = defineModel<string>({ required: true });
const textarea = ref<HTMLTextAreaElement>();

/** Auto-grow so long descriptions never need an inner scrollbar. */
function resize() {
  const el = textarea.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.max(100, el.scrollHeight)}px`;
}

watch(text, resize, { flush: 'post' });
onMounted(resize);
</script>

<template>
  <div class="box">
    <IonIcon v-if="!text" :icon="editIcon" class="hint-icon" aria-hidden="true" />
    <textarea ref="textarea" v-model="text" aria-label="Description" rows="3" maxlength="4000" />
  </div>
</template>

<style scoped>
.box {
  position: relative;
  border-radius: var(--r-md);
  background: var(--c-surface);
  transition: box-shadow 0.15s ease;
}

.box:focus-within {
  box-shadow: 0 0 0 1.5px var(--c-primary) inset;
}

.hint-icon {
  position: absolute;
  top: 18px;
  left: 42px;
  font-size: 17px;
  color: var(--c-icon);
  pointer-events: none;
}

.box:focus-within .hint-icon {
  display: none;
}

textarea {
  display: block;
  width: 100%;
  min-height: 100px;
  padding: 16px 20px;
  border: 0;
  background: transparent;
  color: var(--c-text-body);
  font: inherit;
  font-size: var(--fs-md);
  line-height: 1.6;
  resize: none;
  outline: none;
}
</style>
