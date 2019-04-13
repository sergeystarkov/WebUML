import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
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

  @ViewChild(ToolbarComponent) toolbarComp: ToolbarComponent;
  @ViewChild(ControlPanelComponent) cp : ControlPanelComponent;

  ngAfterViewInit() {

    this.graph = new mxGraph(this.graphContainer.nativeElement);
    //this.graph.setConnectable(true);
    //this.graph.setCellsDeletable(true);
    //this.graph.setEdgeLabelsMovable(true);
    this.graph.setAllowNegativeCoordinates(true);
    this.graph.collapseToPreferredSize = false;


    // set default styles for graph
    const style = this.graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.DEFAULT_VALID_COLOR] = '#00FF00';
    this.graph.getStylesheet().putDefaultVertexStyle(style);
/*
    // add cells
    try {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      const vertex1 = this.graph.insertVertex(parent, '1', 'Vertex 1', 0, 0, 200, 80);
      const vertex2 = this.graph.insertVertex(parent, '2', 'Vertex 2', 0, 0, 200, 80);
      this.graph.insertEdge(parent, '', '', vertex1, vertex2);
    } finally {
      this.graph.getModel().endUpdate();
      new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
    }

    var encoder = new mxCodec();
    var result = encoder.encode(this.graph.getModel());
    var xml = mxUtils.getXml(result);
    //console.log(xml);

    this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()), this.graph.getAllEdges(this.graph.getChildVertices(this.graph.getDefaultParent())));
*/

    
    setTimeout(() => {
      this.toolbarComp.graph = this.graph;
      this.toolbarComp.InitToolbar();
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
          data.SnapshotData.Data ='<root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';
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
