import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverDriverPage } from "./popover/popover.page";
import { PopoverMppPage } from "./popover-mpp/popover-mpp.page"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {



  pc_menu = [
    {
      size: '1.28',
      offset: '1',
      number: '1',
      title: 'Driver'
    },
    {
      size: '1.7',
      offset: '0',
      number: '2',
      title: 'Passenger'
    },
    {
      size: '1.7',
      offset: '0',
      number: '3',
      title: 'Locations'
    },
    {
      size: '2.0',
      offset: '0',
      number: '4',
      title: 'My Public Profile'
    }

  ]


  constructor(private popover: PopoverController) {
  }




  async presentPopover(ev: Event, n: Number) {

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


