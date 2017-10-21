import { randomlySelectAPlace } from './PieChart';
import { elements } from './main';
import { clearSelection } from './infoPanel';

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
    Array.from(document.getElementsByClassName('option-input')).forEach(node => {
      node.classList.add('active');
    })
  }
}

export function addCloseBtnListener() {
  elements.closeBtn.onclick = () => {
    elements.mainContent.classList.remove('active', 'about', 'edit');
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
