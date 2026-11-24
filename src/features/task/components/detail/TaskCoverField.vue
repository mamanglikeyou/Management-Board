<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { readImageAsDataUrl } from '@/core/utils/file';
import AppButton from '@/shared/components/AppButton.vue';
import { useToast } from '@/shared/composables/useToast';
import { addPhotoIcon, trashIcon } from '@/shared/icons';

const cover = defineModel<string | null>({ required: true });
const input = ref<HTMLInputElement>();
const toast = useToast();

async function onFile(event: Event) {
  const el = event.target as HTMLInputElement;
  const file = el.files?.[0];
  el.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    toast.error('Please choose an image file');
    return;
  }
  try {
    cover.value = await readImageAsDataUrl(file);
  } catch {
    toast.error('Could not load that image');
  }
}
</script>

<template>
  <div class="cover" :class="{ 'has-image': cover }">
    <template v-if="cover">
      <img :src="cover" alt="Task cover" />
      <div class="actions">
        <AppButton size="sm" :icon="addPhotoIcon" @click="input?.click()">Change</AppButton>
        <AppButton size="sm" :icon="trashIcon" @click="cover = null">Remove</AppButton>
      </div>
    </template>

    <button v-else type="button" class="add" @click="input?.click()">
      <IonIcon :icon="addPhotoIcon" aria-hidden="true" />
      <span>Add Cover Image</span>
    </button>

    <input
      ref="input"
      type="file"
      accept="image/*"
      class="visually-hidden"
      tabindex="-1"
      @change="onFile"
    />
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  display: grid;
  place-items: center;
  height: 260px;
  border-bottom: 1px solid var(--c-border);
}

.add {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--c-primary);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.add:hover {
  background: var(--c-surface);
}

.add ion-icon {
  font-size: 38px;
  color: #94a3ae;
}

.has-image {
  padding: 16px 40px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--r-md);
}

.actions {
  position: absolute;
  right: 52px;
  bottom: 28px;
  display: flex;
  gap: 8px;
}

.actions :deep(.btn) {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
}

@media (max-width: 767px) {
  .cover {
    height: 200px;
  }

  .has-image {
    padding: 12px 20px;
  }

  .actions {
    right: 32px;
    bottom: 22px;
  }
}
</style>
