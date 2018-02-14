import { Component, OnInit, ElementRef } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { ApiService } from '../../services/api.service';
import { Data } from '../../shared/Data';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private apiData = [];
  private d3: D3;
  private parentNativeElement: any;
  private error;

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
    this.error=null;
    this.loadData()
      .then(() => this.loadD3()
    )
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
          // console.log(this.parentNativeElement)
          console.log(this.apiData)
          console.log("loadSvg()")
          d3ParentElement = d3.select(this.parentNativeElement);
    

          d3ParentElement
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'bar')
            .selectAll('circle')
            .data(this.apiData)
            .enter()
            .append('circle')
            .attr('cx', (d) => d.count * 10)
            .attr('cy', (d) => d.count * 2)
            .attr('r', (d) => d.count)
            
        }
      }
    

}
