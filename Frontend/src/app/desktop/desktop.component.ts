import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
import { ToolbarComponent, tool } from './toolbar/toolbar.component';
import { ControlPanelComponent } from '../control-panel/control-panel.component'
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../api.service';
import { from } from 'rxjs';

declare var mxPerimeter: any;
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxToolbar: any;
declare var mxCell: any;
declare var mxGeometry: any;

@Component({
  providers: [],
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})
export class DesktopComponent implements AfterViewInit {

  constructor(
    private Route: ActivatedRoute
    , private API: APIService
  ) { }

  @ViewChild('graphContainer') graphContainer: ElementRef;
  private graph: mxGraph;

  public graphXML: any;

  ToolBars = [ ];

  @ViewChild(ToolbarComponent) toolbarComp: ToolbarComponent;
  @ViewChild(ControlPanelComponent) cp: ControlPanelComponent;

  ngAfterViewInit() {

    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.graph.setConnectable(true);
    this.graph.setCellsDeletable(true);
    this.graph.setEdgeLabelsMovable(true);
    this.graph.setAllowNegativeCoordinates(true);
    this.graph.collapseToPreferredSize = false;

    // set default styles for graph
    const style = this.graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.DEFAULT_VALID_COLOR] = '#00FF00';
    this.graph.getStylesheet().putDefaultVertexStyle(style);

    setTimeout(() => {
      this.ToolBars = [{
        graph: this.graph,
        title: 'Actor',
        icon: 'assets/images/UML/UML_Actor.png',
        w: 90, h: 120,
        style: 'shape=actor'
      },
      {
        graph: this.graph,
        title: 'Case',
        icon: 'assets/images/UML/UML_Case.png',
        w: 200, h: 120,
        style: 'shape=ellipse'
      },
      {
        graph: this.graph,
        title: 'Line',
        icon: 'assets/images/UML/UML_Line.png',
        w: 200, h: 120,
        style: 'shape=line'
      }];
      this.cp.loadSnapshots();
    }, 500);

    setTimeout(() => {
      this.serializeGraph()
    }, 1000);

  }

  serializeGraph(): void {

    var encoder = new mxCodec();
    var result = encoder.encode(this.graph.getModel());
    this.graphXML = mxUtils.getXml(result);

    setTimeout(() => {
      this.serializeGraph()
    }, 500);
  }

  loggedIn(): boolean {
    return this.API.loggedIn();
  }
  saveSnapshot() {
    console.log("saveSnapshot()")
    var Request = { DocID: this.Route.snapshot.params.id, Data: this.graphXML }
    console.log(Request);
    this.API.saveSnapshot(Request).
      subscribe(data => {
        console.log(data)
        this.cp.loadSnapshots();
      });
  }

  loadSnapshot(snapshot: any) {
    console.log("loadSnapshot()")
    this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()), this.graph.getAllEdges(this.graph.getChildVertices(this.graph.getDefaultParent())));

    this.API.loadSnapshot(snapshot.SnapshotID).
      subscribe(data => {
        console.log(data)
        try {
          var xml = mxUtils.parseXml(data.SnapshotData.Data).documentElement;
          this.graph.getModel().beginUpdate();
          this.graph.model.clear();
          var doc = mxUtils.parseXml(xml);
          var codec = new mxCodec(doc);
          codec.decode(xml, this.graph.getModel());
        }
        finally {
          this.graph.getModel().endUpdate();
          new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
        }
      });
    ;
  }
}
