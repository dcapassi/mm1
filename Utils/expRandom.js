function expRandom(reference) {
  function f(x) {
    return reference * Math.exp(-reference * x);
  }
  function g(x) {
    return Math.random(x);
  }
  let n = 100;

  for (let i = 0; i < n; i++) {
    x = Math.random();
    if (f(x) / g(x) > Math.random()) {
      return x;
    }
  }
}
