import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverDriverPageRoutingModule } from './popover-routing.module';

import { PopoverDriverPage } from './popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverDriverPageRoutingModule
  ],
  declarations: [PopoverDriverPage]
})
export class PopoverDriverPageModule {}
