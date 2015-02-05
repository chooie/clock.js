/**
 * Created by chooie on 31/01/2015.
 */
(function() {
  "use strict";
  var canvas = document.getElementById( "drawing" ),
    context,
    clock1,
    clock2,
    clock3,
    clock4;

  canvas.style.border = "3px solid black";
  context = canvas.getContext( "2d" );
  canvas.style.width = "200px";
  canvas.style.height = "200px";

  // Improve the quality for retina display users
  if ( window.devicePixelRatio == 2 ) {
    context.scale( 2, 2 );
  }

  clock1 = new Chooie.Clock( canvas, 100, 100 );
  clock1.drawClock();

  clock2 = new Chooie.Clock(canvas, 300, 100);
  clock2.drawClock();

  clock3 = new Chooie.Clock( canvas, 100, 300 );
  clock3.drawClock();

  clock4 = new Chooie.Clock(canvas, 300, 300);
  clock4.drawClock();
})();
