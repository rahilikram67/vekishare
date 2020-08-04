import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';



import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from "@angular/fire/database"
import { AngularFireMessagingModule } from "@angular/fire/messaging"
import { AngularFireStorageModule } from "@angular/fire/storage"

import { PopoverDriverPageModule } from './home/popover/popover.module'
import { PopoverMppPageModule } from "./home/popover-mpp/popover-mpp.module"
import { ModalPageModule } from "./locations/modal/modal.module"



 var config = {
  apiKey: "AIzaSyBTLGtHOxqA3GBdls_1Abk5N_ljAiQTMlo",
  authDomain: "vekishare.firebaseapp.com",
  databaseURL: "https://vekishare.firebaseio.com",
  projectId: "vekishare",
  storageBucket: "vekishare.appspot.com",
  messagingSenderId: "744563302782",
  appId: "1:744563302782:web:c7cc52bf4d390b4928d32f"
};

var fireArray = [
  AngularFireModule.initializeApp(config),
  AngularFirestoreModule,
  AngularFireAuthModule,
  AngularFireMessagingModule,
  AngularFireDatabaseModule,
  AngularFireStorageModule
]

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports:
    [BrowserModule, IonicModule.forRoot(), AppRoutingModule,

      fireArray,

      PopoverDriverPageModule,
      ModalPageModule,
      PopoverMppPageModule      
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
