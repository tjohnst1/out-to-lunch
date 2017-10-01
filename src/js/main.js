import lunchPlaces from './seedData.js';
import * as d3 from 'd3';

var pieChart = {
  width: 300,
  height: 300,
  innerWidth: 20,
  colorScale: d3.scaleOrdinal(d3.schemeCategory20c),
  numberOfItems: lunchPlaces.length,
};

pieChart.radius = pieChart.width / 2;
pieChart.sliceWidth = 360 / pieChart.numberOfItems;

const svg = d3.select('#wheel-container')
              .append('svg')
              .attr('width', pieChart.width)
              .attr('height', pieChart.height);

const chartContainer = svg.append('g')
                          .attr('transform', `translate(${pieChart.width / 2}, ${pieChart.height / 2}) rotate(${pieChart.sliceWidth / 2})`);

const arc = d3.arc()
              .innerRadius(pieChart.innerWidth)
              .outerRadius(pieChart.radius);

const labelArc = d3.arc()
                   .innerRadius(pieChart.innerWidth + 5)
                   .outerRadius(pieChart.radius - 5);

const pie = d3.pie()
              .value(100 / pieChart.numberOfItems)
              .sort(null);

const slice = chartContainer.selectAll('path')
                            .data(pie(lunchPlaces))
                            .enter()
                            .append('g')

const sliceBg = slice.append('path')
                     .attr('d', arc)
                     .attr('fill', (d, i) => {
                       return pieChart.colorScale(i);
                     })

const sliceText = slice.append('text')
                       .text((d, i) => {
                         return d.data.name;
                       })
                       .attr("transform", function(d) {
                         var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
                         return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";
                       })
                       .attr("dy", ".35em")
                       .attr('text-anchor','middle')

const innerCircle = svg.append('circle')
                       .attr('cx', pieChart.innerWidth)
                       .attr('cy', pieChart.innerWidth)
                       .attr('r', pieChart.innerWidth)
                       .attr('transform', `translate(${(pieChart.width / 2) - pieChart.innerWidth}, ${(pieChart.height / 2) - pieChart.innerWidth})`)
                       .style('fill', '#444444')
                       .on('click', randomlySelectAPlace(chartContainer));

function randomlySelectAPlace(chart) {
  const numberOfPlaces = pieChart.numberOfItems;
  let initialOffset = (pieChart.sliceWidth / 2);
  return () => {
    const randomItemIndex = Math.floor(Math.random() * pieChart.numberOfItems);
    const randomPlaceOffset = randomItemIndex * pieChart.sliceWidth
    const newOffset = initialOffset + randomPlaceOffset + 720;
    (function(initialOffset) {
      chart.transition()
      .duration(600)
      .attrTween('transform', function() {
        console.log(`translate(${pieChart.width / 2}, ${pieChart.height / 2}) rotate(${initialOffset})`, `translate(${pieChart.width / 2}, ${pieChart.height / 2}) rotate(${newOffset})`)
        return d3.interpolateString(`translate(${pieChart.width / 2}, ${pieChart.height / 2}) rotate(${initialOffset})`, `translate(${pieChart.width / 2}, ${pieChart.height / 2}) rotate(${newOffset})`)
      })
    })(initialOffset)
    initialOffset = newOffset;
    showSelection(newOffset)
  };
}

function showSelection(offset) {
  document.getElementById('selection-container').innerHTML = '';
  const selectionIndex = (pieChart.numberOfItems - 1) - (((offset % 360) - (pieChart.sliceWidth / 2)) / pieChart.sliceWidth);
  setTimeout(() => {
    document.getElementById('selection-container').innerHTML = lunchPlaces[selectionIndex].name;
  }, 600)
}


const triangle = svg.append('path')
                    .attr('d', `M${pieChart.radius - 20} 0 L${pieChart.radius + 20} 0 L${pieChart.radius} 20 Z`)
                    .style('fill', "#111111")
