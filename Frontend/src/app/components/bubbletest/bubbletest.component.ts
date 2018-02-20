import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bubbletest',
  templateUrl: './bubbletest.component.html',
  styleUrls: ['./bubbletest.component.css']
})
export class BubbleTestComponent implements OnInit, AfterViewInit {
  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  svg;
  simulation;
  
  
  // not sure
  g
  circles
  valueMin
  valueMax
  svgPosition
  svgStart
  distance
  color

  // additional
  svg_width;
  svg_height;
  info;

  constructor(
    element: ElementRef,
    d3Service: D3Service,
    private apiService: ApiService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.loadData()
      .then(() => this.loadD3())
      .then(() => this.calculateSvg())
      // .then(() => this.loadCircles())
      .then(() => this.loadCircles0())
      .then(() => this.render())
      .catch((err) => this.error = `error: ${this.apiService.error}`)
  }

  ngAfterViewInit() {
    this.svg = this.d3.select("svg");
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");
    this.distance = 2;
    
  }

  loadCircles0() {
    this.circles = this.svg.selectAll('svg')
    // .append('g')
    .data(this.apiData)
    .enter()
    .append('g')
  
  this.circles// = this.svg.selectAll('g')
    .data(this.apiData)
    // .append('g')
  // this.circles
  // .selectAll('g')
    .append('circle')
    .attr('cx', (d) => d.x)// 100)
    .attr('cy', (d) => d.y)// 200)
    .attr('r', (d) => 
    {
      var res = d.counter * 15
      // console.log(`r=${res}`)
      return res;
    })
    // .attr('r', (d) => d.counter * 13)
    .style("stroke","green")
    // .attr("fill", "green")
    .style("stroke-width", 2)
    .style("fill", "none");

    // this.svg.selectAll('g')
    // // .data(this.apiData)
    //   .append('text')
    //   .text((d) => `${d.name} - ${d.loggedIn.length}`)
    //   .attr('transform', (d) => { 
    //       console.log(d.x)
    //       // return 'translate(' + d.x + ','+ d.y +')' 
    //       return 'translate('+d.x+',' + d.loggedIn.length * 50 + ')'
    //     })
  }

  loadCircles(){

  }

  loadCircles2() {
    this.svg.selectAll('svg')
      // .append('g')
      .data(this.apiData)
      .enter()
      .append('g')
    
    this.g = this.svg.selectAll('g')
      .append('circle')
      .attr('cx', (d) =>
      {
        console.log(`d.x = ${d.x}`)
        return d.x
      })// 100)
      .attr('cy', (d) => d.y)// 200)
      .attr('r', (d) => 
      {
        var res = d.counter * 15
        // console.log(`r=${res}`)
        return res;
      })
      // .attr('r', (d) => d.counter * 13)
      .style("stroke","green")
      // .attr("fill", "green")
      .style("stroke-width", 2)
      .style("fill", "none");
  }

  render() {
    // console.log('ready')
    let startX = this.svgPosition.centerX;// width/2;
    let startY = this.svgPosition.centerY;//  height/2;
    // console.log(this.svgPosition)
    console.log(`startX, startY: ${startX}, ${startY}`)

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

    console.log(this.valueMin, this.valueMax)

    var radiusScale = this.d3.scaleSqrt()
      // .domain([radMin,radMax])
      .domain([this.valueMin, this.valueMax])
      .range([10,100])

    this.simulation = this.d3.forceSimulation()
      // DEFINITION OF FORCE 
      // .force("name", defineTheForce)
      // .force("center", this.d3.forceCenter(width / 2, height / 2))
      .force("center", this.d3.forceCenter(startX, startY))

    this.simulation.nodes(this.apiData)
      .on('tick', () => { return this.ticked()})//this.apiData)})
  }

  calculateSvg() {
    let bounds: any = document
      .getElementsByTagName('svg')[0]
      .getBoundingClientRect()
    this.svg_width = bounds.width
    this.svg_height = bounds.height
    
    // console.log(bounds)
    this.svgPosition = {
      x: bounds.x,
      y: bounds.y,
      centerX: bounds.width/2 + bounds.left,
      centerY: bounds.height/2 + bounds.top
    }
    this.info = `(${this.svgPosition.centerX}, ${this.svgPosition.centerY})`;
    // console.log(this.svgPosition)
  }

  ticked() {
    // console.log(this.circles)
    // console.log('tick2')//this.circles)
    this.circles
      .attr("cx", function (d) {
        // console.log(d.x)
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  calculateValues() {
    this.valueMin = this.d3.min(this.apiData, d => d.loggedIn.length)
    this.valueMax = this.d3.max(this.apiData, d => d.loggedIn.length)
    console.log(`min: ${this.valueMin}, max: ${this.valueMax}`)
  }

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)

          /* testing is it ok here */
          this.calculateValues()
        }
      )
  }

  loadD3() {
    let d3 = this.d3;
    let d3ParentElement: Selection<any,any,any,any>;

    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      let data = this.apiData
    }
  }
}
