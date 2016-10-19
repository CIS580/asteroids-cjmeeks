module.exports = exports = {
    rotate: rotate,
    dotProduct: dotProduct,
    magnitude: magnitude,
    normalize: normalize
}

//rotates a vector about the z axis
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

//computes the dot product of two vectors
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

//computes the magnitude of a vector
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

//normalizes the vector
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}
