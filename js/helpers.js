function makeElement(type, attrs, txt) {
  attrs = attrs || {};
  txt = txt || '';

  var el = document.createElement(type);

  if (Object.keys(attrs).length !== 0) {
    for (const [attr, val] of Object.entries(attrs)) {
      el.setAttribute(attr, val);
    }
  }

  if (txt != '') {
    el.innerHTML = txt;
  }

  return el
}

function appendChildren(p, c) {
  for (var child of c) {
    if (Array.isArray(child)) {
      appendChildren(p, child);
    } else {
      p.appendChild(child);
    }
  }
}

function removeElement(id) {
  var element = document.getElementById(id)
  element.parentNode.removeChild(element);
}
