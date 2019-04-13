import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})

export class ControlPanelComponent implements OnInit {

  public Snapshots = [
    {TimeSave: "12:14"}, 
    {TimeSave: "12:14"}, 
    {TimeSave: "12:14"}, 
    {TimeSave: "12:14"}, 
    {TimeSave: "12:14"}
  ];

  constructor(
    private API: APIService
    ,private Route : ActivatedRoute
  ) { }

  ngOnInit() {
    
  }

  public loadSnapshots(): void {
    this.API.getSnapshots(this.Route.snapshot.params.id).
    subscribe(data => {
      this.Snapshots = data.Snapshots;
      console.log(this.Snapshots)
    });
  }
  @Output() LoadSnapshotEvent = new EventEmitter();
  loadSnapshot(snapshot: any) {
    this.LoadSnapshotEvent.emit(snapshot);
  }

  @Output() SaveSnapshotEvent = new EventEmitter();
  saveDocument() {
    this.SaveSnapshotEvent.emit(null);
  }
}