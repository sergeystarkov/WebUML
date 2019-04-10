import { Component, ViewChild, ElementRef, AfterViewInit, OnInit  } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';

declare var mxPerimeter: any;
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxToolbar: any;
declare var mxCell: any;
declare var mxGeometry: any;

@Component({
  providers:[],
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})
export class DesktopComponent implements AfterViewInit   {

  constructor() { }

  @ViewChild('graphContainer') graphContainer: ElementRef;
  private graph: mxGraph;

  public graphXML:any;
  @ViewChild(ToolbarComponent) toolbarComp : ToolbarComponent;

  ngAfterViewInit() {
    
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.graph.setConnectable(true);
    this.graph.setCellsDeletable(true);
    this.graph.setEdgeLabelsMovable(true);

    // set default styles for graph
    const style = this.graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.DEFAULT_VALID_COLOR] = '#00FF00';
    this.graph.getStylesheet().putDefaultVertexStyle(style);

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


    try {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      
      var doc = mxUtils.parseXml(xml);
      var codec = new mxCodec(doc);
      codec.decode(doc.documentElement, this.graph.getModel());
    } 
    finally {
      this.graph.getModel().endUpdate();
      new mxHierarchicalLayout(this.graph).execute(this.graph.getDefaultParent());
    }
    
    setTimeout(() => {
      this.toolbarComp.graph = this.graph;
      this.toolbarComp.InitToolbar();
    }, 500);
    
    setTimeout(() => {
      this.serializeGraph()
    }, 1000);
    
  }

  serializeGraph() : void {

    var encoder = new mxCodec();
    var result = encoder.encode(this.graph.getModel());
    this.graphXML = mxUtils.getXml(result);

    setTimeout(() => {
      this.serializeGraph()
    }, 500);
  }
  
}
