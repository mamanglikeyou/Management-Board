<script setup lang="ts">
import { ref } from 'vue';
import ActionMenu, { type ActionMenuItem } from '@/shared/components/ActionMenu.vue';
import HeaderAction from '@/shared/components/HeaderAction.vue';
import { exchangeIcon, exportIcon, importIcon, resetIcon } from '@/shared/icons';
import { useTransfer } from '../useTransfer';

const { exportJson, importFile, resetDemo } = useTransfer();
const fileInput = ref<HTMLInputElement>();

const items: ActionMenuItem[] = [
  { key: 'export', text: 'Export as JSON', icon: exportIcon },
  { key: 'import', text: 'Import from JSON', icon: importIcon },
  { key: 'reset', text: 'Reset demo data', icon: resetIcon, danger: true },
];

function onSelect(key: string) {
  if (key === 'export') exportJson();
  if (key === 'import') fileInput.value?.click();
  if (key === 'reset') resetDemo();
}

function onFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) importFile(file);
  input.value = '';
}
</script>

<template>
  <HeaderAction id="export-import-trigger" :icon="exchangeIcon" text="Export / Import" />
  <ActionMenu trigger="export-import-trigger" :items="items" @select="onSelect" />
  <input
    ref="fileInput"
    type="file"
    accept="application/json,.json"
    class="visually-hidden"
    tabindex="-1"
    @change="onFile"
  />
</template>
