"use strict";

(function () {
  // create the outermost SVG element and add a border to it
  let draw = new SVG('frame').size('100%', 500)
  let border = draw.rect('100%', 500).attr({
    fill: '#fff',
    stroke: '#000',
    'stroke-width': '3px'
  })
  let modulsGroup = draw.group()
  modulsGroup.panZoom({
    zoomSpeed: -1,
    zoom: [1, 4]
  })
  let toolbox = makeToolbox()
  let clickState = {
    target: null,
    firstClick: true,
    startX: null,
    startY: null,
    endX: null,
    endY: null
  }
  function resetWindow() {
    if (modulsGroup) {
      modulsGroup.each(function (i, children) {
        this.remove()
      })
    }
    modulsGroup
      .transform({ scale: 1 }).transform({ x: 0 }).transform({ y: 0 })
  }
  function makeToolbox() {
    let ui = draw.group()
    ui.rect('15%', 350)
      .move('83%', '13%')
      .radius(10)
      .attr({
        fill: '#19C3FF'
      })
      .id('uiBox')
      // drop shadow
      .filter(function (add) {
        let blur = add.offset(2, 2).in(add.sourceAlpha).gaussianBlur(4)
        add.blend(add.source, blur)
        this.size('175%', '175%').move('-50%', '-50%')
      })
    return ui
  }
  function addModul() {
    // TODO: this would likely be better implemented with use()
    let modul = modulsGroup.group().draggable().svg(tempmodul) // adds the tempmodul   
    modul.connections = {}
    modul.click(function (event) {
      if (event.target.className.baseVal == "header") { // handles adding a new jumper
        if (clickState.firstClick) {
          clickState.target = this
          clickState.startHeaderX = parseFloat(event.target.getAttribute('x')) + parseFloat(event.target.getAttribute('width')) / 2
          clickState.startHeaderY = parseFloat(event.target.getAttribute('y')) + parseFloat(event.target.getAttribute('height')) / 2
          clickState.startX = clickState.startHeaderX + this.transform('x')
          clickState.startY = clickState.startHeaderY + this.transform('y')
          clickState.firstClick = false
        } else if (clickState.target == this) { // prevents adding a jumper when the same board is clicked twice
          clickState.startX = parseFloat(event.target.getAttribute('x')) + this.transform('x') + parseFloat(event.target.getAttribute('width')) / 2
          clickState.startY = parseFloat(event.target.getAttribute('y')) + this.transform('y') + parseFloat(event.target.getAttribute('height')) / 2
        } else { // second click is on a header that is on a different board
          clickState.endHeaderX = parseFloat(event.target.getAttribute('x')) + parseFloat(event.target.getAttribute('width')) / 2
          clickState.endHeaderY = parseFloat(event.target.getAttribute('y')) + parseFloat(event.target.getAttribute('height')) / 2
          clickState.endX = clickState.endHeaderX + this.transform('x')
          clickState.endY = clickState.endHeaderY + this.transform('y')
          let controlPoint = {
            x: ((clickState.startX + clickState.endX) / 2),
            y: (((clickState.startY + clickState.endY) / 2) + Math.abs(clickState.startY - clickState.endY))
          }
          let startHeader = "M " + clickState.startX + " " + clickState.startY + " "
          let endHeader = "Q " + controlPoint.x + " " + controlPoint.y + " " + clickState.endX + " " + clickState.endY
          let pathString = startHeader + endHeader
          let jumper = modulsGroup.group().path(pathString).fill('none').stroke({ color: '#f00', width: 1.5 })
          modul.connections[jumper.id()] = { // add the connection to the end point modul
            connected: true,
            firstPoint: false,
            startHeaderX: clickState.startHeaderX,
            startHeaderY: clickState.startHeaderY,
            endHeaderX: clickState.endHeaderX,
            endHeaderY: clickState.endHeaderY
          }
          clickState.target.connections[jumper.id()] = { // add the connection to the start point modul
            connected: true,
            firstPoint: true,
            startHeaderX: clickState.startHeaderX,
            startHeaderY: clickState.startHeaderY,
            endHeaderX: clickState.endHeaderX,
            endHeaderY: clickState.endHeaderY
          }
          clickState.firstClick = true
        }
      }
    })
    modul.on('dragmove', function () {
      self = this
      Object.keys(self.connections).forEach(function (key, index, array) {
        let updatedPath = ""
        if (self.connections[key].firstPoint) {
          // update the first point and control point
          let sX = self.connections[key].startHeaderX + self.transform('x')
          let sY = self.connections[key].startHeaderY + self.transform('y')
          let eX = SVG.get(key).array().value[1][3]
          let eY = SVG.get(key).array().value[1][4]
          let cX = (sX + eX) / 2
          let cY = ((sY + eY) / 2) + Math.abs(sY - eY)
          updatedPath = "M " + sX + " " + sY + " Q " + cX + " " + cY + " " + eX + " " + eY
        } else {
          // update the second point and control point
          let eX = self.connections[key].endHeaderX + self.transform('x')
          let eY = self.connections[key].endHeaderY + self.transform('y')
          let sX = SVG.get(key).array().value[0][1]
          let sY = SVG.get(key).array().value[0][2]
          let cX = (sX + eX) / 2
          let cY = ((sY + eY) / 2) + Math.abs(sY - eY)
          updatedPath = "M " + sX + " " + sY + " Q " + cX + " " + cY + " " + eX + " " + eY
        }
        SVG.get(key).plot(updatedPath)
      })
    })
  }
  // jumper will be an svg path
  // need to form this path as a string
  function addJumper(event, svgElem, click) {
    let startX = parseFloat(event.target.getAttribute('x')) + svgElem.transform('x') + parseFloat(event.target.getAttribute('width')) / 2
    let startY = parseFloat(event.target.getAttribute('y')) + svgElem.transform('y') + parseFloat(event.target.getAttribute('height')) / 2
    let startHeader = "M " + startX + " " + startY
    let endHeader = " C 100 100 400 100 400 200"
    let pathString = startHeader + endHeader
    modulsGroup.group().path(pathString).fill('none').stroke({ color: '#f00', width: 1.5 })
  }
  // event listeners for clicks
  toolbox.on('click', addModul, false)
  document.getElementById('newButton').addEventListener('click', resetWindow, false)
} ());
