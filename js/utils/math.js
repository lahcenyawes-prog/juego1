export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function distance(x1, x2) {
  return Math.abs(x1 - x2);
}

export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}
