import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WatchprofilePage } from './watchprofile.page';

const routes: Routes = [
  {
    path: '',
    component: WatchprofilePage
  },
  {
    path: 'person',
    loadChildren: () => import('./person/person.module').then( m => m.PersonPageModule)
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchprofilePageRoutingModule {}
