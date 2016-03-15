if (SVG.supported) {
  main();
} else {
  alert('SVG not supported by browser');
}

function main() {
  let draw = SVG('frame').size(800,500);
  let rect = draw.rect(100, 100).attr({fill: '#f06'});
}

