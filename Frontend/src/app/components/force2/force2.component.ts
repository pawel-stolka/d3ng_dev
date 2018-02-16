import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';
// import { Data } from '../../shared/Data';
// import { miserables } from '../../shared/miserables';
// import { bubbles } from '../../shared/bubbles';
import { nodes } from '../../shared/nodes';

@Component({
  selector: 'force2',
  templateUrl: './force2.component.html',
  styleUrls: ['./force2.component.css']
})
export class Force2Component implements OnInit {
  private apiData = [];
  private newApiData;// = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  private width = 800
  private height = 400
  name:string;
  svg;
  color;
  simulation;
  node;


  
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
        .force("link", this.d3.forceLink().id(function(d:any) { 
          console.log(d)
          return d.id; }))
        .force("charge", this.d3.forceManyBody())
        .force("center", this.d3.forceCenter(width / 2, height / 2))
        .force("collide",this.d3.forceCollide(
            (d) => { return 30 }
          ).iterations(10) )
    
        // var xydata = data.map(function(d) { 
        //   return { x: d.x, y: d.y, r: d.count }
        // })  
        
        var _sData = this.newApiData
        
        // this.render(_sData);
        this.render(nodes);
    // this.render(miserables);
  }

  ticked() {
    // this.link
    //     .attr("x1", function(d) { return d.source.x; })
    //     .attr("y1", function(d) { return d.source.y; })
    //     .attr("x2", function(d) { return d.target.x; })
    //     .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("cx", function(d) { return this.width/2 })
        .attr("cy", function(d) { return this.height/2 })
  }

  render(graph){
    // console.log(graph)
    // console.log(this.newApiData)
    


    // var bubbles = graph.map(function(d) { 
    //   return { nodes: d.nodes, links: d.links }
    // }) // d.links.value * 2})
    // this.link = this.svg.append("g")
    //   .attr("class", "links")
    //   .selectAll("line")
    //   // .data(bubbles.links)
    //   .data(graph.links)
    //   .enter()
    //   .append("line")
    //     .attr("stroke-width", function(d) { 
    //       return Math.sqrt(d.value); });

    let xPart = this.width/3;

    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
        .attr("r", 50)
        .attr('cx', (d,i) => { return xPart * (i + 1/2) })// (i * xPart)+ xPart/2 })
        .attr('cy', (d,i) => { return this.height/2 })
        .attr("fill", (d)=> this.color(d.group))
        .attr('text', 'fsd')
        // .call(this.d3.drag()
            // .on("start", (d)=>{return this.dragstarted(d)})
            // .on("drag", (d)=>{return this.dragged(d)})
            // .on("end", (d)=>{return this.dragended(d)})
  // )
  console.log(graph)
}

dragstarted(d) {
  if (!this.d3.event.active)
    this.simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
/*
  ngAfterViewInit(): void {
    this.svg = this.d3.select("svg");
    
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");

    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

    this.node = this.svg
    .append("g")
      // .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      // .attr('class', 'node')
      .attr('cx', (d,i) => { (i+1)*(width/4)})
      .attr('cy', (d,i) => { height/2})
      .attr('r', 50)

    this.simulation = this.d3.forceSimulation()
      .force('center', this.d3.forceCenter(this.width/2, this.height/2))
      
      this.render(bubbles);

    this.simulation
      .nodes(nodes)
      .on('tick', ()=>{ return this.ticked()})
      

      
    // var force = this.d3.forceCenter()
    
  }
  ticked() {
    // console.log('ticked()')
    this.node
    .attr("cx", function(d) { return this.width/2 })// d.x; })
    .attr("cy", function(d) { return this.height/2 })// d.y; });
  }

  render(graph){

  }
*/

  loadData() {
    return this.apiService.getAll()
      .then(
        data => {
          this.apiData = data;
        })
      .then( () => {
        var nodes = {
          "nodes": [
            {"name": "Basia"},
            {"name": "Pablo"},
            {"name": "Hania"}
          ]
        }
        console.log(nodes)

        var _data = this.apiData.map(d => {
          return { "name": d.name }
        })
        console.log(_data)
        var data = {
          "nodes": _data
        }
        this.newApiData = data
        console.log(this.newApiData)
        // console.log(nodes)

      })
  }

  loadD3() {
    let d3 = this.d3;
    let d3ParentElement: Selection<any,any,any,any> ;


    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      let data = this.apiData
    }
  }
}
