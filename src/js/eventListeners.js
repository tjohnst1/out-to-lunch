import { randomlySelectAPlace } from './PieChart';
import { elements } from './main';
import { clearSelection, toggleHideElement } from './infoPanel';

export function addAboutLinkListener() {
  elements.aboutLink.onclick = () => {
    elements.mainContent.classList.add('active');
    elements.mainContent.classList.toggle('about');
  }
}

export function addEditLinkListener() {
  elements.editLink.onclick = () => {
    clearSelection()
    elements.mainContent.classList.add('active');
    elements.mainContent.classList.add('edit');
    toggleHideElement(elements.editLink);
    Array.from(document.getElementsByClassName('option-input')).forEach(node => {
      node.classList.add('active');
    })
  }
}

export function addCloseBtnListener() {
  elements.closeBtn.onclick = () => {
    elements.mainContent.classList.remove('active', 'about', 'edit');
    toggleHideElement(elements.editLink);
    Array.from(document.getElementsByClassName('option-input')).forEach(node => {
      node.classList.remove('active');
    })
  }
}

export function addSpinButtonListener(pieChart) {
  document.getElementById('spin-btn').onclick = () => {
    pieChart.randomSelection()
  }
}

export function addResizeListener(ele) {
  const initialHeight = ele.offsetHeight;
  window.addEventListener('resize', function() {
    resizeWhenNecessary(ele, initialHeight);
  })
}

// resizes an element when the user adjusts the height of the browser
function resizeWhenNecessary(ele, initialHeight) {
  const currentHeight = ele.offsetHeight;
  const scale = currentHeight / initialHeight;

  if (scale < 1) {
    window.requestAnimationFrame(() => {
      return ele.style.transform = `scale(${scale})`;
    })
  }
}
