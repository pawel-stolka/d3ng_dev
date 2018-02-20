import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bubbles2',
  templateUrl: './bubbles2.component.html',
  styleUrls: ['./bubbles2.component.css']
})
export class Bubbles2Component implements OnInit {
  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  name: string;
  svg;
  color;
  simulation;
  circles;
  svgStart;
  loggedMin;
  loggedMax;

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
      .then(() => this.loadCircles())
      .then(() => this.ready())
      .catch((err) => this.error = `error: ${this.apiService.error}`)
  }


  ngAfterViewInit() {
    this.svg = this.d3.select("svg");

    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    this.orientSvg()

    let startX = this.svgStart.centerX; // width/2;
    let startY = this.svgStart.centerY; //  height/2;
    console.log(this.svgStart)
    console.log(startX, startY)

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    // var logged = this.apiData['loggedIn'].length
    // console.log(logged)
    // var logMin = this.d3.min(this.apiData)
    console.log(this.loggedMin, this.loggedMax)
    // var radiusScale = this.d3.scaleSqrt()
    //   // .domain([this.loggedMin, this.loggedMax])
    //   .domain([1, 6])
    //   .range([10, 60])
    this.simulation = this.d3.forceSimulation()
      // .force("link", this.d3.forceLink().id(function (d: any) {
      //   console.log(d)
      //   return d.id;
      // }))
      // .force("charge", this.d3.forceManyBody())
      .force("center", this.d3.forceCenter(width / 2, height / 2))
      // .force("collide", this.d3.forceCollide((d) => { return 30 })
      // .iterations(10))

      .force('x', this.d3.forceX(startX).strength(0.05))
      .force('y', this.d3.forceY(startY).strength(0.05))
      .force("collide", this.d3.forceCollide((d: any) => {
        // var result = radiusScale(d.loggedIn.length);
        // console.log(result * 10)
        return 60 // result;
      }))





    // this.render(bubbles);
  }

  orientSvg() {
    let bounds: any = document
      .getElementsByTagName('svg')[0]
      .getBoundingClientRect()
    this.svgStart = {
      x: bounds.x,
      y: bounds.y,
      centerX: bounds.width / 2 + bounds.x,
      centerY: bounds.height / 2 + bounds.y
    }
    console.log(this.svgStart)
  }

  ticked() {
    // console.log(this.circles)
    // console.log('tick2')//this.circles)
    this.circles
      .attr("cx", function (d) {
        // console.log(d)
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  loadCircles() {
    this.circles = 
    this.svg.selectAll('svg')
      // .append('g')
      .data(this.apiData)
      .enter()
      .append('g')

    let g = this.svg.selectAll('g')
    let myY;
    this.circles = 
    g
      .append('circle')
      .attr('cx', (d) => {
        var myX = d.loggedIn.length * 100
        console.log(myX);
        return myX;
      })// d.x) // 100)
      .attr('cy', (d) => {
        myY = d//.y;
        console.log(myY)
        return d.y })// 200)
      .attr('r', (d) => d.loggedIn.length * 13)
      .attr('stroke', 'red')
      .attr('stroke-width', '1px')
      .attr("fill", "none")

    g
      .append('text')
      .text((d) => `${d.name} - ${d.loggedIn.length}`)
      .attr('transform', (d, i) => {
        return 'translate('+d.loggedIn.length * 100 +',' + 50 * i + ')'
      })
    // .attr('transform', (d) => { 
    //   console.log(d.x)
    //   return 'translate(' + d.x + ','+ d.y +')' })



    console.log(`yep circles`)
    console.log(this.circles)
  }

  ready() {
    console.log('ready')
    this.simulation.nodes(this.apiData)
      .on('tick', () => {
        return this.ticked()
      }) //this.apiData)})
  }

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
          this.loggedMin = this.d3.min(this.apiData, d => d.loggedIn.length)
          this.loggedMax = this.d3.max(this.apiData, d => d.loggedIn.length)
          console.log(this.loggedMin, this.loggedMax)
        }
      )
  }

  loadD3() {
    let d3 = this.d3;
    let d3ParentElement: Selection < any, any, any, any > ;

    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      let data = this.apiData
    }
  }
}
