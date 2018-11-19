import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor() { }

  @ViewChild('canvas') public canvas: ElementRef;
  // setting a width and height for the canvas
  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;
  ngOnInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // set some default properties about the line
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    // we'll implement this method to start capturing mouse events
    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousemove')
      .subscribe((res: MouseEvent) => {
        console.log(res.layerX + 'x' + res.layerY);
        /*const rect = canvasEl.getBoundingClientRect();
        this.originPoint = new Point();
        this.originPoint.x = res.clientX;
        this.originPoint.y = res.clientY;
        this.startPoint = new Point();
        this.startPoint.x = res.clientX - rect.left;
        this.startPoint.y = res.clientY - rect.top;*/
      });

  }
}
