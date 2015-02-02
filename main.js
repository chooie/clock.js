/**
 * Created by chooie on 31/01/2015.
 */
(function() {
  "use strict";
  var canvas = document.getElementById( "drawing" ),
    context;

  canvas.style.border = "3px solid black";
  context = canvas.getContext( "2d" );
  canvas.style.width = "200px";
  canvas.style.height = "200px";

  // Improve the quality for retina display users
  if ( window.devicePixelRatio == 2 ) {
    context.scale( 2, 2 );
  }

  var clock = new Chooie.Clock( canvas );
  clock.drawClock();
})();
