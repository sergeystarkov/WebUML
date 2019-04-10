import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DesktopComponent} from './desktop/desktop.component';
import { ExplorerComponent } from './explorer/explorer.component'

const routes: Routes = [
  { path: 'explorer', component: ExplorerComponent },
  { path: 'desktop', component: DesktopComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
