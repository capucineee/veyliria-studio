(() => {
  "use strict";

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById("progressBar");
  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";

    if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

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

  /* ---------- Demo tabs ---------- */
  const demoTabs = document.querySelectorAll(".demo-tab");
  const demoPanels = document.querySelectorAll(".demo-panel");

  demoTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.demo;

      demoTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });

      demoPanels.forEach((panel) => {
        const isActive = panel.dataset.demoPanel === target;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    });
  });

  /* ---------- Shared form helpers ---------- */
  function setFieldError(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    field?.classList.toggle("has-error", hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function resetDemoForm(form, wrap, success) {
    form?.reset();
    form?.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
    wrap?.classList.remove("is-submitted");
    success?.classList.remove("is-visible");
  }

  // Generic validated-form wiring: reused by the contact section and every demo form.
  function initValidatedForm({ formId, wrapId, successId, resetKey, fields }) {
    const form = document.getElementById(formId);
    const wrap = document.getElementById(wrapId);
    const success = document.getElementById(successId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      fields.forEach(({ inputId, fieldId, validate }) => {
        const input = document.getElementById(inputId);
        const ok = validate ? validate(input.value.trim()) : input.value.trim().length > 0;
        setFieldError(fieldId, !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        form.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
        return;
      }

      wrap?.classList.add("is-submitted");
      success?.classList.add("is-visible");
    });

    if (resetKey) {
      success
        ?.querySelector(`[data-reset-for="${resetKey}"]`)
        ?.addEventListener("click", () => resetDemoForm(form, wrap, success));
    }
  }

  const notEmpty = (v) => v.length > 0;
  const validEmail = (v) => v.length > 0 && isValidEmail(v);

  /* ---------- Main contact form ---------- */
  initValidatedForm({
    formId: "contactForm",
    wrapId: "contactFormWrap",
    successId: "formSuccess",
    fields: [
      { inputId: "name", fieldId: "field-name", validate: notEmpty },
      { inputId: "email", fieldId: "field-email", validate: validEmail },
      { inputId: "project", fieldId: "field-project", validate: notEmpty },
      { inputId: "message", fieldId: "field-message", validate: (v) => v.length >= 10 }
    ]
  });

  /* ---------- Demo: devis en ligne ---------- */
  initValidatedForm({
    formId: "devisForm",
    wrapId: "devisWrap",
    successId: "devisSuccess",
    resetKey: "devis",
    fields: [
      { inputId: "devisName", fieldId: "field-devisName", validate: notEmpty },
      { inputId: "devisEmail", fieldId: "field-devisEmail", validate: validEmail },
      { inputId: "devisType", fieldId: "field-devisType", validate: notEmpty },
      { inputId: "devisBudget", fieldId: "field-devisBudget", validate: notEmpty },
      { inputId: "devisMessage", fieldId: "field-devisMessage", validate: (v) => v.length >= 10 }
    ]
  });

  /* ---------- Demo: prise de contact ---------- */
  initValidatedForm({
    formId: "dcForm",
    wrapId: "dcWrap",
    successId: "dcSuccess",
    resetKey: "dc",
    fields: [
      { inputId: "dcName", fieldId: "field-dcName", validate: notEmpty },
      { inputId: "dcEmail", fieldId: "field-dcEmail", validate: validEmail },
      { inputId: "dcMessage", fieldId: "field-dcMessage", validate: notEmpty }
    ]
  });

  /* ---------- Demo: carrousel photo ---------- */
  (function initCarousel() {
    const carousel = document.getElementById("photoCarousel");
    const track = document.getElementById("carouselTrack");
    const dots = document.querySelectorAll("#carouselDots button");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    if (!carousel || !track) return;

    const slides = Array.from(track.children);
    let index = 0;
    let autoplayId = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() { autoplayId = setInterval(next, 4500); }
    function stopAutoplay() { if (autoplayId) clearInterval(autoplayId); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    nextBtn?.addEventListener("click", () => { next(); restartAutoplay(); });
    prevBtn?.addEventListener("click", () => { prev(); restartAutoplay(); });
    dots.forEach((d, di) => d.addEventListener("click", () => { goTo(di); restartAutoplay(); }));

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { next(); restartAutoplay(); }
      if (e.key === "ArrowLeft") { prev(); restartAutoplay(); }
    });

    let startX = null;
    track.addEventListener("pointerdown", (e) => { startX = e.clientX; stopAutoplay(); });
    track.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
      startX = null;
      startAutoplay();
    });

    startAutoplay();
  })();

  /* ---------- Demo: email automatique ---------- */
  (function initEmailDemo() {
    const form = document.getElementById("edForm");
    const wrap = document.getElementById("edWrap");
    const preview = document.getElementById("emailPreview");
    const previewName = document.getElementById("emailPreviewName");
    const previewTo = document.getElementById("emailPreviewTo");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("edName");
      const emailInput = document.getElementById("edEmail");
      let valid = true;

      if (!nameInput.value.trim()) {
        setFieldError("field-edName", true);
        valid = false;
      } else setFieldError("field-edName", false);

      if (!validEmail(emailInput.value.trim())) {
        setFieldError("field-edEmail", true);
        valid = false;
      } else setFieldError("field-edEmail", false);

      if (!valid) {
        form.querySelector(".has-error input")?.focus();
        return;
      }

      if (previewName) previewName.textContent = nameInput.value.trim().split(" ")[0];
      if (previewTo) previewTo.textContent = emailInput.value.trim();
      wrap?.classList.add("is-submitted");
      preview?.classList.add("is-visible");
    });

    preview?.querySelector('[data-reset-for="ed"]')?.addEventListener("click", () => {
      resetDemoForm(form, wrap, preview);
    });
  })();

  /* ---------- Header offset for hash links on load ---------- */
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      target?.scrollIntoView({ behavior: "instant" in window ? "instant" : "auto" });
    }, 0);
  }
})();
