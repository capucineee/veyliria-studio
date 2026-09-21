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

  /* ---------- Portfolio filter ---------- */
  const filterTabs = document.getElementById("filterTabs");
  const portfolioGrid = document.getElementById("portfolioGrid");

  filterTabs?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;

    filterTabs.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;
    portfolioGrid?.querySelectorAll(".project-card").forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.style.display = match ? "" : "none";
    });
  });

  /* ---------- Project modal ---------- */
  const projectData = {
    "demo-restaurant": {
      category: "Restaurant",
      title: "Site vitrine restaurant",
      location: "Menu en ligne & réservation",
      tone: "tone-1",
      icon: '<path d="M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M6 12v9M14 3c-1.7 0-3 2-3 5s1.3 5 3 5v8"/>',
      description: "Exemple de site vitrine chaleureux pensé pour donner envie de réserver une table. Mise en avant de la carte, de l'ambiance et des horaires d'ouverture, avec un système de réservation simplifié directement accessible depuis la page d'accueil.",
      tags: ["Site vitrine", "Réservation en ligne", "Mobile-first", "Référencement local"]
    },
    "demo-construction": {
      category: "Construction",
      title: "Site vitrine BTP & construction",
      location: "Galerie de chantiers & devis en ligne",
      tone: "tone-3",
      icon: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>',
      description: "Exemple de structure adaptée aux entreprises du bâtiment : nouvelle identité visuelle, galerie de chantiers organisée par type de projet, et formulaire de demande de devis pensé pour générer des prospects qualifiés.",
      tags: ["Refonte de site", "Galerie de chantiers", "Demande de devis", "Design responsive"]
    },
    "demo-beaute": {
      category: "Beauté",
      title: "Site vitrine institut de beauté",
      location: "Prise de rendez-vous en ligne",
      tone: "tone-2",
      icon: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
      description: "Exemple d'univers visuel élégant et épuré pour un institut de beauté, avec présentation des prestations, univers de la marque et prise de rendez-vous en ligne intégrée.",
      tags: ["Site vitrine", "Prise de rendez-vous", "Identité premium", "Optimisé mobile"]
    },
    "demo-artisan": {
      category: "Artisan",
      title: "Site vitrine artisan",
      location: "Galerie de réalisations & contact direct",
      tone: "tone-4",
      icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      description: "Exemple de mise en valeur du savoir-faire artisanal à travers une galerie de réalisations soignée, une page dédiée aux domaines d'expertise, et un formulaire de contact direct pour recevoir des demandes.",
      tags: ["Site vitrine", "Galerie de réalisations", "Formulaire de contact", "Référencement local"]
    }
  };

  const modalOverlay = document.getElementById("modalOverlay");
  const modalCard = document.getElementById("modalCard");

  function openModal(id) {
    const data = projectData[id];
    if (!data || !modalCard || !modalOverlay) return;

    modalCard.innerHTML = `
      <div class="modal-visual ${data.tone}">
        <button class="modal-close" id="modalClose" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div class="shape"></div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${data.icon}</svg>
      </div>
      <div class="modal-body">
        <span class="cat-badge">${data.category}</span>
        <h3>${data.title}</h3>
        <p class="location">${data.location}</p>
        <p>${data.description}</p>
        <div class="modal-tags">
          ${data.tags.map((t) => `<span>${t}</span>`).join("")}
        </div>
        <a href="#contact" class="btn btn-primary btn-block" id="modalCta">Créer un site comme celui-ci</a>
        <p class="modal-disclaimer">Exemple de composant présenté à titre de démonstration du travail de Veyliria Studio — il ne s'agit pas d'un client réel.</p>
      </div>
    `;

    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";

    modalCard.querySelector("#modalClose")?.addEventListener("click", closeModal);
    modalCard.querySelector("#modalCta")?.addEventListener("click", closeModal);
  }

  function closeModal() {
    modalOverlay?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  portfolioGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-modal]");
    if (!btn) return;
    openModal(btn.dataset.openModal);
  });

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById("contactForm");
  const contactFormWrap = document.getElementById("contactFormWrap");
  const formSuccess = document.getElementById("formSuccess");

  function setFieldError(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    field?.classList.toggle("has-error", hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const project = document.getElementById("project");
    const message = document.getElementById("message");

    let valid = true;

    if (!name.value.trim()) {
      setFieldError("field-name", true);
      valid = false;
    } else setFieldError("field-name", false);

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setFieldError("field-email", true);
      valid = false;
    } else setFieldError("field-email", false);

    if (!project.value) {
      setFieldError("field-project", true);
      valid = false;
    } else setFieldError("field-project", false);

    if (!message.value.trim() || message.value.trim().length < 10) {
      setFieldError("field-message", true);
      valid = false;
    } else setFieldError("field-message", false);

    if (!valid) {
      contactForm.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
      return;
    }

    contactFormWrap?.classList.add("is-submitted");
    formSuccess?.classList.add("is-visible");
  });

  /* ---------- Header offset for hash links on load ---------- */
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      target?.scrollIntoView({ behavior: "instant" in window ? "instant" : "auto" });
    }, 0);
  }
})();
