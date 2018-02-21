import { Component, OnInit, ElementRef,  AfterViewInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
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
  data = [];

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
      .then(() => this.go())
      // .then(() => this.loadCircles())
      // .then(() => this.ready())
      .catch((err) => this.error = `error: ${this.apiService.error}`)
  }

  go() {
    

    var width = 400;
    var height = 400;
    var r = height / 2;
    // var radius = 100;
    var radius = Math.min(width, height) / 2;
    // var color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    var color = this.d3.scaleOrdinal()
       .range(["#98abc5", "#8a89a6", "#7b6888"]);
    // var color = this.d3. .scale.category20c();

    var arc = this.d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(50);

      console.log(arc)

    var labelArc = this.d3.arc()
      .outerRadius(radius - 100)
      .innerRadius(radius - 50);

    var pie = this.d3.pie()
      .sort(null)
      .value(function (d: any) {
        return d;
      });

    var svg = this.d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
      .data(pie(this.data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function (d:any) {
        return color(d.data);
      });

    g.append("text")
      .attr("transform", function (d: any) {
        var value = labelArc.centroid(d);
        console.log(value)
        return "translate(" + value + ")";
      })
      .attr("dy", ".35em")
      .attr('class','pie')
      // .attr('font-size', '20px')
      .attr('fill', "greenyellow")
      .text(function (d: any) {
        return d.data;
      });

    // var vis = this.d3.select('#chart').append("svg:svg").data([this.data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
    // var pie = this.d3.pie()
    //   .value(function(d: any) {
    //   return d;
    // });

  }




  loadData() {
    // this.data = [{
    //   "label": "Category A",
    //   "value": 20
    // }, {
    //   "label": "Category B",
    //   "value": 50
    // }, {
    //   "label": "Category C",
    //   "value": 30
    // }];
    this.data = [10, 20, 100];
    console.log(this.data)

    return this.apiService.getUsers() //.getAll()
      .then(
        data => {
          this.apiData = data;
          console.log(this.apiData)
          this.valueMin = this.d3.min(this.data, d => d.value)
          this.valueMax = this.d3.max(this.data, d => d.value)
          console.log(this.valueMin, this.valueMax)
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
