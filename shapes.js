(function( global ){
  "use strict";

  var Shape = {};

  function BaseShape() {
    // ..
  }
  BaseShape.prototype.constructor = BaseShape;

  function OShape() {
    // ..
  }
  OShape.prototype = new BaseShape();
  OShape.prototype.constructor = OShape;

  Shape.O = OShape;

  global.Shape = Shape;

}( window ));
