<script setup lang="ts">
import { IonPopover } from '@ionic/vue';
import AppButton from '@/shared/components/AppButton.vue';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import { useToast } from '@/shared/composables/useToast';
import { inviteIcon, linkIcon } from '@/shared/icons';
import { useMemberStore } from '../stores/member.store';

const members = useMemberStore();
const toast = useToast();

async function copyInviteLink() {
  const link = `${window.location.origin}/invite/demo`;
  try {
    await navigator.clipboard.writeText(link);
    toast.success('Invite link copied');
  } catch {
    toast.error('Clipboard is not available');
  }
}
</script>

<template>
  <AppButton id="invite-trigger" class="invite" :icon="inviteIcon">
    <span class="invite-text">Invite</span>
  </AppButton>

  <IonPopover trigger="invite-trigger" trigger-action="click" class="app-popover">
    <div class="panel">
      <h3>Team members</h3>
      <ul>
        <li v-for="m in members.members" :key="m.id">
          <BaseAvatar :member="m" :size="30" />
          <div>
            <strong>{{ m.name }}</strong>
            <small>{{ m.email }}</small>
          </div>
        </li>
      </ul>
      <AppButton variant="primary" block :icon="linkIcon" @click="copyInviteLink"
        >Copy invite link</AppButton
      >
    </div>
  </IonPopover>
</template>

<style scoped>
.invite {
  font-weight: 600;
}

.panel {
  width: min(300px, calc(100vw - 32px));
  padding: 16px;
}

h3 {
  margin: 0 0 10px;
  font-size: var(--fs-lg);
  font-weight: 600;
}

ul {
  display: grid;
  gap: 10px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
}

li div {
  display: grid;
  min-width: 0;
}

strong {
  font-size: var(--fs-md);
  font-weight: 600;
}

small {
  overflow: hidden;
  color: var(--c-text-muted);
  font-size: var(--fs-sm);
  text-overflow: ellipsis;
}

@media (max-width: 599px) {
  .invite-text {
    display: none;
  }

  .invite {
    padding: 0 10px;
  }
}
</style>
