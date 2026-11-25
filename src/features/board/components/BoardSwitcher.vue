<script setup lang="ts">
import { IonIcon, IonPopover } from '@ionic/vue';
import { checkIcon, chevronDownIcon, lockIcon } from '@/shared/icons';
import { useBoardStore } from '../stores/board.store';

const boards = useBoardStore();
</script>

<template>
  <button id="board-switcher" type="button" class="switcher" aria-label="Switch board">
    <IonIcon :icon="lockIcon" class="lock" aria-hidden="true" />
    <span class="name">{{ boards.activeBoard.name }}</span>
    <IonIcon :icon="chevronDownIcon" class="chevron" aria-hidden="true" />
  </button>

  <IonPopover
    trigger="board-switcher"
    trigger-action="click"
    class="app-popover"
    :dismiss-on-select="true"
  >
    <ul class="list" role="menu">
      <li v-for="b in boards.boards" :key="b.id">
        <button
          type="button"
          role="menuitemradio"
          :aria-checked="b.id === boards.activeBoardId"
          @click="boards.setActiveBoard(b.id)"
        >
          <IonIcon :icon="lockIcon" aria-hidden="true" />
          <span>{{ b.name }}</span>
          <IonIcon
            v-if="b.id === boards.activeBoardId"
            :icon="checkIcon"
            class="check"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </IonPopover>
</template>

<style scoped>
.switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 40px;
  padding: 0 8px;
  margin-left: -8px;
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--c-text);
  cursor: pointer;
}

.switcher:hover {
  background: var(--c-surface);
}

.lock {
  flex: none;
  font-size: 17px;
}

.name {
  overflow: hidden;
  font-size: var(--fs-2xl);
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.chevron {
  flex: none;
  margin-left: 4px;
  font-size: 18px;
}

.list {
  margin: 0;
  padding: 6px;
  list-style: none;
}

.list button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--c-text);
  font-size: var(--fs-md);
  text-align: left;
  cursor: pointer;
}

.list button:hover {
  background: var(--c-surface);
}

.check {
  margin-left: auto;
  color: var(--c-primary);
}

@media (max-width: 1023px) {
  .switcher {
    flex: none;
  }

  .name {
    font-size: var(--fs-xl);
    font-weight: 600;
  }

  .chevron {
    margin-left: 0;
  }
}
</style>
