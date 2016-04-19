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

  // create an pannable zoomable object group which will contain all moduls
  function makeModulsGroup() {
    var moduls = draw.group();
    moduls.panZoom({
      zoomSpeed: -7,
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
    var modul = moduls.group().draggable().svg(tempmodul);
    
    modul.node.addEventListener('click', function(event) {
      console.log(event.target)}, false)
  }
  
  // event listeners for clicks
  toolbox.node.addEventListener('click', addModul, false);
  document.getElementById('newButton').addEventListener('click', resetWindow, false);
}());
