import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

interface BudgetItem {
  title: string;
  budget: number;
}

interface D3ChartItem {
  label: string;
  value: number;
}

@Component({
  selector: 'pb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('newChart', { static: true }) private chartContainer!: ElementRef;

  d3ChartCreated = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getMyBudget();
    this.dataService.myBudget$.subscribe(myBudget => {
      if (myBudget) {
        if (Array.isArray(myBudget)) {
          this.create2dPieChart(myBudget);
        } else {
          console.error('Error loading the data from the API:', myBudget);
        }
      } else {
        console.error('No data received from the API');
      }
    });
  }
  

  ngAfterViewInit(): void {
    this.dataService.getNewBudget();
    this.dataService.newBudget$.subscribe(newBudget => {
      if (!this.d3ChartCreated && Array.isArray(newBudget)) {
        this.createD3Chart(newBudget);
      }
    });
  }

  create2dPieChart(data: BudgetItem[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.title),
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: [
            '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', 'green',
            'red', 'blue', 'yellow', 'purple', 'orange'
          ]
        }]
      },
      options: {}
    });

    this.d3ChartCreated = true;
  }

  createD3Chart(data: D3ChartItem[]) {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(this.chartContainer.nativeElement)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<D3ChartItem>().value(d => d.value);
    
    const arc = d3.arc<d3.PieArcDatum<D3ChartItem>>()
                  .innerRadius(0)
                  .outerRadius(radius);

    const arcs = svg.selectAll('arc')
                    .data(pie(data))
                    .enter()
                    .append('g')
                    .attr('class', 'arc');

    arcs.append('path')
        .attr('fill', (d, i) => color(i.toString()))
        .attr('d', arc);

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.label);
  }
}
