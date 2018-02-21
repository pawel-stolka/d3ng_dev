import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'bubble-copy',
  templateUrl: './bubble-copy.component.html',
  styleUrls: ['./bubble-copy.component.css']
})
export class BubbleCopyComponent implements OnInit {
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
  textElems;

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

      this.textElems
      .attr("x", function (d) {
        // console.log(d.x)
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });
  }

  loadCircles() {
    console.log(this.svg)
    let svg = this.svg
      .selectAll('svg')
      .data(this.apiData)
      .enter()
      .append('g')
    
    this.circles = svg
      .append('circle')
      .attr('cx', (d) => d.x)// 100)
      .attr('cy', (d) => d.y)// 200)
      .attr('r', (d) => d.counter * 15)
      .style("stroke","green")
      .style("stroke-width", 2)
      // .style("stroke-dasharray", ("10,5")) // make the stroke dashed
      // .style("fill", "none")
      .style("fill", "red")
      .style("fill-opacity", .25)
      .attr('class','text')

      .on("mouseover", function(d,i) {
        console.log(d,i)
        let circles = svg
        // .append('circle')
        // .select(this)
        .selectAll('circle')
        .transition()
        .duration(250)
        .style("stroke-dasharray", ("10,5"))
        .attr('r', (d) => { return d.counter * 15 + 5 })
        // .style("cursor", "none")    
        console.log('in!')

        

        let selText = svg.selectAll('text')
        .text((d) => {
          let fullname = d.name,
              logged = d.loggedIn.length;
          let firLet = fullname.substr(0,1)
  
          return `${fullname} - ${logged}`;
        })
        
      })
      .on("mouseout", function(d,i) {
        console.log(d,i)
        let circles = svg
        // .append('circle')
        // .select(this)
        .selectAll('circle')
        .transition()
        .duration(250)
        .style("stroke","red")
        .style("stroke-width", 2)
        // .style("stroke-dasharray", ("10,5"))
        .attr('r', (d) => { return d.counter * 15})
        // .style("cursor", "none")    
        console.log('out.')
      })

    // svg
    this.textElems = svg
      .append('text')
      .text((d) => {
        let fullname = d.name,
            logged = d.loggedIn.length;
        let firLet = fullname.substr(0,1)

        return `${firLet} ${logged}`;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')

      
      // on hover 
      /*
      var node = vis.selectAll("circle.node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")

      //MOUSEOVER
      .on("mouseover", function(d,i) {
        if (i>0) {
          //CIRCLE
          d3.select(this).selectAll("circle")
          .transition()
          .duration(250)
          .style("cursor", "none")     
          .attr("r", circleWidth+3)
          .attr("fill",palette.orange);

          //TEXT
          d3.select(this).select("text")
          .transition()
          .style("cursor", "none")     
          .duration(250)
          .style("cursor", "none")     
          .attr("font-size","1.5em")
          .attr("x", 15 )
          .attr("y", 5 )
        } else {
          //CIRCLE
          d3.select(this).selectAll("circle")
          .style("cursor", "none")     

          //TEXT
          d3.select(this).select("text")
          .style("cursor", "none")     
        }
      })
      */
  }
    //Set up tooltip
// var tip = this.d3.tip()
// .attr('class', 'd3-tip')
// .offset([-10, 0])
// .html(function (d) {
// return  d.name + "";
// })
// svg.call(tip);
//     console.log(`yep circles`)
//     console.log(this.circles)

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
