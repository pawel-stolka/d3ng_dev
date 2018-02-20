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
  distance
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
    this.distance = 2;
    this.orientSvg()

    let startX = this.svgStart.centerX;// width/2;
    let startY = this.svgStart.centerY;//  height/2;
    // console.log(this.svgStart)
    console.log(`startX, startY: ${startX}, ${startY}`)

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    // var logged = this.apiData['loggedIn'].length
    // console.log(logged)
    // var logMin = this.d3.min(this.apiData)
    // console.log(this.loggedMin, this.loggedMax)
    var radiusScale = this.d3.scaleSqrt()
      // .domain([this.loggedMin, this.loggedMax])
      .domain([1,6])
      .range([10,60])
    this.simulation = this.d3.forceSimulation()
      // DEFINITION OF FORCE 
      // .force("name", defineTheForce)
      // .force("center", this.d3.forceCenter(width / 2, height / 2))
      .force("center", this.d3.forceCenter(startX, startY))
      .force('x', this.d3.forceX(startX).strength(0.05))
      .force('y', this.d3.forceY(startY).strength(0.05))

      .force("collide", this.d3.forceCollide((d:any) => {
        var res = d.counter * 15 + this.distance
        console.log(`r=${res} (force)`)
        return res;
        // var result = radiusScale(d.loggedIn.length);
        // console.log(result*10)
        // return 50// result+10;
      }))

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
    this.svgStart = {
      x: bounds.x,
      y: bounds.y,
      centerX: bounds.width/2 + bounds.x,
      centerY: bounds.height/2 + bounds.y
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
      .append('circle')
      .attr('cx', (d) => d.x)// 100)
      .attr('cy', (d) => d.y)// 200)
      .attr('r', (d) => 
      {
        var res = d.counter * 15
        console.log(`r=${res}`)
        return res;
      })
      // .attr('r', (d) => d.counter * 13)
      .style("stroke","green")
      // .attr("fill", "green")
      .style("stroke-width", 2)
      .style("fill", "none");
    
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
          this.loggedMin = this.d3.min(this.apiData, d => d.counter)
          this.loggedMax = this.d3.max(this.apiData, d => d.counter)
          console.log(this.loggedMin, this.loggedMax)
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

/*
 * 
 * 
 * import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';
import { Data } from '../../shared/Data';
import { bubbles } from '../../shared/bubbles';

@Component({
  selector: 'force',
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.css']
})
export class ForceComponent implements OnInit, AfterViewInit {

  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  name: string;
  svg;
  color;
  simulation;
  link;
  node;

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
    this.loadData()
      .then(() => this.loadD3())
      .catch((err) => this.error = `error: ${this.apiService.error}`)

      
  }

  ngAfterViewInit(): void {
    this.svg = this.d3.select("svg");

    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

    this.simulation = this.d3.forceSimulation()
      .force("link", this.d3.forceLink().id(function (d: any) {
        console.log(d)
        return d.id;
      }))
      .force("charge", this.d3.forceManyBody())
      .force("center", this.d3.forceCenter(width / 2, height / 2))
      .force("collide", this.d3.forceCollide(
        (d) => { return 30 }
      ).iterations(10))

    this.render(bubbles);
  }

  ticked() {
    this.link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    this.node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }

  render(graph) {
    // var bubbles = graph.map(function(d) { 
    //   return { nodes: d.nodes, links: d.links }
    // }) // d.links.value * 2})
    this.link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      // .data(bubbles.links)
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke-width", function (d) {
        return Math.sqrt(d.value);
      });

    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => {
        return this.color(d.group);
      })
      
      .call(this.d3.drag()
        .on("start", (d) => { return this.dragstarted(d) })
        .on("drag", (d) => { return this.dragged(d) })
        // .on("end", (d)=>{return this.dragended(d)})
      )

      
      
      // ------ from /users (!) -----------
      // g.append('text')
      // // .text((d) => `${d.name} (${d.x},${d.y}) ${radiusScale(d.count)}`)
      // .text((d) => {
      //   let _r = radiusScale(d.count);
      //   let r = Math.round(_r * 100) / 100;
      //   return `r=${r}`
      // })
      // .attr('text-anchor', 'middle')
      // .attr('transform', (d) => {
      //   var y = d.x/2 + 15
      //   var res = `translate(0,${y})`
      //   return res
      // })
      // .attr('class','bubbles') 
      // ------------------------------

    this.node.append("title")
      .text(function (d) {
        return d.id;
      })

    this.simulation
      .nodes(graph.nodes)
      .on("tick", () => {
        return this.ticked()
      })

    this.simulation.force("link")
      .links(graph.links)
  }

  dragstarted(d) {
    if (!this.d3.event.active)
      this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = this.d3.event.x;
    d.fy = this.d3.event.y;
  }

  dragended(d) {
    if (!this.d3.event.active)
      this.simulation.alphaTarget(0.05);
    d.fx = null;
    d.fy = null;
  }






  loadData() {
    return this.apiService.getAll()
      .then(
        data => {
          this.apiData = data;
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

 */
