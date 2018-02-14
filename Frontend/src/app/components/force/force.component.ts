import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';
import { Data } from '../../shared/Data';
import { miserables } from '../../shared/miserables';
import { bubbles } from '../../shared/bubbles';

@Component({
  selector: 'app-force',
  templateUrl: './force.component.html',
  styleUrls: ['./force.component.css']
})
export class ForceComponent implements OnInit, AfterViewInit {
  
  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;
  name:string;
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
        .force("link", this.d3.forceLink().id(function(d:any) { 
          console.log(d)
          return d.id; }))
        .force("charge", this.d3.forceManyBody())
        .force("center", this.d3.forceCenter(width / 2, height / 2))
    
        // var xydata = data.map(function(d) { 
        //   return { x: d.x, y: d.y, r: d.count }
        // })  

    
        this.render(bubbles);
    // this.render(miserables);
  }

  ticked() {
    this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  render(graph){
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
        .attr("stroke-width", function(d) { 
          return Math.sqrt(d.value); });

    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter()
      .append("circle")
        .attr("r", 30)
        .attr("fill", (d)=> { return this.color(d.group); })
        .call(this.d3.drag()
            .on("start", (d)=>{return this.dragstarted(d)})
            .on("drag", (d)=>{return this.dragged(d)})
            // .on("end", (d)=>{return this.dragended(d)})
  )

    this.node.append("title")
      .text(function(d) { return d.id; })

    this.simulation
      .nodes(graph.nodes)
      .on("tick", ()=>{ return this.ticked()})

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
    let d3ParentElement: Selection<any,any,any,any> ;


    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      let data = this.apiData




    }
  }

}
