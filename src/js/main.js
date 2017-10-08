import lunchPlaces from './seedData.js';
import * as d3 from 'd3';

var pieChart = {
  viewboxWidth: 375,
  viewboxHeight: 375,
  width: 325,
  height: 325,
  innerWidth: 20,
  colorScale: d3.scaleOrdinal(d3.schemeCategory20c),
  numberOfItems: lunchPlaces.length,
};

pieChart.radius = pieChart.width / 2;
pieChart.sliceWidth = 360 / pieChart.numberOfItems;

const svg = d3.select('#wheel-container')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', '0 0 375 375')
  .style('max-width', '375px');

const defs = svg.append('defs');

const filter = defs.append('filter')
  .attr('id', 'drop-shadow')
  .attr('height', '130%');

// drop shadow styles //
filter.append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 6)
  .attr("result", "blur");

filter.append("feOffset")
  .attr("in", "blur")
  .attr("dx", 0)
  .attr("dy", 0)
  .attr("result", "offsetBlur");

filter.append("feFlood")
  .attr("in", "offsetBlur")
  .attr("flood-color", "#111111")
  .attr("flood-opacity", "0.3")
  .attr("result", "offsetColor");

filter.append("feComposite")
  .attr("in", "offsetColor")
  .attr("in2", "offsetBlur")
  .attr("operator", "in")
  .attr("result", "offsetBlur");

var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
  .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");

const chartContainer = svg.append('g')
  .attr('transform', `translate(${pieChart.viewboxWidth / 2}, ${pieChart.viewboxHeight / 2}) rotate(${pieChart.sliceWidth / 2})`)
  .style("filter", "url(#drop-shadow)");

const arc = d3.arc()
  .innerRadius(pieChart.innerWidth)
  .outerRadius(pieChart.radius);

const labelArc = d3.arc()
  .innerRadius(pieChart.innerWidth)
  .outerRadius(pieChart.radius);

const pie = d3.pie()
  .value(100 / pieChart.numberOfItems)
  .sort(null);

const slice = chartContainer.selectAll('path')
  .data(pie(lunchPlaces))
  .enter()
  .append('g')
  .attr('id', (d, i) => {
    return `slice-${i}`;
  });

const sliceBg = slice.append('path')
  .attr('d', arc)
  .attr('fill', (d, i) => {
    return pieChart.colorScale(i);
  });

const sliceText = slice.append('text')
  .text((d, i) => {
    return d.data.name;
  })
  .attr("class", "label")
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
  .attr('transform', `translate(${(pieChart.viewboxWidth / 2) - pieChart.innerWidth}, ${(pieChart.viewboxHeight / 2) - pieChart.innerWidth})`)
  .style('fill', '#444444')
  .on('click', randomlySelectAPlace(chartContainer));

const spinButton = d3.select('#spin-btn')
  .on('click', randomlySelectAPlace(chartContainer))

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
        return d3.interpolateString(`translate(${pieChart.viewboxWidth / 2}, ${pieChart.viewboxHeight / 2}) rotate(${initialOffset})`, `translate(${pieChart.viewboxWidth / 2}, ${pieChart.viewboxHeight / 2}) rotate(${newOffset})`)
      })
    })(initialOffset)
    initialOffset = newOffset;
    showSelection(newOffset)
  };
}

function showSelection(offset) {
  document.getElementById('selection').innerHTML = '';
  const selectionIndex = (pieChart.numberOfItems - 1) - (((offset % 360) - (pieChart.sliceWidth / 2)) / pieChart.sliceWidth);
  setTimeout(() => {
    calloutSelection(selectionIndex)
  }, 600)
  setTimeout(() => {
    document.getElementById('selection').innerHTML = lunchPlaces[selectionIndex].name;
  }, 1200)
}

function calloutSelection(index){
  const initialColor = d3.select(`#slice-${index} path`).attr('fill').toString();
  const lighterColor = LightenDarkenColor(initialColor, 30);
  const darkerColor = LightenDarkenColor(initialColor, -30);
  d3.select(`#slice-${index} path`).attr('fill', lighterColor)
  setTimeout(() => {
    d3.select(`#slice-${index} path`).attr('fill', darkerColor)
  }, 300)
  setTimeout(() => {
    d3.select(`#slice-${index} path`).attr('fill', lighterColor)
  }, 600)
  setTimeout(() => {
    d3.select(`#slice-${index} path`).attr('fill', darkerColor)
  }, 900)
  setTimeout(() => {
    d3.select(`#slice-${index} path`).attr('fill', initialColor)
  }, 1200)
}

function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

const triangle = svg.append('path')
                    .attr('d', `M${(pieChart.viewboxWidth / 2) - 20} 10 L${(pieChart.viewboxWidth / 2) + 20} 10 L${pieChart.viewboxWidth / 2} 30 Z`)
                    .style('fill', "#444444");

const elements = {
  mainContent: document.getElementById('main-content'),
  inputContainer: document.getElementById('input-container'),
  aboutLink: document.getElementById('about-link'),
  editLink: document.getElementById('edit-link'),
  closeBtn: document.getElementById('close-btn'),
  addBtn: document.getElementById('add-btn'),
  selectionInputs: document.getElementById('selection-input'),
}

elements.aboutLink.onclick = () => {
  elements.mainContent.classList.add('active');
  elements.mainContent.classList.toggle('about');
}

elements.editLink.onclick = () => {
  elements.mainContent.classList.add('active');
  elements.mainContent.classList.toggle('edit');
}

elements.closeBtn.onclick = () => {
  elements.mainContent.classList.remove('active', 'about', 'edit');
}

function createInputRows(data) {
  data.map((place, i) => {
    return createInputRow(place, i + 1);
  })
  .forEach((inputEle) => {
    return elements.inputContainer.appendChild(inputEle);
  });
}

function createInputRow(place, inputCount) {
  const inputRow = document.createElement('div')
  inputRow.classList.add('option-input');
  const inputLabel = document.createElement('label')
  inputLabel.innerHTML = inputCount;
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('data-input-id', place.id)
  input.classList.add('selection-input');
  input.value = place.name;
  addInputListener(input, place);
  const removeButton = document.createElement('button');
  removeButton.setAttribute('type', 'button');
  removeButton.innerHTML = '-';
  removeButton.classList.add('remove-btn');
  inputRow.appendChild(inputLabel);
  inputRow.appendChild(input);
  inputRow.appendChild(removeButton);
  return inputRow;
}

function addInputListener(inputEle, place) {
  inputEle.onkeyup = (e) => {
    lunchPlaces[place.id].name = e.target.value;
    updateChartText();
  }
}

function updateChartText() {
  sliceText.data(lunchPlaces)
  .text((d, i) => d.name);
}

createInputRows(lunchPlaces);
