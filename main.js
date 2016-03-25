(function() {
  // create the outermost SVG element and add a border to it
  var draw = new SVG('frame').size("100%", 300);
  var border = draw.rect("100%", 300).attr({
    fill: '#fff',
    stroke: '#000',
    'stroke-width': '2px'
  });

  // create an pannable zoomable object group which will contain each modul
  var objects = draw.group();
  objects.panZoom({
    zoomSpeed: -7,
    zoom: [1, 3]
  });

  // add a test modul and container g element and make it draggable
  objects.group().draggable().svg(tempmodul);
  // add a modul using transform method to set initial position
  objects.group().draggable().transform({x: 50, y:50}).svg(tempmodul);

  // TODO: write a function that takes a modul and adds it at a given position

}());
