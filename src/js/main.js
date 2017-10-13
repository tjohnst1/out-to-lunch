import selectedPlaces from './seedData.js';
import * as d3 from 'd3';
import PieChart from './PieChart.js'

let state = {
  selectedPlaces: selectedPlaces,
  pieChart: {
    elementId: '#wheel-container',
    viewboxWidth: 375,
    viewboxHeight: 375,
    width: 325,
    height: 325,
    innerWidth: 20,
    colorScale: d3.scaleOrdinal(d3.schemeCategory20c),
    selectedPlaces: selectedPlaces
  }
}

// state.pieChart.radius = state.pieChart.width / 2;
// state.pieChart.sliceWidth = () => 360 / state.pieChart.numberOfItems();
// state.pieChart.rotationOffset = state.pieChart.sliceWidth() / 2;

const lunchChart = new PieChart(state.pieChart);
lunchChart.draw();





// const spinButton = d3.select('#spin-btn')
//   .on('click', randomlySelectAPlace(chartContainer))
//
// function randomlySelectAPlace(chart) {
//   return () => {
//     const randomItemIndex = Math.floor(Math.random() * state.pieChart.numberOfItems());
//     const randomPlaceRotationOffset = Math.floor(randomItemIndex * state.pieChart.sliceWidth());
//     const newOffset = state.pieChart.rotationOffset + randomPlaceRotationOffset + 720;
//
//     chart.transition().duration(600)
//     .attrTween('transform', function() {
//       return d3.interpolateString(`translate(${state.pieChart.viewboxWidth / 2}, ${state.pieChart.viewboxHeight / 2}) rotate(${state.pieChart.rotationOffset})`, `translate(${state.pieChart.viewboxWidth / 2}, ${state.pieChart.viewboxHeight / 2}) rotate(${newOffset})`)
//     })
//     .on('end', function() {
//       state.pieChart.rotationOffset = newOffset;
//       showSelection(newOffset);
//     });
//   };
// }
//
// function showSelection(offset) {
//   document.getElementById('selection').innerHTML = '';
//   const selectionIndex = Math.floor((state.pieChart.numberOfItems() - 1) - (((offset % 360) - (state.pieChart.sliceWidth() / 2)) / state.pieChart.sliceWidth()));
//   setTimeout(() => {
//     calloutSelection(selectionIndex)
//   }, 600)
//   setTimeout(() => {
//     document.getElementById('selection').innerHTML = state.selectedPlaces[selectionIndex].name;
//   }, 1200)
// }
//
// function calloutSelection(index){
//   const initialColor = d3.select(`#slice-${index} path`).attr('fill').toString();
//   const lighterColor = LightenDarkenColor(initialColor, 30);
//   const darkerColor = LightenDarkenColor(initialColor, -30);
//   d3.select(`#slice-${index} path`).attr('fill', lighterColor)
//   setTimeout(() => {
//     d3.select(`#slice-${index} path`).attr('fill', darkerColor)
//   }, 300)
//   setTimeout(() => {
//     d3.select(`#slice-${index} path`).attr('fill', lighterColor)
//   }, 600)
//   setTimeout(() => {
//     d3.select(`#slice-${index} path`).attr('fill', darkerColor)
//   }, 900)
//   setTimeout(() => {
//     d3.select(`#slice-${index} path`).attr('fill', initialColor)
//   }, 1200)
// }
//
// function LightenDarkenColor(col, amt) {
//     var usePound = false;
//     if (col[0] == "#") {
//         col = col.slice(1);
//         usePound = true;
//     }
//     var num = parseInt(col,16);
//     var r = (num >> 16) + amt;
//     if (r > 255) r = 255;
//     else if  (r < 0) r = 0;
//     var b = ((num >> 8) & 0x00FF) + amt;
//     if (b > 255) b = 255;
//     else if  (b < 0) b = 0;
//     var g = (num & 0x0000FF) + amt;
//     if (g > 255) g = 255;
//     else if (g < 0) g = 0;
//     return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
// }

// const triangle = svg.append('path')
//                     .attr('d', `M${(state.pieChart.viewboxWidth / 2) - 20} 10 L${(state.pieChart.viewboxWidth / 2) + 20} 10 L${state.pieChart.viewboxWidth / 2} 30 Z`)
//                     .style('fill', "#444444");

// const elements = {
//   mainContent: document.getElementById('main-content'),
//   inputContainer: document.getElementById('input-container'),
//   aboutLink: document.getElementById('about-link'),
//   editLink: document.getElementById('edit-link'),
//   closeBtn: document.getElementById('close-btn'),
//   addBtn: document.getElementById('add-btn'),
//   selectionInputs: document.getElementById('selection-input'),
// };
//
// elements.aboutLink.onclick = () => {
//   elements.mainContent.classList.add('active');
//   elements.mainContent.classList.toggle('about');
// }
//
// elements.editLink.onclick = () => {
//   elements.mainContent.classList.add('active');
//   elements.mainContent.classList.toggle('edit');
// }
//
// elements.closeBtn.onclick = () => {
//   elements.mainContent.classList.remove('active', 'about', 'edit');
// }
//
// function createInputs(data) {
//   data.map((place, i) => {
//     return createInputRow(place, i + 1);
//   })
//   .forEach((inputEle) => {
//     return elements.inputContainer.appendChild(inputEle);
//   });
// }
//
// function createInputRow(place, inputCount) {
//   const inputRow = document.createElement('div')
//   inputRow.classList.add('option-input');
//   const inputLabel = document.createElement('label')
//   inputLabel.innerHTML = inputCount;
//   const input = document.createElement('input');
//   input.setAttribute('type', 'text');
//   input.setAttribute('data-input-id', place.id)
//   input.classList.add('selection-input');
//   input.value = place.name;
//   const removeButton = document.createElement('button');
//   removeButton.setAttribute('type', 'button');
//   removeButton.innerHTML = '-';
//   removeButton.classList.add('remove-btn');
//   inputRow.appendChild(inputLabel);
//   inputRow.appendChild(input);
//   inputRow.appendChild(removeButton);
//   addEditSelectionListener(input, place);
//   addRemoveSelectionListener(removeButton, inputRow, place);
//   return inputRow;
// }
//
// function addEditSelectionListener(inputEle, placeData) {
//   inputEle.onkeyup = (e) => {
//     state = Object.assign({}, state, {
//       selectedPlaces: state.selectedPlaces.map(place => {
//         if (place.id === placeData.id) {
//           return {
//             name: e.target.value,
//             id: placeData.id,
//           }
//         }
//         return place;
//       })
//     });
//     updateChartText();
//   }
// }
//
// function addRemoveSelectionListener(buttonEle, inputRow, dataToRemove) {
//   buttonEle.onclick = () => {
//     elements.inputContainer.removeChild(inputRow);
//     state = Object.assign({}, state, {
//       selectedPlaces: state.selectedPlaces.filter(place => place.id !== dataToRemove.id),
//     })
//     reorderInputElements();
//     addAddToSelectionButton();
//     redrawChart();
//   }
// }
//
// function addAddToSelectionButton() {
//   const addBtn = document.createElement('button');
//   addBtn.setAttribute('type', 'button');
//   addBtn.id = 'add-btn';
//   addBtn.innerHTML = 'Add';
//   addBtn.onclick = () => {
//     const newSelection = {
//       id: state.selectedPlaces.length,
//       name: 'placeholder'
//     }
//     state = Object.assign({}, state, {
//       selectedPlaces: [...state.selectedPlaces, newSelection]
//     })
//     const inputRow = createInputRow(newSelection, state.selectedPlaces.length);
//     elements.inputContainer.appendChild(inputRow);
//     reorderInputElements();
//     console.log(state)
//     redrawChart();
//   }
//   if (!document.getElementById('add-btn')) {
//     document.getElementById('edit-container').appendChild(addBtn);
//   }
// }
//
// function updateChartText() {
//   return sliceText.data(state.selectedPlaces)
//     .text((d, i) => d.name);
// }
//
// function redrawChart() {
//   const gs = chartContainer.selectAll('g').data(pie(state.selectedPlaces));
//   gs.select('path').attr('d', arc)
//   gs.select('text')
//     .text((d, i) => {
//       return d.data.name;
//     })
//     .attr("transform", function(d) {
//       var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
//       return "translate(" + arc.centroid(d)[0] + "," + arc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")";
//     });
//
//   resetRotationalOffset();
//   chartContainer.attr('transform', `translate(${state.pieChart.viewboxWidth / 2}, ${state.pieChart.viewboxHeight / 2}) rotate(${state.pieChart.sliceWidth() / 2})`);
//
//   gs.exit().remove();
// }
//
// function reorderInputElements() {
//   Array.from(document.getElementsByClassName('option-input'), (ele, i) => {
//     ele.firstChild.innerHTML = (i + 1).toString();
//   })
// }
//
// function resetRotationalOffset() {
//   state.pieChart.rotationOffset = state.pieChart.sliceWidth() / 2;
// }
//
// createInputs(state.selectedPlaces);
