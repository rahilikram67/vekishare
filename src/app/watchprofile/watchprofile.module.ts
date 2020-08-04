import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WatchprofilePageRoutingModule } from './watchprofile-routing.module';

import { WatchprofilePage } from './watchprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WatchprofilePageRoutingModule
  ],
  declarations: [WatchprofilePage]
})
export class WatchprofilePageModule {}
