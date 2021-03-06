import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {
  counter: number
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  name: string;
  svg;
  color;
  apiData
  circles = []

  private width = 800
  private height = 400

  constructor(
    element: ElementRef,
    d3Service: D3Service,
    private apiService: ApiService) {
      this.d3 = d3Service.getD3();
      this.parentNativeElement = element.nativeElement;
     }

  ngOnInit() {
    this.counter=0;
    this.error = null;
    this.loadD3()
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    // this.clickSvg()
    // this.loadData()
    //   .then(() => this.loadD3())
    //   .catch((err) => this.error = `error: ${this.apiService.error}`)

  }

  ngAfterViewInit(): void {
    this.svg = this.d3.select("svg");
    console.log(this.svg)
    
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    var simulation = this.d3.forceSimulation()
      .force("x", this.d3.forceX(width / 2).strength(0.05))
      .force("y", this.d3.forceY(height / 2).strength(0.05))

    this.getCoords()
  }

  drawShape(x,y) {
    this.counter++
    var g = this.svg
      .append('g')

      g  
      .append('circle')
      .attrs({
        r: 5,
        cx: x,
        cy: y,
        fill: 'green'//() => this.color()
      })
      .transition() // First fade to green.
      .duration(250)
      .attrs({
        r: 40
      })
    
      g  
      .append('text')
      .text(this.counter)
      // .style("fill", "blue")
      .transition() // First fade to green.
      .duration(500)
      .attrs({
        x: x,
        y: y,
        'font-family': 'sans-serif',
        'font-size': '12px',
        'fill': 'white'
        // 'anchor-point': 'middle'
      })
    
  }

  getCoords() {
    this.svg.on('click', () => {
      // var circle = this.svg.select('circle')
      // circle.attrs({
      //   fill: 'red'
      // })  
      var evX = this.d3.event.layerX;
      var evY = this.d3.event.layerY;
      // console.log(evX, evY);
      var bounds: any = document
        .getElementsByTagName('svg')[0]
        .getBoundingClientRect()
      let x = evX - bounds.x;
      let y = evY - bounds.y
      this.drawShape(x, y)
      console.log(x,y)
    })
  }

  loadData() {
    return this.apiService.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
        }
      )
  }

  loadD3() {
    let d3 = this.d3;
    let d3ParentElement: Selection<any,any,any,any> ;


    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      // let data = this.apiData
      console.log('loadD3() started.')
    }
    
  }

}
