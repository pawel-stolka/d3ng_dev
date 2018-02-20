import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bubbles4',
  templateUrl: './bubbles4.component.html',
  styleUrls: ['./bubbles4.component.css']
})
export class Bubbles4Component implements OnInit {
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
  }


  ticked() {
    this.circles
      .attr("cx", (d) => d.x )
      .attr("cy", (d) => d.y )
  }

  loadCircles() {
    this.circles = this.svg.selectAll('svg')
      // .append('g')
      .data(this.apiData)
      .enter()
      .append('g')
    
    this.circles = this.svg.selectAll('g')
      // .data(this.apiData)
      .append('circle')
      .attr('cx', (d,i) =>
      {
        return i*100 + 50// 100)
      })
      .attr('cy', 200)// (d) => d.y)// 200)
      .attr('r', (d) => 
      {
        var res = d.counter * 5
        console.log(`r=${res}`)
        return res;
      })
      .style("stroke", "red")    // set the line colour
      .style("stroke-width", 2)
      .style("fill", "none");
      // .attr("fill", "green")
    
    this.svg.selectAll('g')
      .append('text')
      .text((d) => `${d.name} - ${d.counter}`)
      .attr('transform', (d,i) => { 
        let tx= i*100 + 50;
        return 'translate('+ tx +','+ 250 + ')' 
      })
      .style('font-size', '12px')
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

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
          this.loggedMin = this.d3.min(this.apiData, d => d.loggedIn.length)
          this.loggedMax = this.d3.max(this.apiData, d => d.loggedIn.length)
          console.log(`min: ${this.loggedMin}, max: ${this.loggedMax}`);
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
