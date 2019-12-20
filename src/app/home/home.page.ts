import { Component } from '@angular/core';
import { FirebaseAuthService } from '../providers/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util.service';
import { Router } from '@angular/router';
import { FirestoreDbService } from '../providers/firestore-db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  productList: Array<any> = [];
  productAvailable: boolean = false;

  constructor(private firebaseAuthService: FirebaseAuthService, private widgetUtilService: WidgetUtilService,
    private router: Router, private firestoreDbService: FirestoreDbService) {
      this.getProductList();
    }
  
  async logout(){
    try{
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast("Cerrar sesión exitosa");
      this.router.navigate(['/login'])
    }catch (error){
      console.log("Error", error);
      this.widgetUtilService.presentToast(error.message);
    }
    
  }

  getProductList(event = null){
    this.productAvailable = false;
    this.firestoreDbService.getProductList().subscribe (result => {
      console.log('result', result);
      this.productList = result;
      this.productAvailable = true;
      this.handleRefresher(event);
    }, (error) => {
      this.widgetUtilService.presentToast(error.message);
      this.productAvailable = true;
      this.handleRefresher(event);
    })
  }

  handleRefresher(event){
    if(event){
      event.target.complete();
    }
  }

  doRefresh(event) {
    this.getProductList(event);
  }
}
