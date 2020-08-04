import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverMppPageRoutingModule } from './popover-mpp-routing.module';

import { PopoverMppPage } from './popover-mpp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverMppPageRoutingModule
  ],
  declarations: [PopoverMppPage]
})
export class PopoverMppPageModule {}
