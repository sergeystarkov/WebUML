import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../api.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})

export class ControlPanelComponent implements OnInit {

  public Snapshots = [{TimeSave: "12:14"}, {TimeSave: "12:14"}, {TimeSave: "12:14"}, {TimeSave: "12:14"}, {TimeSave: "12:14"}];

  @Input() WorkingGraph: any;
  @Input() WorkingDocID: number;
  @Input() WorkingSnapshotID: number;
  @Input() DocID: number;

  constructor(
    private API: APIService
  ) { }

  ngOnInit() {
    this.DocID = 12;
    this.API.getSnapshots(this.DocID).
      subscribe(data => {
        this.Snapshots = data.Snapshots;
        console.log(this.Snapshots)
      });
  }

  loadSnapshot(snapshot: any) {
    console.log(snapshot);

    //CurrentSnapshot
  }

  saveDocument() {
    //onsole.log(this.CurrentWork);
    //this.API.
  }
}