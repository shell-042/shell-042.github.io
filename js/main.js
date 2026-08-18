/* ============================================================
   交互脚本 / main.js
   ------------------------------------------------------------
   1. 导航：滚动高亮当前板块
   2. 入场动画：IntersectionObserver 触发 [data-reveal]
   3. 作品集筛选：点击 chip 过滤 .case
   4. 作品集图集轮播：每个案例封面内的图片轮播
   纯原生 JS，无依赖。改交互逻辑在这里。
   ============================================================ */
(function () {
  "use strict";

  /* ───── 1. 导航当前板块高亮 ───── */
  const navLinks = document.querySelectorAll(".nav__menu a");
  const sections = [...navLinks]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((a) =>
              a.classList.toggle(
                "is-current",
                a.getAttribute("href") === "#" + id
              )
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navObs.observe(s));
  }

  /* ───── 2. 入场动画：给主要块挂 [data-reveal] ───── */
  const revealTargets = document.querySelectorAll(
    ".section__head, .about__lead, .about__bio, .about__tags, " +
      ".timeline__item, .skills__card, .case, .impact__item, " +
      ".media-card, .media__logos, .media__credits, .contact__slots, " +
      ".hero__portrait"
  );
  revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

  if ("IntersectionObserver" in window) {
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => revObs.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ───── 3. 作品集筛选 ───── */
  const chips = document.querySelectorAll(".chip[data-filter]");
  const cases = document.querySelectorAll(".case");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter");
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      cases.forEach((card) => {
        const cat = card.getAttribute("data-cat") || "";
        const show = filter === "all" || cat.split(" ").includes(filter);
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ───── 4. 作品集图集轮播 ───── */
  (function initCarousels() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-carousel]").forEach((root) => {
      const track = root.querySelector(".case__track");
      const slides = root.querySelectorAll(".case__slide");
      const dotsWrap = root.querySelector(".case__dots");
      const n = slides.length;
      root.setAttribute("data-count", String(n));
      if (n <= 1) return;

      /* 轮播框比例已静态写在 CSS（.case__cover 默认 16/9；思必驰 --ar-1414；云清 --ar-32）。
         不再等图片 decode 后注入 aspect-ratio，从根上消除「滚动到最后一张时框体突变位移」的 bug */

      let idx = 0;
      let timer = null;
      let inView = false;
      const dots = [];

      slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "case__dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", "第 " + (i + 1) + " 张");
        d.addEventListener("click", () => go(i));
        dotsWrap.appendChild(d);
        dots.push(d);
      });

      function go(i) {
        idx = (i + n) % n;
        track.style.transform = "translateX(-" + idx * 100 + "%)";
        dots.forEach((d, k) => d.classList.toggle("is-active", k === idx));
      }
      function play() {
        if (reduce || !inView || timer) return;
        timer = setInterval(() => go(idx + 1), 5000);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      root.querySelector(".case__arrow--next").addEventListener("click", () => go(idx + 1));
      root.querySelector(".case__arrow--prev").addEventListener("click", () => go(idx - 1));

      root.setAttribute("tabindex", "0");
      root.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") go(idx + 1);
        else if (e.key === "ArrowLeft") go(idx - 1);
      });
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", () => { if (inView) play(); });

      let sx = 0;
      root.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; stop(); }, { passive: true });
      root.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        play();
      }, { passive: true });

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { inView = en.isIntersecting; inView ? play() : stop(); });
        }, { threshold: 0.3 });
        io.observe(root);
      } else {
        inView = true; play();
      }
    });
  })();
})();
