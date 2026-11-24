<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="section">
    <header v-if="title || $slots.header" class="section-header">
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.section {
  padding: 32px var(--section-x, 40px) 36px;
  border-bottom: 1px solid var(--c-border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  font-size: var(--fs-3xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--c-text);
}
</style>
