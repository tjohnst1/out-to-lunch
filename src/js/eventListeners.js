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
    elements.mainContent.classList.toggle('edit');
  }
}

export function addCloseBtnListener() {
  elements.closeBtn.onclick = () => {
    elements.mainContent.classList.remove('active', 'about', 'edit');
  }
}

export function addSpinButtonListener(pieChart) {
  document.getElementById('spin-btn').onclick = () => {
    pieChart.randomSelection()
  }
}
