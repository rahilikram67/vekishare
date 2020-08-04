import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverMppPage } from './popover-mpp.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverMppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverMppPageRoutingModule {}
