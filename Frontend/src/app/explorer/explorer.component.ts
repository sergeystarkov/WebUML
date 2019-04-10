import { Component, OnInit, Input, Output } from '@angular/core';
import { FileComponent } from './file/file.component'
import { APIService } from '../api.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit {

  public Files = [];
  timerVar;

  constructor(private API: APIService) {
  }

  ngOnInit() {
    this.GetFiles();
  }

  FilesUpdateTicker() {
    this.timerVar = setTimeout(() => {
      this.GetFiles();
      this.FilesUpdateTicker();
    }, 1000);
  }

  GetFiles() {
    this.API.getDocuments().
      subscribe(data => {
        this.Files = data.Documents
        console.log(this.Files)
      });
  }
}