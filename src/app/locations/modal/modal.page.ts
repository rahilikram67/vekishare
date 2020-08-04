import { Component} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage {

  top_down_btn
  constructor(public modal:ModalController) { }

  ngOnInit() {
    var obj = this
    function resize() {
      var w = window.innerWidth
      if (w <= 700) {
        obj.top_down_btn = true
      }
      else obj.top_down_btn = false
    }
    resize()
    window.onresize = resize
  }

}
