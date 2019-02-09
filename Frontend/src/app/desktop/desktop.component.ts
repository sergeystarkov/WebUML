import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';

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
export class DesktopComponent implements AfterViewInit  {

  constructor() { }

  @ViewChild('graphContainer') graphContainer: ElementRef;
  private graph: mxGraph;

  @ViewChild('tbContainer') tbContainer: ElementRef;
  private toolbar: any;

  ngAfterViewInit() {
    
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    // Creates new toolbar without event processing
    this.toolbar = new mxToolbar(this.tbContainer.nativeElement);
    this.toolbar.enabled = false; 

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
    this.InitToolbar();
  }

  public InitToolbar(): void {
    this.addVertex('editors/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
    this.addVertex('editors/images/rectangle.gif', 100, 40, '');
    this.addVertex('editors/images/rounded.gif', 100, 40, 'shape=rounded');
    this.addVertex('editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
    this.addVertex('editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
    this.addVertex('editors/images/triangle.gif', 40, 40, 'shape=triangle');
    this.addVertex('editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
    this.addVertex('editors/images/actor.gif', 30, 40, 'shape=actor');
    this.toolbar.addLine();
  }

  addVertex(icon, w, h, style) {
    var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
    vertex.setVertex(true);
    this.addToolbarItem(this.graph, this.toolbar, vertex, icon);
  }

  addToolbarItem(graph: mxGraph, toolbar: any, prototype, image) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.

    console.log(graph);

    var funct = function (graph, evt, cell) {
      graph.stopEditing(false);

      var pt = graph.getPointForEvent(evt);
      var vertex = graph.getModel().cloneCell(prototype);
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode(null, image, funct);
    mxUtils.makeDraggable(img, graph, funct);
  }
}
