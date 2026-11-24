import { toastController } from '@ionic/vue';
import { checkmarkCircle, alertCircle } from 'ionicons/icons';

type ToastKind = 'success' | 'error';

/** Small, consistent toast notifications for CRUD feedback. */
export function useToast() {
  async function show(message: string, kind: ToastKind = 'success') {
    await toastController.dismiss().catch(() => undefined);
    const toast = await toastController.create({
      message,
      duration: 2200,
      position: 'bottom',
      icon: kind === 'success' ? checkmarkCircle : alertCircle,
      cssClass: ['app-toast', kind === 'error' ? 'is-error' : 'is-success'],
      swipeGesture: 'vertical',
    });
    await toast.present();
  }

  return {
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
  };
}
