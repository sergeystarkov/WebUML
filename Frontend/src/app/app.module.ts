import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { HeaderComponent } from './header/header.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ToolbarComponent } from './desktop/toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { FileComponent } from './explorer/file/file.component';

@NgModule({
  declarations: [
    AppComponent,
    DesktopComponent,
    HeaderComponent,
    ControlPanelComponent,
    ToolbarComponent,
    LoginComponent,
    ProfileComponent,
    ExplorerComponent,
    FileComponent
  ],
  imports: [
    NgbDropdownModule,
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
