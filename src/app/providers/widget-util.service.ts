import { Injectable } from '@angular/core';
//import { create } from 'domain';
import { ToastController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {

  loading: any = {};

  constructor(private toastController: ToastController, private platform: Platform, private loadingController: LoadingController) { }

  async presentToast(message){
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      showCloseButton: true,
      position: this.platform.is('desktop') ? 'top': 'bottom'
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Por favor espere...",
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoader(){
    await this.loading.dismiss();
  }
}
