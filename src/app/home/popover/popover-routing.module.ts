import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverDriverPage } from './popover.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverDriverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverDriverPageRoutingModule {}
