(() => {
  "use strict";

  /* ---------- Header scroll state + back to top ---------- */
  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrollTop = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    navToggle?.classList.remove("is-active");
    mobileNav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", !!isOpen);
    navToggle.setAttribute("aria-expanded", String(!!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
