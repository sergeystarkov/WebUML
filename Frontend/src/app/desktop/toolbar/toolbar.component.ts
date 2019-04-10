import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
declare var mxPerimeter: any;
declare var mxConstants: any;
declare var mxUtils: any;
declare var mxCodec: any;
declare var mxToolbar: any;
declare var mxCell: any;
declare var mxGeometry: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements AfterViewInit {

  constructor() { }

  @ViewChild('tbContainer') tbContainer: ElementRef;
  private toolbar: any;

  @Input() graph: mxGraph;

  ngAfterViewInit() {
    this.toolbar = new mxToolbar(this.tbContainer.nativeElement);
    //this.InitToolbar();
  }

  public InitToolbar(): void {
    console.log(this.graph) 
    /*this.addVertex('editors/images/swimlane.gif', 120, 160, 'shape=swimlane;startSize=20;');
    this.addVertex('editors/images/rectangle.gif', 100, 40, '');
    this.addVertex('editors/images/rounded.gif', 100, 40, 'shape=rounded');
    this.addVertex('editors/images/ellipse.gif', 40, 40, 'shape=ellipse');
    this.addVertex('editors/images/rhombus.gif', 40, 40, 'shape=rhombus');
    this.addVertex('editors/images/triangle.gif', 40, 40, 'shape=triangle');
    this.addVertex('editors/images/cylinder.gif', 40, 40, 'shape=cylinder');
    this.addVertex('editors/images/actor.gif', 30, 40, 'shape=actor');
    this.toolbar.addLine();*/

    //Case tool
    new tool(
      this.graph,
      this.toolbar,
      'Case',
      'assets/images/UML/UML_Line.png',
      200, 120,
      'shape=line'
    );
    //Actor tool
    new tool(
      this.graph,
      this.toolbar,
      'Actor',
      'assets/images/UML/UML_Actor.png',
      90, 120,
      'shape=actor'
    );
    //Case tool
    new tool(
      this.graph,
      this.toolbar,
      'Case',
      'assets/images/UML/UML_Case.png',
      200, 120,
      'shape=ellipse'
    );
  }
}

export class tool {
  constructor(
    private graph: mxGraph,
    private toolbar: any,
    private title: string,
    private icon: string,
    private w: number,
    private h: number,
    private style: string
  ) { 
    this.addVertex();
  }

  addVertex() {
    var vertex = new mxCell(null, new mxGeometry(0, 0, this.w, this.h), this.style);
    vertex.setVertex(true);
    this.addToolbarItem(this.graph, this.toolbar, vertex, this.icon);
  }

  addToolbarItem(graph: mxGraph, toolbar: any, prototype, image) {
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
