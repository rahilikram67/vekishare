import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'home/popover',
    loadChildren: () => import('./home/popover/popover.module').then( m => m.PopoverDriverPageModule)
  },
  {
    path: 'makeprofile',
    loadChildren: () => import('./makeprofile/makeprofile.module').then( m => m.MakeprofilePageModule)
  },
  {
    path: 'watchprofile',
    loadChildren: () => import('./watchprofile/watchprofile.module').then( m => m.WatchprofilePageModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./locations/locations.module').then( m => m.LocationsPageModule)
  },
  {
    path: 'popover-mpp',
    loadChildren: () => import('./home/popover-mpp/popover-mpp.module').then( m => m.PopoverMppPageModule)
  },
  
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy:PreloadAllModules,useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
