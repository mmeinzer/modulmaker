(function() {
  var draw = new SVG('frame').size("100%", 300);
  var border = draw.rect("100%", 300).attr({
    fill: '#fff',
    stroke: '#000',
    'stroke-width': '2px'
  });
  var objects = draw.group();
  objects.panZoom({
    zoomSpeed: -5,
    zoom: [1, 3]
  });

  var tempgroup = objects.svg(tempmodul).draggable();

}());
