import { Component, OnInit, ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';
import { Data } from '../../shared/Data';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;
  private parent;

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

      var xydata = data.map(function(d) { 
        return { x: d.x, y: d.y, r: d.count }
      })

      var min = d3.min(xydata, (d) => d.x )
      var max = d3.max(xydata, (d) => d.x )
      var mean = d3.mean(xydata, (d) => d.x )
      
      console.log(xydata)
      console.log(min, max, mean)

      var svg =this.parent
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('class','bckg2')

      var g = d3.select('svg')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', (d,i) => {
          var ret = `translate(${d.x * 2}, ${d.y/2})`
          console.log(d,i)
          return ret
        })

      var radiusMin = d3.min(xydata, (d) => d.r)
      var radiusMax = d3.max(xydata, (d) => d.r)
      var radiusScale = d3.scaleLinear()
        .domain([radiusMin, radiusMax])
        .range([10, 100])

      g.append('circle')
        .attr('r', (d) => radiusScale(d.count))
        .style('fill', 'pink')
        .style('opacity', 0.5)
        .style('stroke', 'black')
        .style('stroke-width', '2px')

       g.append('text')
        // .text((d) => `${d.name} (${d.x},${d.y}) ${radiusScale(d.count)}`)
        .text((d) => {
          let _r = radiusScale(d.count);
          let r = Math.round(_r * 100) / 100;
          return `r=${r}`
        })
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => {
          var y = d.x/2 + 15
          var res = `translate(0,${y})`
          return res
        })
        .attr('class','bubbles')

      // g.append('text')
      //   .text((d) => `${d.name} (${d.x},${d.y})`)
      //   .attr('text-anchor', 'middle')
      //   .attr('transform', (d) => `translate(0,${d.x/2})`)
      //   .attr('font-size', '10px')
      //   .attr('class','bubbles')
      
    }
  }
}
