(function() {
  let draw = SVG('frame').size(600,500);
  let tempgroup = draw.group().svg(tempmodul);
  document.getElementById("SvgjsG1007").addEventListener("drag", function(event) {
    console.log(event.target);
    x = event.clientX;
    y = event.clientY;
    console.log(x);
  }, false);
}
)();
