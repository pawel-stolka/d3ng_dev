import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  name: string;
  svg;
  color;
  apiData

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

    // this.drawShape()
    // this.clickSvg()
    var _svg = this.svg//.select('g')
console.log(_svg)
    
    this.getCoords()
  }

  /*
  drawShape() {
    this.svg
      .append('g')
      .append('circle')
      .attrs({
        r: 50,
        cx: this.width/2,
        cy: this.height/2,
        fill: 'teal'
      })
      .on('click', () => {
        var circle = this.svg.select('circle')
        circle.attrs({
          fill: 'red'
        })  
        var evX = this.d3.event.layerX,
            evY = this.d3.event.layerY;
        
        console.log(evX, evY);
   
      })
    console.log(this.svg);
  }
  */

  drawShape(x,y) {
    this.svg
    .append('g')
    .append('circle')
    .attrs({
      r: 5,
      cx: x,
      cy: y,
      fill: () => this.color()
    })
    .transition() // First fade to green.
    // .delay(50)
    .duration(250)
    // .easeLinear(250)
    .attrs({
      r: 50
    })
    // .style("fill", "green")
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
