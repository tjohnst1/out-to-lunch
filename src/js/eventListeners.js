const elements = {
  mainContent: document.getElementById('main-content'),
  inputContainer: document.getElementById('input-container'),
  aboutLink: document.getElementById('about-link'),
  editLink: document.getElementById('edit-link'),
  closeBtn: document.getElementById('close-btn'),
  addBtn: document.getElementById('add-btn'),
  selectionInputs: document.getElementById('selection-input'),
};

export function addAboutLinkListener() {
  elements.aboutLink.onclick = () => {
    elements.mainContent.classList.add('active');
    elements.mainContent.classList.toggle('about');
  }
}

export function addEditLinkListener() {
  elements.editLink.onclick = () => {
    elements.mainContent.classList.add('active');
    elements.mainContent.classList.toggle('edit');
  }
}

export function addCloseBtnListener() {
  elements.closeBtn.onclick = () => {
    elements.mainContent.classList.remove('active', 'about', 'edit');
  }
}
