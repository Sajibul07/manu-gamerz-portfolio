(function () {
  var HOME = "index.html"; // home page ka path (hosting par '/' bhi kar sakte ho)
  var TOTAL = 10; // seconds

  var text = document.getElementById("rtext");
  var state = document.getElementById("rstate");
  var bar = document.getElementById("rbar");
  var pauseBtn = document.getElementById("pause");
  var go = document.getElementById("go");

  document.getElementById("yr").textContent = new Date().getFullYear();
  go.setAttribute("href", HOME);

  var left = TOTAL;
  var paused = false;
  var timer = null;

  function render() {
    text.textContent = "RESPAWN IN " + left;
    bar.style.width = ((TOTAL - left) / TOTAL) * 100 + "%";
  }

  function tick() {
    if (paused) return;
    left -= 1;
    render();
    if (left <= 0) {
      clearInterval(timer);
      window.location.href = HOME;
    }
  }

  pauseBtn.addEventListener("click", function () {
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", paused);
    pauseBtn.textContent = paused ? "Resume timer" : "Pause timer";
    state.textContent = paused ? "PAUSED" : "AUTO";
  });

  render();
  timer = setInterval(tick, 1000);
})();
