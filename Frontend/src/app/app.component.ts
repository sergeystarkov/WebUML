import { Component } from '@angular/core';

import { APIService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';

  constructor (private API : APIService) {
  }

  loggedIn() {
    // return this.API.loggedIn()
    return true
  }
}
