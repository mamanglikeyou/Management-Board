<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonContent, IonFooter, IonHeader, modalController } from '@ionic/vue';
import AppButton from '@/shared/components/AppButton.vue';
import IconButton from '@/shared/components/IconButton.vue';
import SectionBlock from '@/shared/components/SectionBlock.vue';
import { checkIcon, closeIcon, trashIcon } from '@/shared/icons';
import { useTaskForm } from '../composables/useTaskForm';
import TaskActivityList from './detail/TaskActivityList.vue';
import TaskAttachmentsField from './detail/TaskAttachmentsField.vue';
import TaskChecklistField from './detail/TaskChecklistField.vue';
import TaskCoverField from './detail/TaskCoverField.vue';
import TaskDescriptionField from './detail/TaskDescriptionField.vue';
import TaskPropertiesForm from './detail/TaskPropertiesForm.vue';
import TaskTitleField from './detail/TaskTitleField.vue';

const props = defineProps<{ taskId?: string; columnId?: string }>();

const form = useTaskForm({ taskId: props.taskId, columnId: props.columnId });
const { draft, progress, activity, boardColumns, isNew } = form;

const root = ref<HTMLElement>();

/** Close paths (X, Discard, backdrop, Esc) all go through the dirty-check guard. */
onMounted(() => {
  const modal = root.value?.closest('ion-modal');
  if (modal) {
    modal.canDismiss = async (_data?: unknown, role?: string) =>
      role === 'saved' || role === 'deleted' || form.confirmDiscard();
  }
});

const close = () => modalController.dismiss(undefined, 'cancel');

function save() {
  if (form.save()) modalController.dismiss(undefined, 'saved');
}

async function remove() {
  if (await form.remove()) modalController.dismiss(undefined, 'deleted');
}
</script>

<template>
  <div ref="root" class="ion-page task-detail">
    <IonHeader class="ion-no-border">
      <div class="topbar">
        <AppButton
          size="sm"
          :icon="checkIcon"
          class="complete"
          :class="{ 'is-complete': draft.completed }"
          :aria-pressed="draft.completed"
          @click="draft.completed = !draft.completed"
        >
          {{ draft.completed ? 'Completed' : 'Mark Complete' }}
        </AppButton>
        <div class="topbar-actions">
          <IconButton
            v-if="!isNew"
            :icon="trashIcon"
            label="Delete task"
            variant="soft"
            :size="29"
            @click="remove"
          />
          <IconButton :icon="closeIcon" label="Close" variant="soft" :size="29" @click="close" />
        </div>
      </div>
    </IonHeader>

    <IonContent class="body">
      <TaskCoverField v-model="draft.coverImage" />

      <SectionBlock>
        <TaskTitleField v-model="draft.title" :autofocus="isNew" />
        <TaskPropertiesForm v-model="draft" :columns="boardColumns" />
      </SectionBlock>

      <SectionBlock title="Description">
        <TaskDescriptionField v-model="draft.description" />
      </SectionBlock>

      <SectionBlock title="Attachments">
        <TaskAttachmentsField
          :attachments="draft.attachments"
          @add="form.addFiles"
          @remove="form.removeAttachment"
        />
      </SectionBlock>

      <SectionBlock title="Check List">
        <TaskChecklistField
          :subtasks="draft.subtasks"
          :progress="progress"
          @add="form.addSubtask"
          @toggle="form.toggleSubtask"
          @remove="form.removeSubtask"
        />
      </SectionBlock>

      <SectionBlock title="Activity" class="activity">
        <TaskActivityList :entries="activity" />
      </SectionBlock>
    </IonContent>

    <IonFooter class="ion-no-border">
      <div class="footer">
        <AppButton @click="close">Discard</AppButton>
        <AppButton variant="primary" @click="save">{{ isNew ? 'Create' : 'Save' }}</AppButton>
      </div>
    </IonFooter>
  </div>
</template>

<style scoped>
.task-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 78px;
  padding: 0 40px;
  border-bottom: 1px solid var(--c-border);
  background: #fff;
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.complete {
  font-size: var(--fs-md);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.complete.is-complete {
  background: var(--c-success-soft);
  color: var(--c-success);
  font-weight: 600;
}

.body {
  --background: #fff;
  flex: 1;
}

.activity {
  min-height: 120px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 18px 40px 20px;
  border-top: 1px solid var(--c-border);
  background: #fff;
}

.footer :deep(.btn) {
  min-width: 65px;
  padding: 0 18px;
}

@media (max-width: 767px) {
  .task-detail {
    --section-x: 20px;
  }

  .topbar {
    height: 60px;
    padding: 0 20px;
    padding-top: env(safe-area-inset-top);
    height: calc(60px + env(safe-area-inset-top));
  }

  .footer {
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  }
}
</style>
