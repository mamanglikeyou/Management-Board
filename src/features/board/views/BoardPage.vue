<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonHeader, IonPage } from '@ionic/vue';
import { useMediaQuery } from '@/shared/composables/useMediaQuery';
import AddListCard from '../components/AddListCard.vue';
import BoardColumn from '../components/BoardColumn.vue';
import BoardHeader from '../components/BoardHeader.vue';
import ColumnTabs from '../components/ColumnTabs.vue';
import { useColumnPager } from '../composables/useColumnPager';
import { useBoardStore } from '../stores/board.store';

const boards = useBoardStore();
const boardEl = ref<HTMLElement>();
const isMobile = useMediaQuery('(max-width: 767px)');
const { activeIndex, goTo } = useColumnPager(boardEl, isMobile);
</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <BoardHeader />
      <ColumnTabs
        v-if="isMobile"
        :columns="boards.columns"
        :active-index="activeIndex"
        @select="goTo"
      />
    </IonHeader>

    <IonContent :scroll-y="false">
      <main ref="boardEl" class="board" :aria-label="`${boards.activeBoard.name} board`">
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
  position: relative;
  display: flex;
  align-items: stretch;
  gap: var(--column-gap);
  height: 100%;
  padding: 20px 24px 0 20px;
  overflow-x: auto;
  overflow-y: hidden;
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

/*
 * Mobile: one column per screen. Paging is handled by useColumnPager
 * (a short swipe flips the column) instead of CSS scroll-snap.
 */
@media (max-width: 767px) {
  .board {
    --column-w: calc(100vw - 56px);
    gap: 16px;
    padding: 16px 16px 0;
    scrollbar-width: none;
  }

  .board::-webkit-scrollbar {
    display: none;
  }

  .board > :deep(.add-list) {
    width: var(--column-w);
  }
}
</style>
