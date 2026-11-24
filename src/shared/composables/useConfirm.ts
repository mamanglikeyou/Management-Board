import { alertController } from '@ionic/vue';

interface ConfirmOptions {
  header: string;
  message: string;
  confirmText?: string;
  destructive?: boolean;
}

/** Promise-based confirmation dialog. Resolves `true` when the user confirms. */
export function useConfirm() {
  return async function confirm(options: ConfirmOptions): Promise<boolean> {
    const alert = await alertController.create({
      header: options.header,
      message: options.message,
      cssClass: 'app-alert',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: options.confirmText ?? 'Confirm',
          role: 'confirm',
          cssClass: options.destructive ? 'alert-button-danger' : undefined,
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  };
}
