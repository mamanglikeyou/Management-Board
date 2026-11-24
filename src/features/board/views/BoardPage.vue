<script setup lang="ts">
import { IonContent, IonHeader, IonPage } from '@ionic/vue';
import AddListCard from '../components/AddListCard.vue';
import BoardColumn from '../components/BoardColumn.vue';
import BoardHeader from '../components/BoardHeader.vue';
import { useBoardStore } from '../stores/board.store';

const boards = useBoardStore();
</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <BoardHeader />
    </IonHeader>

    <IonContent :scroll-y="false">
      <main class="board" :aria-label="`${boards.activeBoard.name} board`">
        <TransitionGroup name="column">
          <BoardColumn v-for="column in boards.columns" :key="column.id" :column="column" />
        </TransitionGroup>
        <AddListCard />
      </main>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.board {
  display: flex;
  align-items: stretch;
  gap: var(--column-gap);
  height: 100%;
  padding: 20px 24px 0 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border) transparent;
}

.board > :deep(.add-list) {
  margin-right: 24px;
}

.column-enter-active,
.column-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease);
}

.column-enter-from,
.column-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Mobile: one column per screen with snap scrolling. */
@media (max-width: 767px) {
  .board {
    --column-w: calc(100vw - 56px);
    gap: 16px;
    padding: 16px 16px 0;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 16px;
  }

  .board > :deep(.column),
  .board > :deep(.add-list) {
    scroll-snap-align: start;
  }

  .board > :deep(.add-list) {
    width: var(--column-w);
  }
}
</style>
