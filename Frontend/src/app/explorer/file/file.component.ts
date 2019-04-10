import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  @Input() File

  constructor (
    private API : APIService,
    private router: Router
    ) {}

  ngOnInit() {
  }

  OpenFile() {
    console.log("OpenFile")
    this.API.getSnapshots(this.File.DocID).subscribe(data => {
      console.log(data)
      this.router.navigate(['desktop']);
    });
  }
}
