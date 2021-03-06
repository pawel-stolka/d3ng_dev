import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.css']
})
export class BubblesComponent implements OnInit, AfterViewInit {
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
  distance;
  valueMin;
  valueMax;
  
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
    this.distance = 2;
    this.orientSvg()

    
    // var logged = this.apiData['loggedIn'].length
    // console.log(logged)
    // var logMin = this.d3.min(this.apiData)
    // console.log(this.loggedMin, this.loggedMax)
    // var exArr = [2, 4, 12, 2];
    // var exMin = this.d3.min(exArr)//, d => d.counter)
    // var exMax = this.d3.max(exArr)//, d => d.counter)
    // console.log(exMin, exMax)

    // var valueMin = this.d3.min(this.apiData, d => d.loggedIn)
    // var valueMax = this.d3.max(this.apiData, d => d.loggedIn)
    

      // .attr('r', (d) => 
      // {
      //   var res = d.counter * 5
      //   console.log(`r=${res}`)
      //   return res;
      // })

      // .force("link", this.d3.forceLink().id(function (d: any) {
      //   console.log(d)
      //   return d.id;
      // }))
      // .force("charge", this.d3.forceManyBody())
      // .force("center", this.d3.forceCenter(width / 2, height / 2))
      // .force("collide", this.d3.forceCollide((d) => { return 30 })
        // .iterations(10))
      
      // .force('x', this.d3.forceX(startX).strength(0.05))
      // .force('y', this.d3.forceY(startY).strength(0.05))
      // .force("collide", this.d3.forceCollide((d:any) => {
      //   var result = radiusScale(d.loggedIn.length);
      //   console.log(result*10)
      //   return 60// result;
      // }))


    


        // this.render(bubbles);
  }

  orientSvg() {
    let bounds: any = document
      .getElementsByTagName('svg')[0]
      .getBoundingClientRect()
      console.log(bounds)
    this.svgStart = {
      x: bounds.x,
      y: bounds.y,
      centerX: bounds.width/2 + bounds.x,
      centerY: bounds.height/2 + bounds.y - 200
    }
    console.log(this.svgStart)
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

  loadCircles() {
    this.circles = this.svg.selectAll('svg')
      // .append('g')
      .data(this.apiData)
      .enter()
      .append('g')
    
    this.circles = this.svg.selectAll('g')
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

    this.svg.selectAll('g')
    // .data(this.apiData)
      .append('text')
      .text((d) => `${d.name} - ${d.loggedIn.length}`)
      .attr('transform', (d) => { 
          console.log(d.x, d.y)
          // return 'translate(' + d.x + ','+ d.y +')' 
          return 'translate('+d.x+',' + d.loggedIn.length * 50 + ')'
        })
    
    // this.svg.selectAll('g')
    //   .append('text')
    //   .text((d) => `${d.name} - ${d.loggedIn.length}`)
    //   .attr('transform', (d,i) => { 
    //     let x = 50,
    //         y = 50;
    //     return `translate(${x},${y})` 
    //   })
      // .attr('transform', (d) => { 
      //   console.log(d.x)
      //   return 'translate(' + d.x + ','+ d.y +')' })

    

    console.log(`yep circles`)
    console.log(this.circles)
  }

  ready() {
    console.log('ready')
    let startX = this.svgStart.centerX;// width/2;
    let startY = this.svgStart.centerY;//  height/2;
    // console.log(this.svgStart)
    console.log(`startX, startY: ${startX}, ${startY}`)

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

    console.log(this.apiData)
    console.log(this.valueMin, this.valueMax)
    var radiusScale = this.d3.scaleSqrt()
      // .domain([this.loggedMin, this.loggedMax])
      // .domain([radMin,radMax])
      .domain([this.valueMin, this.valueMax])
      .range([10,100])
    this.simulation = this.d3.forceSimulation()
      // DEFINITION OF FORCE 
      // .force("name", defineTheForce)
      // .force("center", this.d3.forceCenter(width / 2, height / 2))
      .force("center", this.d3.forceCenter(startX, startY))
      .force('x', this.d3.forceX(startX).strength(0.05))
      .force('y', this.d3.forceY(startY).strength(0.05))

      .force("collide", this.d3.forceCollide((d:any) => {
        var res = d.counter * 15 + this.distance
        // console.log(`r=${res} (force)`)
        var res2 = radiusScale(d.loggedIn.length)//counter)
        console.log(`res2: ${res2}`)
        return res;
        // var result = radiusScale(d.loggedIn.length);
        // console.log(result*10)
        // return 50// result+10;
      }))

    this.simulation.nodes(this.apiData)
      .on('tick', () => { return this.ticked()})//this.apiData)})
  }

  render(graph) {
    //
  }

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
          this.valueMin = this.d3.min(this.apiData, d => d.loggedIn.length)
          this.valueMax = this.d3.max(this.apiData, d => d.loggedIn.length)
          console.log(this.valueMin, this.valueMax)
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
