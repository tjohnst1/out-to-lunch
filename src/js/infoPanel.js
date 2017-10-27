import { elements } from './main';

export function displaySelection(name) {
  document.getElementById('selection').innerHTML = '';
  setTimeout(() => {
    document.getElementById('selection').innerHTML = name;
  }, 1000)
}

export function clearSelection() {
  document.getElementById('selection').innerHTML = '';
}

export function createInputs(pieChart) {
  const data = pieChart.selectedPlaces;
  data.map((place, i) => {
    return createInputRow(place, i + 1, pieChart);
  })
  .forEach((inputEle) => {
    return elements.inputContainer.appendChild(inputEle);
  });
}

function createInputRow(place, inputCount, pieChart, classToAdd='') {
  const inputRow = document.createElement('div')
  inputRow.classList.add('option-input', `input-${inputCount}`);
  if (classToAdd) {
    inputRow.classList.add(classToAdd);
  }
  const inputLabel = document.createElement('label')
  inputLabel.innerHTML = inputCount;
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('data-input-id', place.id)
  input.classList.add('selection-input');
  input.value = place.name;
  const removeButton = document.createElement('button');
  removeButton.setAttribute('type', 'button');
  removeButton.innerHTML = '-';
  removeButton.classList.add('remove-btn');
  inputRow.appendChild(inputLabel);
  inputRow.appendChild(input);
  inputRow.appendChild(removeButton);
  addEditSelectionListener(input, pieChart);
  addRemoveSelectionListener(removeButton, inputRow, place.id, pieChart);
  return inputRow;
}

function addEditSelectionListener(inputEle, pieChart) {
  inputEle.onkeyup = (e) => {
    const inputId = Number(inputEle.getAttribute('data-input-id'));
    // edit the info for the selection that has the matching id
    const newSelection = pieChart.selectedPlaces.map((place) => {
      if (inputId === place.id) {
        return {
          name: e.target.value,
          id: inputId
        }
      }
      return place;
    })
    pieChart.setSelectedPlaces(newSelection);
    pieChart.draw();
  }
}

function addRemoveSelectionListener(buttonEle, inputRow, inputId, pieChart) {
  buttonEle.onclick = () => {
    // add a class to trigger the exit animation
    inputRow.classList.add('remove');
    // wait 300 for the exit animation to finish before actually removing the element from screen
    setTimeout(() => {
      elements.inputContainer.removeChild(inputRow);
      const newSelection = pieChart.selectedPlaces.filter(place => place.id !== inputId);
      pieChart.setSelectedPlaces(newSelection);
      reorderInputElements();
      // add the "add" button only if there are less than 9 entries (more than 9 makes the chart kinda hard to read)
      addAddToSelectionButton(pieChart);

      pieChart.draw();
    }, 300)
  }
}

function addAddToSelectionButton(pieChart) {
  // create button element
  const addBtn = document.createElement('button');
  addBtn.setAttribute('type', 'button');
  addBtn.id = 'add-btn';
  addBtn.innerHTML = 'Add';

  // add click listener for button
  addBtn.onclick = () => {
    const newSelection = {
      id: pieChart.selectedPlaces.length,
      name: 'placeholder'
    };

    pieChart.setSelectedPlaces([...pieChart.selectedPlaces, newSelection]);
    var inputRow = createInputRow(newSelection, pieChart.selectedPlaces.length, pieChart, 'add');
    elements.inputContainer.appendChild(inputRow);
    reorderInputElements();

    // check if there are already 9 entries (more than 9 makes the chart kinda hard to read)
    if (pieChart.getSelectedPlaces().length > 8) {
      removeAddToSelectionButton();
    }

    // wait for the animation to complete
    setTimeout(() => {
      pieChart.draw();
    }, 300)
  }

  // if there isn't a add button already present, add it
  if (!document.getElementById('add-btn')) {
    document.getElementById('edit-container').appendChild(addBtn);
  }
}

function removeAddToSelectionButton() {
  elements.editContainer.removeChild(document.getElementById('add-btn'));
  console.log('called')
}

function reorderInputElements() {
  Array.from(document.getElementsByClassName('option-input'), (ele, i) => {
    const num = (i + 1).toString();
    ele.firstChild.innerHTML = num;
    ele.className = `option-input input-${num}`;
  })
}
