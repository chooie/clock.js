/**
 * Created by chooie on 31/01/2015.
 */

(function(Chooie) {

  // Shorthand for Chooie.Clock.prototype
  var proto;

  /**
   * The Clock constructor. Clock objects are used to draw clock graphics to
   * a canvas element.
   * @param canvas
   * @constructor
   * @param canvasPosX
   * @param canvasPosY
   * @param options
   */
  Chooie.Clock = function(canvas, canvasPosX, canvasPosY, options) {
    if (!canvas instanceof HTMLCanvasElement) {
      throw new Error("Clock: parameter [0] must be an instance of " +
      "HTMLCanvasElement.");
    }

    if (!canvas.getContext instanceof Function) {
      throw new Error("Clock: canvas element is not supported in the " +
      "current environment.");
    }

    if (typeof canvasPosX !== "number") {
      throw new Error("Clock: parameter [1] must be a number.")
    }

    if (typeof canvasPosY !== "number") {
      throw new Error("Clock: parameter [2] must be a number.")
    }

    if (typeof options !== "undefined" && typeof options !== "object") {
      throw new Error("Clock: optional parameter [3] must be an object.");
    }

    // Scope safe
    if (this instanceof Chooie.Clock) {
      this.context = canvas.getContext("2d");
      this.canvasPosX = canvasPosX;
      this.canvasPosY = canvasPosY;

      // temporary options object if one is not given. Makes optional
      // property assignment a bit cleaner.
      if (!options) {
        options = {};
      }

      // Optional properties
      this.height = options.height || 100;
      this.width = options.width || 100;
      this.borderRadius = options.borderRadius || 99;
      this.borderColour = options.borderColour || "#616161";
      this.faceRadius = options.faceRadius || 94;
      this.faceColour = options.faceColour || "#F5F5F5";
      this.centreDialRadius = options.centreDialRadius || 5;
      this.centreDialColour = options.centreDialColour || "#607D8B";
      this.handsColour = options.handsColour || "#212121";
      this.numbersRadius = options.numbersRadius || 85;
      this.numbersColour = options.numbersColour || "#212121";

      if (typeof this.height !== "number") {
        throw new Error("Clock: height must be a number.")
      }

      if (typeof this.width !== "number") {
        throw new Error("Clock: width must be a number.")
      }

      if (typeof this.borderRadius !== "number") {
        throw new Error("Clock: borderRadius must be a number.")
      }

      if (typeof this.borderColour !== "string") {
        throw new Error("Clock: borderColour must be a string.");
      }

      if (typeof this.faceRadius !== "number") {
        throw new Error("Clock: faceRadius must be a number.")
      }

      if (typeof this.faceColour !== "string") {
        throw new Error("Clock: faceColour must be a string.");
      }

      if (typeof this.centreDialRadius !== "number") {
        throw new Error("Clock: centreDialRadius must be a number.")
      }

      if (typeof this.centreDialColour !== "string") {
        throw new Error("Clock: centreDialColour must be a string.");
      }

      if (typeof this.handsColour !== "string") {
        throw new Error("Clock: centreDialColour must be a string.");
      }

      if (typeof this.numbersRadius !== "number") {
        throw new Error("Clock: numbersRadius must be a number.")
      }

      if (typeof this.numbersColour !== "string") {
        throw new Error("Clock: numbersColour must be a string.");
      }

      if (!( this.centreDialRadius < this.faceRadius &&
        this.faceRadius < this.borderRadius )) {
        throw new Error("Clock: inner faces must not have a greater radius" +
        "than their containing faces radii.");
      }
    } else {
      return new Chooie.Clock(canvas, canvasPosX, canvasPosY, options);
    }
  };

  proto = Chooie.Clock.prototype;

  // Declare constants on prototype
  proto.SECOND_LINE_LENGTH = 85;
  proto.SECOND_LINE_WIDTH = 1;
  proto.MINUTE_LINE_LENGTH = 85;
  proto.MINUTE_LINE_WIDTH = 3;
  proto.HOUR_LINE_LENGTH = 50;
  proto.HOUR_LINE_WIDTH = 5;
  proto.PI = Math.PI;

  /**
   * Fill in all the clock's numbers from 1 to 12.
   */
  proto.fillClockNumbers = function() {
    var ctx = this.context,
      NCR = this.numbersRadius,
      PI = this.PI,
      i,
      posX,
      posY;

    ctx.save();

    // Text styling
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.numbersColour;

    // Draw the numbers from 1 to 12
    for (i = 1; i <= 12; i++) {
      posX = NCR * Math.sin((i / 12) * 2 * PI);
      posY = -NCR * Math.cos((i / 12) * 2 * PI);
      ctx.fillText("" + i, posX, posY);
    }

    ctx.restore();
  };

  /**
   * Draw all the clock hands for the given context.
   */
  proto.drawTimeToCanvas = function() {
    var dateTime = new Date();

    this.context.save();

    // Rotate the context 90 degrees to the left
    this.context.rotate((-90 * this.PI) / 180);

    this.drawSecondHand(dateTime);
    this.drawMinuteHand(dateTime);
    this.drawHourHand(dateTime);

    this.context.restore();
  };

  /**
   * Draw the second hand.
   * @param date
   */
  proto.drawSecondHand = function(date) {
    var secLen = this.SECOND_LINE_LENGTH,
      secsDegrees = (date.getSeconds() / 60) * 2 * this.PI,
      secsPosX = secLen * Math.cos(secsDegrees),
      secsPosY = secLen * Math.sin(secsDegrees);

    this.drawHand(secsPosX, secsPosY, this.SECOND_LINE_WIDTH);
  };

  /**
   * Draw the minute hand.
   * @param date
   */
  proto.drawMinuteHand = function(date) {
    var minLen = this.MINUTE_LINE_LENGTH,
      secsInMinute = 60 * 60,
      minsDegrees = (((date.getMinutes() * 60) + date.getSeconds()) /
        secsInMinute) * 2 * this.PI,
      minsPosX = minLen * Math.cos(minsDegrees),
      minsPosY = minLen * Math.sin(minsDegrees);

    this.drawHand(minsPosX, minsPosY, this.MINUTE_LINE_WIDTH);
  };

  /**
   * Draw the hour hand.
   * @param date
   */
  proto.drawHourHand = function(date) {
    var hourLen = this.HOUR_LINE_LENGTH,
      minutesInHalfADay = 12 * 60,
      hoursDegrees = ((((date.getHours() % 12) * 60) +
        date.getMinutes()) / minutesInHalfADay) * 2 * this.PI,
      hoursPosX = hourLen * Math.cos(hoursDegrees),
      hoursPosY = hourLen * Math.sin(hoursDegrees);

    this.drawHand(hoursPosX, hoursPosY, this.HOUR_LINE_WIDTH);
  };

  /**
   * Draws a clock hand.
   * @param posX
   * @param posY
   * @param lineWidth
   */
  proto.drawHand = function(posX, posY, lineWidth) {
    var ctx = this.context;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = lineWidth;
    ctx.lineTo(posX, posY);
    ctx.strokeStyle = this.handsColour;
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  };

  /**
   * Draw the entire clock and repeat.
   */
  proto.drawClock = function() {
    this.singleDrawClock();
    this.repeatDrawClock();
  };
  /**
   * Draw the entire clock once.
   */
  proto.singleDrawClock = function() {
    var ctx = this.context;

    ctx.save();

    // Beginning of coordinate translation
    // Translate to center.
    ctx.translate(this.canvasPosX, this.canvasPosY);

    // Erase previous context
    ctx.clearRect(0, 0, this.width,
      this.height);

    // Outer face
    this.drawFace(this.borderRadius, this.borderColour);

    // Inner face
    this.drawFace(this.faceRadius, this.faceColour);

    this.fillClockNumbers();

    this.drawTimeToCanvas(ctx);

    // Centre dial face (the circle where the hands come out of)
    this.drawFace(this.centreDialRadius, this.centreDialColour);

    ctx.restore();
  };

  /**
   * Redraws the clock every second (1000ms).
   */
  proto.repeatDrawClock = function() {
    // Note that 'that' is assigned the current 'this' context because
    // 'setTimeout' always executes within the 'window' context
    var that = this;
    setTimeout(function() {
      that.singleDrawClock(this.canvas);
      that.repeatDrawClock();
    }, 1000);
  };

  /**
   * Draw clock face.
   * @param radius
   * @param fillColour
   */
  proto.drawFace = function(radius, fillColour) {
    var ctx = this.context;

    if (typeof radius !== "number") {
      throw new Error("Clock.drawFace(): parameter [0] must be a number.");
    }

    if (typeof fillColour !== "string") {
      throw new Error("Clock.drawFace(): parameter [1] must be a string.");
    }

    ctx.save();

    // Start outer circle path
    ctx.beginPath();

    // Draw circle
    ctx.arc(0, 0, radius, 0, 2 * this.PI, false);

    // Close outer circle path
    ctx.closePath();

    ctx.fillStyle = fillColour;
    ctx.fill();

    // Stroke the path
    ctx.stroke();

    ctx.restore();
  };
})(window.Chooie = window.Chooie || {});
