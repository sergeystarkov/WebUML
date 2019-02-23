import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { HeaderComponent } from './header/header.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ToolbarComponent } from './desktop/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DesktopComponent,
    HeaderComponent,
    ControlPanelComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
