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
  // name: string;
  svg;
  circles;
  // color;
  simulation;
  margin = 50;

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
      // .then(() => this.ready())
      .catch((err) => 
        this.error = `error: ${this.apiService.error}`)
  }

  ngAfterViewInit() {
    this.svg = this.d3.select("svg");
    var width = +this.svg.attr("width");
    var height = +this.svg.attr("height");
  }

  ready() {
    console.log('ready')
    this.simulation.nodes(this.apiData)
      .on('tick', () => this.ticked())
  }

  loadCircles() {
    this.svg.selectAll('svg')
      .data(this.apiData)
      .enter()
      .append('g')

    let g = this.svg.selectAll('g')

    g.append('circle')
      // .attr('cx', (d,i) => i * 100 + 50)
      .attr('cx', (d) => 200)
      .attr('cy', (d) => 200)
      .attr('r', (d) => 10)
      .attr('stroke', 'red')
      .attr('stroke-width', '1px') 
      .attr("fill", "none")

    g.append('text')
      .text((d) => `${d.name}`)// - ${d.loggedIn.length}`)
      .attr('transform', (d, i) => {
        let x = 200,
        // let x = i * 100 + this.margin,
            y = 200;
        return `translate(${x},${y})`
      })
  }

  ticked() {
    this.circles
      .attr("cx", (d) => d.x )
      .attr("cy", (d) => d.y );
  }

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log('this.apiData loaded:')
          console.log(this.apiData)
        }
      )
  }

  loadD3() {
    let d3 = this.d3;
    let d3ParentElement: Selection<any,any,any,any>;

    if (this.parentNativeElement !== null) {

      this.parent = d3.select(this.parentNativeElement);
      let data = this.apiData
      console.log('svg parent selected.')
    }
  }
}
