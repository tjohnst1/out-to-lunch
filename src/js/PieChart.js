import * as d3 from 'd3';
import selectedPlaces from './seedData';
import { lightenDarkenColor } from './utilities';
import { displaySelection, clearSelection, createInputs } from './infoPanel';

export class PieChart {
  constructor(opts) {
    this.elementId = opts.elementId;
    this.viewboxWidth = opts.viewboxWidth;
    this.viewboxHeight = opts.viewboxHeight;
    this.width = opts.width;
    this.height = opts.height;
    this.innerWidth = opts.innerWidth;
    this.colorScale = opts.colorScale;
    this.selectedPlaces = opts.selectedPlaces;
    this.rotationalOffset = this.getSliceWidth() / 2;
    this.selectionIndex = null;
  }

  getRadius() {
    return this.width / 2;
  }

  getSliceWidth() {
    return 360 / this.selectedPlaces.length;
  }

  setRotationalOffset(newRotationalOffset) {
    this.rotationalOffset = newRotationalOffset;
  }

  resetRotationalOffset() {
    this.rotationalOffset = this.getSliceWidth() / 2;
  }

  setSelectionIndex(index) {
    this.selectionIndex = index;
  }

  resetSelectionIndex() {
    this.selectionIndex = null;
  }

  setSelectedPlaces(newSelection) {
    this.selectedPlaces = newSelection;
  }

  getSelectedPlaces() {
    return this.selectedPlaces;
  }

  draw() {
    // clears the chart for a redraw (in the case the chart is already on screen and the user modified the entries)
    document.getElementById(this.elementId).innerHTML = '';
    this.resetRotationalOffset();

    const svg = this.createBoundingBox();
    this.createDropShadow(svg);
    const arc = this.createArc();
    const sliceGroup = this.createSliceGroup(svg);
    this.createSlices(sliceGroup, arc);
    this.createInnerCircle(svg, sliceGroup);
    this.createTriangle(svg)
  }

  createBoundingBox() {
    return d3.select(`#${this.elementId}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.viewboxWidth} ${this.viewboxHeight}`)
  }

  createDropShadow(svg) {
    const defs = svg.append('defs');

    const filter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

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

    const feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    return filter;
  }

  createArc() {
    return d3.arc()
      .innerRadius(this.innerWidth)
      .outerRadius(this.getRadius());
  }

  createSliceGroup(svg) {
    return svg.append('g')
      .attr('transform', `translate(${this.viewboxWidth / 2}, ${this.viewboxHeight / 2}) rotate(${this.getSliceWidth() / 2})`)
      .style("filter", "url(#drop-shadow)");
  }

  createSlices(sliceGroup, arc) {
    const pie = d3.pie().value(100);

    const slice = sliceGroup.selectAll('path')
      .data(pie(this.selectedPlaces))
      .enter()
      .append('g')
      .attr('id', (d, i) => {
        return `slice-${i}`;
      });

    const sliceBg = slice.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => {
        return this.colorScale(i);
      });

    const sliceText = slice.append('text')
      .text((d, i) => {
        return d.data.name;
      })
      .attr('class', 'label')
      .attr('transform', function(d) {
        var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
        return "translate(" + arc.centroid(d)[0] + "," + arc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";
      })
      .attr('dy', '.35em')
      .attr('text-anchor','middle')

    return slice;
  }

  createInnerCircle(svg, sliceGroup) {
    return svg.append('circle')
      .attr('cx', this.innerWidth)
      .attr('cy', this.innerWidth)
      .attr('r', this.innerWidth)
      .attr('transform', `translate(${(this.viewboxWidth / 2) - this.innerWidth}, ${(this.viewboxHeight / 2) - this.innerWidth})`)
      .style('fill', '#444444')
  }

  createTriangle(svg){
    return svg.append('path')
      .attr('d', `M${(this.viewboxWidth / 2) - 20} 10 L${(this.viewboxWidth / 2) + 20} 10 L${this.viewboxWidth / 2} 30 Z`)
      .style('fill', "#444444");
  }

  randomSelection() {
    clearSelection();

    const randomItemIndex = Math.floor(Math.random() * this.selectedPlaces.length);
    const randomPlaceRotationalOffset = Math.floor(randomItemIndex * this.getSliceWidth());
    const newOffset = this.rotationalOffset + randomPlaceRotationalOffset + 720;
    const that = this;

    d3.select('#wheel-container svg g').transition()
      .duration(600)
      .attrTween('transform', () => {
        return d3.interpolateString(`translate(${that.viewboxWidth / 2}, ${that.viewboxHeight / 2}) rotate(${that.rotationalOffset})`, `translate(${that.viewboxWidth / 2}, ${that.viewboxHeight / 2}) rotate(${newOffset})`)
      })
      .on('end', () => {
        that.setRotationalOffset(newOffset);
        const selectionIndex = Math.floor((that.selectedPlaces.length - 1) - (((newOffset % 360) - (that.getSliceWidth() / 2)) / that.getSliceWidth()));
        that.setSelectionIndex(selectionIndex)
        that.calloutSelection(selectionIndex);
        displaySelection(that.selectedPlaces[selectionIndex].name);
      });
  }

  calloutSelection(index){
    const initialColor = d3.select(`#slice-${index} path`).attr('fill').toString();
    const lighterColor = lightenDarkenColor(initialColor, 30);
    const darkerColor = lightenDarkenColor(initialColor, -30);
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
}
