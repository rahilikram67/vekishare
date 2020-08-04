import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakeprofilePage } from './makeprofile.page';

const routes: Routes = [
  {
    path: '',
    component: MakeprofilePage
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeprofilePageRoutingModule {}
