document.getElementById("year").textContent = new Date().getFullYear();

// sample demo numbers that gently change so the page looks “alive”
let L = 5.2, R = 4.9;
setInterval(() => {
  L += (Math.random() - 0.5) * 0.05;
  R += (Math.random() - 0.5) * 0.05;
  const T = L + R;

  document.getElementById("left").textContent = L.toFixed(2);
  document.getElementById("right").textContent = R.toFixed(2);
  document.getElementById("total").textContent = T.toFixed(2);
}, 700);
