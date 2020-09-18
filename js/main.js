
var critData = {};
var activityData = {};


window.addEventListener('load', function() {
  initCriteria();
  // var div = makeRangeDiv({'class': 'hi', 'value': '5'});
  // document.getElementById('container').appendChild(div);
});

function addCriteriaCard() {
  var criteriaDivContainer = document.getElementById('criteria-div-container');

  var parentDiv = makeElement('div', {
    'class': 'criteria-div card',
  });

  var trashIcon = makeElement('i', {
    'class': 'fa fa-trash-o trash-icon',
    'style': 'display: none; font-size: 35px;'
  });

  var toolsDiv = makeElement('div', {
    'class': 'criteria-div-tools tools-div',
  });

  toolsDiv.appendChild(trashIcon);

  toolsDiv.onclick = function () {
    var element = this.parentElement;
    element.parentNode.removeChild(element);
  }

  parentDiv.onmouseover = function (){
    trashIcon.style.display = 'block';
  }

  parentDiv.onmouseout = function () {
    trashIcon.style.display = 'none';
  }

  var formDiv = makeElement('div', {
    'class': 'criteria-div-form form-div',
  });


  var critNameLabel = makeElement('label', {
    'for': 'criteria-name'
  }, 'Name of criteria');

  var critNameInput = makeElement('input', {
    'type': 'text',
    'class': 'criteria-name name-input',
    'placeholder': 'E.g. How much does it contribute to my job experience?'
  });

  var critImpLabel = makeElement('label', {
    'for': 'criteria-importance'
  }, 'How important do you feel this criteria is for your decision?');

  // var critImpValue = makeElement('span', {
  //   'class': 'criteria-importance-value'
  // }, '5');

  var critImpInput = makeRangeDiv({
    'class': 'criteria-importance',
  });
  // var critImpInput = makeElement('input', {
  //   'type': 'range',
  //   'min': '1',
  //   'max': '10',
  //   'value': '5',
  //   'class': 'slider criteria-importance',
  // });
  //
  // critImpInput.oninput = function (){
  //   critImpValue.innerHTML = this.value;
  // }

  appendChildren(formDiv, [critNameLabel, document.createElement('br'), critNameInput, document.createElement('br'), critImpLabel, document.createElement('br'), critImpInput]);
  appendChildren(parentDiv, [formDiv, toolsDiv]);
  criteriaDivContainer.appendChild(parentDiv);
}

function addActivitiesCard() {
  var activityDivContainer = document.getElementById('activity-div-container');

  var parentDiv = makeElement('div', {
    'class': 'activity-div card',
  });

  var trashIcon = makeElement('i', {
    'class': 'fa fa-trash-o trash-icon',
    'style': 'display: none; font-size: 35px;'
  });

  var toolsDiv = makeElement('div', {
    'class': 'activity-div-tools tools-div',
  });

  toolsDiv.appendChild(trashIcon);

  toolsDiv.onclick = function () {
    var element = this.parentElement;
    element.parentNode.removeChild(element);
  }

  parentDiv.onmouseover = function (){
    trashIcon.style.display = 'block';
  }

  parentDiv.onmouseout = function () {
    trashIcon.style.display = 'none';
  }

  var formDiv = makeElement('div', {
    'class': 'activity-div-form form-div',
  });


  var actNameLabel = makeElement('label', {
    'for': 'activity-name'
  }, 'Name of activity');

  var actNameInput = makeElement('input', {
    'type': 'text',
    'class': 'activity-name name-input',
    'placeholder': 'E.g. Hockey'
  });

  var h1 = makeElement('h1', {}, 'On a scale of 1-10, how well does this activity fulfil the following criteria:');

  var criteria = [];
  var table = makeElement('table', {
    'class': 'activities-criteria-table'
  });

  for (var critName in critData) {
    (function () {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');

      var critLabel = makeElement('label', {
        'for': 'activity-criteria-importance'
      }, critName);

      td1.appendChild(critLabel);

      var critImpInput = makeRangeDiv({
        'class': 'activity-criteria-importance',
        'id': critName
      });

      td2.appendChild(critImpInput);

      appendChildren(tr, [td1, td2])
      table.appendChild(tr);
    }());
  }

  appendChildren(formDiv, [actNameLabel, document.createElement('br'), actNameInput, document.createElement('br'), h1, table]);
  appendChildren(parentDiv, [formDiv, toolsDiv]);
  activityDivContainer.appendChild(parentDiv);
}

function submitCriteria() {
  const criteriaDivContainer = document.getElementById('criteria-div-container');

  if (criteriaDivContainer.innerHTML === "") {
    alert("You haven't entered any criteria yet!");
    return;
  }

  var forms = document.getElementsByClassName('criteria-div-form');
  var totalImportance = 0;

  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];

    // Un-red all filled out cards
    form.parentNode.style = "";

    var criteriaName = form.getElementsByClassName('criteria-name')[0].value;
    if (criteriaName == "") {
      form.parentNode.style.border = "solid 1px red";
      alert("Please fill out all fields before submitting!");
      return;
    }
    var criteriaImportance = parseInt(form.getElementsByClassName('criteria-importance')[0].value);
    totalImportance += criteriaImportance;

    critData[criteriaName] = criteriaImportance;
  }

  for (var critName in critData) {
    critData[critName] = critData[critName]/totalImportance;
  }

  // Clear criteria div
  document.getElementById('criteria-section').innerHTML = "";

  // Add stuff in activities section
  initActivities();

}

function submitActivities() {
  const activityDivContainer = document.getElementById('activity-div-container');

  if (activityDivContainer.innerHTML === "") {
    alert("You haven't entered any activities yet!");
    return;
  }

  var forms = document.getElementsByClassName('activity-div-form');

  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];

    // Un-red all filled out cards
    form.parentNode.style = "";

    var activityName = form.getElementsByClassName('activity-name')[0].value;
    if (activityName == "") {
      form.parentNode.style.border = "solid 1px red";
      alert("Please fill out all fields before submitting!");
      return;
    }
    var activityCriteriaImportance = form.getElementsByClassName('activity-criteria-importance');
    var weightedSum = 0;

    for (var j = 0; j < activityCriteriaImportance.length; j++) {
      var criteria = activityCriteriaImportance[j];
      weightedSum += critData[criteria.id] * parseInt(criteria.value);
    }
    activityData[activityName] = weightedSum;
  }

  // Clear activity div
  document.getElementById('activity-section').innerHTML = "";

  displayResults();

}

function initCriteria() {
  window.scrollTo(0, 0)

  var heading = makeElement('h1', {
    'class': 'section-heading'
  }, 'Begin by creating the criteria that you want to measure');

  var cardsContainerDiv = makeElement('div', {
    'id': 'criteria-div-container'
  });

  appendChildren(document.getElementById('criteria-section'), [heading, cardsContainerDiv]);

  addCriteriaCard();

  var btn1 = makeElement('button', {
    'type': 'button',
    'name': 'add-criteria-btn',
    'id': 'add-criteria-btn',
    'class': 'add-card-btn'
  }, '+');

  btn1.addEventListener('click', addCriteriaCard);

  document.getElementById('next-btn').addEventListener('click', submitCriteria);

  var btnsDiv = makeElement('div', {
    'id': 'criteria-btns-div'
  });
  btnsDiv.appendChild(btn1);


  document.getElementById('criteria-section').appendChild(btnsDiv);
}

function initActivities(){
  window.scrollTo(0, 0);

  var heading = makeElement('h1', {
    'class': 'section-heading'
  }, 'Now, add and evaluate your activities');

  var cardsContainerDiv = makeElement('div', {
    'id': 'activity-div-container'
  });

  appendChildren(document.getElementById('activity-section'), [heading, cardsContainerDiv]);

  addActivitiesCard();

  var btn1 = makeElement('button', {
    'type': 'button',
    'name': 'add-activity-btn',
    'id': 'add-activity-btn',
    'class': 'add-card-btn'
  }, '+');

  btn1.addEventListener('click', addActivitiesCard);

  document.getElementById('next-btn').removeEventListener('click', submitCriteria);
  document.getElementById('next-btn').addEventListener('click', submitActivities);
  document.getElementById('next-btn').innerHTML = "Find out what's best for you";

  var btnsDiv = makeElement('div', {
    'id': 'activity-btns-div'
  });
  btnsDiv.appendChild(btn1);

  document.getElementById('activity-section').appendChild(btnsDiv);
}

function displayResults() {
  window.scrollTo(0, 0);

  removeElement('next-btn');

  var heading = makeElement('h1', {
    'class': 'section-heading'
  }, 'Your activities, sorted by how well they fit your criteria');
  document.getElementById('results-section').appendChild(heading);

  var sortable = [];
  for (var activity in activityData) {
    sortable.push([activity, activityData[activity]]);
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  });

  var resultsDiv = document.getElementById('results-section');
  var ol = makeElement('ol', {
    'id': 'results-ol'
  });
  for (var item of sortable) {
    var li = makeElement('li', {}, item[0]);
    ol.appendChild(li);
  }
  resultsDiv.appendChild(ol);
}

function displayError(msg) {
  return;
}

function makeRangeDiv(params) {
  params['class'] = `${params['class']} range-parent` || "range-parent";
  var parent = makeElement('div', params);
  parent.value = 1;

  for (let i=1; i <= 10; i++) {
    (function () {
      var div = makeElement('div', {
        'class': 'range-el',
        'id': i
      }, i);
      if (i == 1) {
        div.style.backgroundColor = "#ea222a";
      }
      div.onmouseover = function () {
        rangeHighlight(parent, this);
      }

      div.onmouseout = function () {
        for (var node of parent.childNodes) {
          if (parseInt(node.id) > parent.value){
            node.style.backgroundColor = "";
          }
        }
      }

      div.onclick = function () {
        rangeHighlight(parent, this);
        parent.value = parseInt(this.id);
      }
      parent.appendChild(div);
    }());
  }

  return parent;
}

function rangeHighlight(parent, stopNode) {
  var ascendingColors = ["#ea222a", "#dc3127", "#c74824", "#b45e25", "#b45e25", "#848e27", "#6aac30", "#4abc37", "#29b242", "#21af45"];

  for (var j = 0; j < parent.childNodes.length; j++) {
    var node = parent.childNodes[j];
    if (node === stopNode) {
      stopNode.style.backgroundColor = ascendingColors[j];
      break;
    }
    node.style.backgroundColor = ascendingColors[j];
  }
}
