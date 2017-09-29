import lunchPlaces from './seedData.js';
import * as d3 from 'd3';

var pieChart = {
  width: 300,
  height: 300,
  innerWidth: 20,
};

pieChart.radius = pieChart.width / 2;

const color = d3.scaleOrdinal(d3.schemeCategory20c);

const svg = d3.select('#wheel-container')
              .append('svg')
              .attr('width', pieChart.width)
              .attr('height', pieChart.height);

const chartContainer = svg.append('g')
                         .attr('transform', `translate(${pieChart.width / 2}, ${pieChart.height / 2})`);

const arc = d3.arc()
              .innerRadius(pieChart.innerWidth)
              .outerRadius(pieChart.radius);

const labelArc = d3.arc()
                   .innerRadius(pieChart.innerWidth + 5)
                   .outerRadius(pieChart.radius - 5);

const pie = d3.pie()
              .value(100 / lunchPlaces.length)
              .sort(null);



const slice = chartContainer.selectAll('path')
                            .data(pie(lunchPlaces))
                            .enter()
                            .append('g')

const sliceBg = slice.append('path')
                     .attr('d', arc)
                     .attr('fill', (d, i) => {
                       return color(i);
                     })

const sliceText = slice.append('text')
                       .text((d, i) => {
                         return d.data.name;
                       })
                       .attr("transform", function(d) {
                         var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                         return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
                       .attr("dy", ".35em")
                       .attr('text-anchor','middle')

const innerCircle = svg.append('circle')
                       .attr('cx', pieChart.innerWidth)
                       .attr('cy', pieChart.innerWidth)
                       .attr('r', pieChart.innerWidth)
                       .attr('transform', `translate(${(pieChart.width / 2) - pieChart.innerWidth}, ${(pieChart.height / 2) - pieChart.innerWidth})`)
                       .style('fill', '#444444');

// function createPieChart(chartData) {
//   const nameSpace = "http://www.w3.org/2000/svg";
//   const pieChartElement = document.createElementNS(nameSpace, 'svg');
//   pieChartElement.setAttribute('viewBox', '0 0 32 32');
//   chartData.forEach((lunchPlace, i) => {
//     const size = 100 / chartData.length
//     const dashArr = size.toString() + " 100";
//     const dashOffset = i !== 0 ? ((size * i) + size) : 0;
//
//     const sliceData = Object.assign({}, lunchPlace, {
//       dashArr,
//       dashOffset
//     })
//     createPieSlice(sliceData, size, pieChartElement);
//   })
//   return pieChartElement;
// }

// function createPieSlice(sliceData, size, pieChartElement) {
//   const nameSpace = "http://www.w3.org/2000/svg";
//   const circleEle = document.createElementNS(nameSpace, 'circle');
//   circleEle.setAttribute('r', 15.93);
//   circleEle.setAttribute('cx', 15.93);
//   circleEle.setAttribute('cy', 15.93);
//   circleEle.setAttribute('stroke', sliceData.color);
//   circleEle.setAttribute('stroke-dasharray', sliceData.dashArr);
//   circleEle.setAttribute('stroke-dashoffset', sliceData.dashOffset);
//   pieChartElement.appendChild(circleEle)
// }

// document.getElementById('wheel-container').appendChild(createPieChart(lunchPlaces));
