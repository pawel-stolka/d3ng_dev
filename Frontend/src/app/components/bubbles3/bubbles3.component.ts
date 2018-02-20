import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bubbles3',
  templateUrl: './bubbles3.component.html',
  styleUrls: ['./bubbles3.component.css']
})
export class Bubbles3Component implements OnInit {
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

  ready() {
    console.log('ready')
    this.simulation.nodes(this.apiData)
      .on('tick', () => {
        return this.ticked()
      }) //this.apiData)})
  }

  loadCircles() {
    this.svg.selectAll('svg')
      // .append('g')
      .data(this.apiData)
      .enter()
      .append('g')

    let g = this.svg.selectAll('g')

    g.append('circle')
      .attr('cx', (d) => d.loggedIn.length * 100)// d.x) // 100)
      .attr('cy', (d) => 200)//d.y)// 200)
      .attr('r', (d) => d.loggedIn.length * 13)
      .attr("fill", "green")

    // this.svg.selectAll('g')
    g.append('text')
      .text((d) => `${d.name} - ${d.loggedIn.length}`)
      .attr('transform', (d, i) => {
        return 'translate('+d.loggedIn.length * 100 +',' + 200 + ')'
      })
    // .attr('transform', (d) => { 
    //   console.log(d.x)
    //   return 'translate(' + d.x + ','+ d.y +')' })



    console.log(`yep circles`)
    // console.log(this.circles)
  }

  loadData() {
    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
          // this.loggedMin = this.d3.min(this.apiData, d => d.loggedIn.length)
          // this.loggedMax = this.d3.max(this.apiData, d => d.loggedIn.length)
          // console.log(this.loggedMin, this.loggedMax)
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
