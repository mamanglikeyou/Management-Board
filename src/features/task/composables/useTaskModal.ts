import { modalController } from '@ionic/vue';
import TaskDetailModal from '../components/TaskDetailModal.vue';

export interface TaskModalProps {
  /** Existing task to edit; omit to create a new one. */
  taskId?: string;
  /** Column for a new task. */
  columnId?: string;
}

/** Single entry point for opening the task detail view (create & edit). */
export function useTaskModal() {
  async function open(props: TaskModalProps) {
    const modal = await modalController.create({
      component: TaskDetailModal,
      componentProps: props,
      cssClass: 'task-modal',
    });
    await modal.present();
    return modal;
  }

  return {
    openTask: (taskId: string) => open({ taskId }),
    openCreate: (columnId: string) => open({ columnId }),
  };
}
