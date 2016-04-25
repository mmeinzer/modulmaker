"use strict";

(function() {
  // create the outermost SVG element and add a border to it
  var draw = new SVG('frame').size('100%', 500);
  var border = draw.rect('100%', 500).attr({
    fill: '#fff',
    stroke: '#000',
    'stroke-width': '3px'
  });
  var moduls = makeModulsGroup()
  var toolbox = makeToolbox()
  var clickState = {
    firstClick: true,
    startX: null,
    startY: null,
    endX: null,
    endY: null   
  }
  
  // create an pannable zoomable object group which will contain all moduls
  function makeModulsGroup() {
    var moduls = draw.group();
    moduls.panZoom({
      zoomSpeed: -1,  
      zoom: [1, 3]
    })
    return moduls
  }

  function resetWindow() {
    if (moduls) {
      moduls.each(function(i, children) {
        this.remove()
      })
    }
    moduls
      .transform({
        scale: 1
      })
      .transform({
        x: 0
      })
      .transform({
        y: 0
      })
  }

  // make the toolbox overlay
  function makeToolbox() {
    var ui = draw.group();
    var uiBox = ui.rect('15%', 350).move('83%', '13%')
      .radius(10)
      .attr({
        fill: '#19C3FF'
      })
      // drop shadow
      .filter(function(add) {
        var blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4)
        add.blend(add.source, blur)
        this.size('175%', '175%').move('-50%', '-50%')
      });
    return ui
  }

  function addModul() {
    // TODO: the button id could be set to the modul name eg.
    // var modulType = this.id
    
    // TODO: this would likely be better implemented with use()
    // adds the tempmodul
    var modul = moduls.group().draggable().svg(tempmodul);
    
    modul.click(function(event) {
      if (event.target.className.baseVal == "header") {
        if (clickState.firstClick){
          clickState.startX = parseFloat(event.target.getAttribute('x')) + this.transform('x') + parseFloat(event.target.getAttribute('width'))/2
          clickState.startY = parseFloat(event.target.getAttribute('y')) + this.transform('y') + parseFloat(event.target.getAttribute('height'))/2
        } else {
          clickState.endX = parseFloat(event.target.getAttribute('x')) + this.transform('x') + parseFloat(event.target.getAttribute('width'))/2
          clickState.endY = parseFloat(event.target.getAttribute('y')) + this.transform('y') + parseFloat(event.target.getAttribute('height'))/2
          var startHeader = "M " + clickState.startX + " " + clickState.startY + " "
          var endHeader = "C 100 100 400 100 " + clickState.endX + " " + clickState.endY
          var pathString = startHeader + endHeader
          moduls.group().path(pathString).fill('none').stroke({color: '#f00', width: 1.5})
        }
        clickState.firstClick ? clickState.firstClick = false : clickState.firstClick = true
      }
    })
  }
  
  // jumper will be an svg path
  // need to form this path as a string
  function addJumper(event, svgElem, click) {
    var startX = parseFloat(event.target.getAttribute('x')) + svgElem.transform('x') + parseFloat(event.target.getAttribute('width'))/2
    var startY = parseFloat(event.target.getAttribute('y')) + svgElem.transform('y') + parseFloat(event.target.getAttribute('height'))/2
    var startHeader = "M " + startX + " " + startY
    var endHeader = " C 100 100 400 100 400 200"
    var pathString = startHeader + endHeader
    moduls.group().path(pathString).fill('none').stroke({color: '#f00', width: 1.5})
  }
  
  // event listeners for clicks
  toolbox.on('click', addModul, false);
  document.getElementById('newButton').addEventListener('click', resetWindow, false);
}());
