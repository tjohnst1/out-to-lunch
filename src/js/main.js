import selectedPlaces from './seedData';
import * as d3 from 'd3';
import { PieChart } from './PieChart'
import { addAboutLinkListener, addEditLinkListener, addCloseBtnListener, addSpinButtonListener } from './eventListeners'
import { createInputs } from './infoPanel';

export const elements = {
  mainContent: document.getElementById('main-content'),
  inputContainer: document.getElementById('input-container'),
  detailsContainer: document.getElementsByClassName('details-container')[0],
  aboutLink: document.getElementById('about-link'),
  editLink: document.getElementById('edit-link'),
  closeBtn: document.getElementById('close-btn'),
  addBtn: document.getElementById('add-btn'),
  selectionInputs: document.getElementById('selection-input'),
  editContainer: document.getElementById('edit-container'),
};

const config = {
  selectedPlaces: selectedPlaces,
  pieChart: {
    elementId: 'wheel-container',
    viewboxWidth: 375,
    viewboxHeight: 375,
    width: 325,
    height: 325,
    innerWidth: 20,
    colorScale: d3.scaleOrdinal(d3.schemeCategory20c),
    selectedPlaces: selectedPlaces,
  }
}

const lunchChart = new PieChart(config.pieChart);
lunchChart.draw();
addAboutLinkListener();
addEditLinkListener();
addCloseBtnListener();
addSpinButtonListener(lunchChart);
createInputs(lunchChart);
addResizeListener(elements.mainContent);

// resizes the chart + the text and button in response to vertical height resizing
function addResizeListener(ele) {
  const initialHeight = ele.offsetHeight;

  window.addEventListener('resize', function() {
    resizeWhenNecessary(ele, initialHeight);
  })
}

function resizeWhenNecessary(ele, initialHeight) {
  const currentHeight = ele.offsetHeight;
  const scale = currentHeight / initialHeight;

  if (scale < 1) {
    window.requestAnimationFrame(() => {
      return ele.style.transform = `scale(${scale})`;
    })
  }
}
