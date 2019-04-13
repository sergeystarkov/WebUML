import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() filename: string;

  constructor(
    private API: APIService,
    private router: Router
  ) { }
  ngOnInit() {
  }

  loggedIn() {
    return this.API.loggedIn()
  }

  newDocument() {
    this.API.newDocument(this.filename);
    this.router.navigate(['explorer']);
  }

  toExplorer() {
    this.router.navigate(['explorer']);
  }
}
