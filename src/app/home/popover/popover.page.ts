import { Component, OnInit } from '@angular/core';
import { PopoverController,MenuController,NavParams } from '@ionic/angular'
@Component({
  selector: 'app-popover-driver',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverDriverPage implements OnInit {

  constructor(private popover: PopoverController,private menu:MenuController,public nav:NavParams) {

   }

  ngOnInit() {
  }
  dismiss() {
    this.popover.dismiss()
    this.menu.close()
  }
}
