import { Injectable } from '@angular/core';
import { AlertController,LoadingController } from "@ionic/angular"
@Injectable({
  providedIn: 'root'
})
export class LoadingAlertService {

  constructor(
    public alertcontrol: AlertController,
    private loader: LoadingController,
  ) { }

  async presentAlert(msg) {
    const alert = await this.alertcontrol.create({
      subHeader: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(duration, msg) {

    const loading = await this.loader.create({
      message: msg,
      duration: duration,
      showBackdrop: false
    });
    await loading.present();

  }
}
