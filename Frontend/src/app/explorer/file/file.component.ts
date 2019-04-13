import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  @Input() File

  constructor (
    private router: Router
    ) {}

  ngOnInit() {
  }

  OpenFile() {
    console.log("OpenFile")
    this.router.navigate(['desktop', this.File.DocID]);
  }
}
