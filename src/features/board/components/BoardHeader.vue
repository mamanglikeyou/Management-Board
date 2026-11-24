<script setup lang="ts">
import FilterButton from '@/features/filter/components/FilterButton.vue';
import SearchInput from '@/features/filter/components/SearchInput.vue';
import InviteButton from '@/features/members/components/InviteButton.vue';
import { useMemberStore } from '@/features/members/stores/member.store';
import ExportImportButton from '@/features/transfer/components/ExportImportButton.vue';
import AvatarStack from '@/shared/components/AvatarStack.vue';
import BoardSwitcher from './BoardSwitcher.vue';

const members = useMemberStore();
</script>

<template>
  <div class="header">
    <div class="left">
      <BoardSwitcher />
      <AvatarStack :members="members.members" :max="4" :size="32" :overlap="8" class="team" />
      <InviteButton />
    </div>
    <div class="right">
      <FilterButton />
      <ExportImportButton />
      <SearchInput class="search" />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--header-h);
  padding: 0 40px 0 24px;
  border-bottom: 1px solid var(--c-border-soft);
  background: var(--c-bg);
}

.left,
.right {
  display: flex;
  align-items: center;
  min-width: 0;
}

.left {
  gap: 28px;
}

.right {
  gap: 14px;
}

.search {
  margin-left: 18px;
}

/* ---- Tablet ---- */
@media (max-width: 1023px) {
  .header {
    padding: 0 16px;
  }

  .left {
    gap: 16px;
  }

  .right {
    gap: 4px;
  }

  .search {
    width: 220px;
    margin-left: 6px;
  }
}

/* ---- Mobile: two rows, search goes full width ---- */
@media (max-width: 767px) {
  .header {
    flex-wrap: wrap;
    row-gap: 10px;
    height: auto;
    padding: 10px 16px 12px;
  }

  .left {
    flex: 1;
    gap: 12px;
  }

  .team {
    display: none;
  }

  .right {
    display: contents;
  }

  .search {
    order: 3;
    width: 100%;
    margin-left: 0;
  }
}
</style>
