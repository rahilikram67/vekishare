import { Component } from '@angular/core';

import { Platform, IonicModule, PopoverController,MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { PopoverDriverPage } from "./home/popover/popover.page";


import { PopoverMppPage } from "./home/popover-mpp/popover-mpp.page" 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  mobile_menu = [
    {
      title: 'Home',
      icon: 'home',
      number: '0',
      router: '/',
      licon: ''
    },
    {
      title: 'Driver',
      icon: 'car',
      number: '1',
      router: undefined,
      licon: 'caret-down-outline'
    },
    {
      title: 'Passenger',
      icon: 'navigate',
      number: '2',
      router: undefined,
      licon: 'caret-down-outline'
    },
    {
      title: 'My Public Profile',
      icon: 'people',
      number: '4',
      router: undefined,
      licon: 'caret-down-outline'
    },
    {
      title: 'Locations',
      icon: 'location',
      number: '3',
      router: undefined,
      licon: 'caret-down-outline'
    },
  ]

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private popover:PopoverController,
    public menu:MenuController
  ) {
      this.initializeApp();
      
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async presentPopover(ev: Event, n: Number,log) {
    
    if(log=="Home"){
      this.menu.close()
    }

    if(n==0){
      return
    }
    var a = [{
      p1:{text:"Make Driver Profile",link:['makeprofile',{id:'driver'}]},
      p2:{text:"Drivers in Your Area",link:['watchprofile',{id:'driver'}]}
    }, {
      p1:{text:"Make Passenger Profile",link:['makeprofile',{id:'passenger'}]},
      p2:{text:"Passenger in Your Area",link:['watchprofile',{id:'passenger'}]}
    }, {
      p1:{text:"All Registered Drivers",link:['locations',{id:'driver'}]},
      p2:{text:"All Registered Passengers",link:['locations',{id:'passenger'}]}
    }]

    var componentProps = (n == 1) ? a[0] : (n == 2) ? a[1] : a[2]
    var component=(n>0 && n<4)?PopoverDriverPage:PopoverMppPage
    const popover = await this.popover.create({
      component: component,
      event: ev,
      animated: true,
      showBackdrop: false,
      translucent: true,
      mode: (n == 4) ? "ios" : "md",
      componentProps:componentProps
    });
    await popover.present();
  }
}
