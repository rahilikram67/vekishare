import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakeprofilePageRoutingModule } from './makeprofile-routing.module';

import { MakeprofilePage } from './makeprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakeprofilePageRoutingModule
  ],
  declarations: [MakeprofilePage]
})
export class MakeprofilePageModule {}
