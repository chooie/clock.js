/**
 * Created by chooie on 31/01/2015.
 */
(function() {
  "use strict";
  var canvas = document.getElementById("drawing"),
    context,
    clock1,
    clock2,
    clock3,
    clock4;

  canvas.style.border = "3px solid black";
  context = canvas.getContext("2d");
  canvas.style.width = "200px";
  canvas.style.height = "200px";

  // Improve the quality for retina display users
  if (window.devicePixelRatio == 2) {
    context.scale(2, 2);
  }

  clock1 = new Chooie.Clock(canvas, 100, 100);
  clock1.drawClock();

  clock2 = new Chooie.Clock(canvas, 300, 100, {
    borderColour: "#212121",
    faceColour: "#455A64",
    centreDialColour: "#03A9F4",
    numbersColour: "#FFFFFF"
  });

  clock2.drawClock();

  clock3 = new Chooie.Clock(canvas, 100, 300, {
    borderColour: "#FF5722",
    faceColour: "#03A9F4",
    centreDialColour: "#B6B6B6",
    numbersColour: "#FFFFFF"
  });
  clock3.drawClock();

  clock4 = new Chooie.Clock(canvas, 300, 300, {
    borderColour: "#5D4037",
    faceColour: "#D7CCC8",
    centreDialColour: "#FFC107",
    numbersColour: "#212121"
  });
  clock4.drawClock();
})();
