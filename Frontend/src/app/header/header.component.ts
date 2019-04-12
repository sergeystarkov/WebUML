import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private API: APIService,
    private router: Router
  ) { }
  ngOnInit() {
  }

  loggedIn() {
    // return this.API.loggedIn()
    return true
  }

  newDocument() {
    this.API.newDocument("123");
  }

  toExplorer() {
    this.router.navigate(['explorer']);
  }
}
