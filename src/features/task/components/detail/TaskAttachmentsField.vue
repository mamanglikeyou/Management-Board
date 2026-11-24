<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { formatFileSize } from '@/core/utils/file';
import IconButton from '@/shared/components/IconButton.vue';
import { addPhotoIcon, closeIcon, fileIcon } from '@/shared/icons';
import type { Attachment } from '../../types';

defineProps<{ attachments: Attachment[] }>();
const emit = defineEmits<{ add: [files: File[]]; remove: [id: string] }>();

const input = ref<HTMLInputElement>();
const dragging = ref(false);

function onDrop(event: DragEvent) {
  dragging.value = false;
  const files = Array.from(event.dataTransfer?.files ?? []);
  if (files.length) emit('add', files);
}

function onPick(event: Event) {
  const el = event.target as HTMLInputElement;
  const files = Array.from(el.files ?? []);
  el.value = '';
  if (files.length) emit('add', files);
}

const extension = (name: string) => name.split('.').pop()?.slice(0, 4).toUpperCase() ?? 'FILE';
</script>

<template>
  <div>
    <div
      class="dropzone"
      :class="{ 'is-dragging': dragging }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <IonIcon :icon="addPhotoIcon" class="icon" aria-hidden="true" />
      <span>Drag &amp; Drop files here</span>
      <span class="or">or</span>
      <button type="button" class="browse" @click="input?.click()">browse from device</button>
      <input
        ref="input"
        type="file"
        multiple
        class="visually-hidden"
        tabindex="-1"
        @change="onPick"
      />
    </div>

    <TransitionGroup v-if="attachments.length" tag="ul" name="list" class="files">
      <li v-for="file in attachments" :key="file.id" class="file">
        <span class="file-icon" aria-hidden="true">
          <IonIcon :icon="fileIcon" />
          <small>{{ extension(file.name) }}</small>
        </span>
        <span class="file-info">
          <strong :title="file.name">{{ file.name }}</strong>
          <small>{{ formatFileSize(file.size) }}</small>
        </span>
        <IconButton
          :icon="closeIcon"
          :label="`Remove ${file.name}`"
          @click="emit('remove', file.id)"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 8px;
  min-height: 60px;
  padding: 12px 16px;
  border: 1px dashed #c3ced6;
  border-radius: var(--r-md);
  background: var(--c-surface);
  color: var(--c-text);
  font-size: var(--fs-sm);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.is-dragging {
  border-color: var(--c-primary);
  background: var(--c-primary-soft);
}

.icon {
  font-size: 18px;
}

.or {
  margin: 0 4px;
  color: var(--c-text-subtle);
}

.browse {
  padding: 0;
  border: 0;
  background: none;
  color: var(--c-primary);
  font-size: inherit;
  cursor: pointer;
}

.browse:hover {
  text-decoration: underline;
}

.files {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 10px;
  border: 1px solid var(--c-border-soft);
  border-radius: var(--r-md);
}

.file-icon {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  background: var(--c-primary-soft);
  color: var(--c-primary-ink);
}

.file-icon ion-icon {
  font-size: 20px;
  opacity: 0.35;
}

.file-icon small {
  position: absolute;
  font-size: 9px;
  font-weight: 700;
}

.file-info {
  display: grid;
  flex: 1;
  min-width: 0;
}

.file-info strong {
  overflow: hidden;
  font-size: var(--fs-md);
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file-info small {
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s var(--ease);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
