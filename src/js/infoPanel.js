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

function createInputRow(place, inputCount, pieChart) {
  const inputRow = document.createElement('div')
  inputRow.classList.add('option-input');
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
    elements.inputContainer.removeChild(inputRow);
    const newSelection = pieChart.selectedPlaces.filter(place => place.id !== inputId);
    pieChart.setSelectedPlaces(newSelection);
    reorderInputElements();
    // addAddToSelectionButton();
    pieChart.draw();
  }
}

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
function reorderInputElements() {
  Array.from(document.getElementsByClassName('option-input'), (ele, i) => {
    ele.firstChild.innerHTML = (i + 1).toString();
  })
}
//
// function resetRotationalOffset() {
//   state.pieChart.rotationOffset = state.pieChart.sliceWidth() / 2;
// }
//
