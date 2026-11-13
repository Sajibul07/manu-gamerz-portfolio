(function () {
  var $ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };
  document.getElementById("yr").textContent = new Date().getFullYear();

  // mobile menu
  var menu = document.getElementById("menu"),
    links = document.getElementById("links");
  menu.addEventListener("click", function () {
    var o = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", o);
  });
  $("a", links).forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      menu.setAttribute("aria-expanded", false);
    });
  });

  // typing effect
  var words = [
      "Discord Developer",
      "Video Editor",
      "Thumbnail Maker",
      "Minecraft Server Manager",
    ],
    wi = 0,
    ci = 0,
    del = false,
    t = document.getElementById("type");
  function tick() {
    var w = words[wi];
    ci += del ? -1 : 1;
    t.textContent = "> " + w.slice(0, ci);
    var d = del ? 45 : 90;
    if (!del && ci === w.length) {
      del = true;
      d = 1400;
    } else if (del && ci === 0) {
      del = false;
      wi = (wi + 1) % words.length;
      d = 300;
    }
    setTimeout(tick, d);
  }
  tick();

  // XP scroll bar + active link
  var xp = document.getElementById("xp"),
    secs = $("main section"),
    nav = $("a", links);
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    xp.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    var cur = secs[0].id;
    secs.forEach(function (s) {
      if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id;
    });
    nav.forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("href") === "#" + cur);
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal, bars, counters
  function count(el) {
    var n = +el.dataset.n,
      s = null;
    (function f(ts) {
      s = s || ts;
      var p = Math.min((ts - s) / 1200, 1);
      el.textContent = Math.round(n * p) + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(f);
    })(performance.now());
  }
  function show(el) {
    el.classList.add("in");
    $("[data-w]", el).forEach(function (b) {
      b.style.width = b.dataset.w + "%";
    });
    $("[data-n]", el).forEach(count);
  }
  $("[data-w]").forEach(function (b) {
    if (!b.closest(".rv"))
      setTimeout(function () {
        b.style.width = b.dataset.w + "%";
      }, 400);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    $(".rv").forEach(function (el) {
      io.observe(el);
    });
  } else {
    $(".rv").forEach(show);
  }

  // card tilt (pointer devices only)
  if (
    matchMedia("(hover:hover)").matches &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    $("[data-tilt]").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform =
          "perspective(800px) rotateY(" +
          x * 10 +
          "deg) rotateX(" +
          -y * 10 +
          "deg) translateY(-4px)";
      });
      c.addEventListener("pointerleave", function () {
        c.style.transform = "";
      });
    });
  }
  // thumbnail popup
  var lb = document.getElementById("lb"),
    lbimg = document.getElementById("lbimg");
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  $(".thumb").forEach(function (b) {
    b.addEventListener("click", function () {
      var img = b.querySelector("img");
      lbimg.src = b.dataset.full || img.src;
      lbimg.alt = img.alt;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  document.getElementById("lbx").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLb();
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });
})();
