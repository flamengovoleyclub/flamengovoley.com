/**
 * SCRIPT PRINCIPAL DE INTERACCIÓN Y CONVERSIÓN — FLAMENGO VOLEIBOL
 * Bogotá, Colombia
 * WhatsApp Oficial: 3025145457
 * Sede: Parque Carvajal (Calle 34 Sur # 69C - 60)
 */

document.addEventListener("DOMContentLoaded", () => {
  initDynamicContent();
  initNavbar();
  initGroupFilters();
  initTrialForm();
  initFaqAccordion();
  initModals();
  initAnalyticsEvents();

  window.addEventListener("flamengo_config_updated", () => {
    initDynamicContent();
    renderGroupsDynamic();
  });
});

/**
 * Genera el saludo según la hora del día en Bogotá
 */
function getGreetingByHour() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Buenos días";
  } else if (hour >= 12 && hour < 18) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
}

/**
 * Carga e inyecta la configuración en los elementos del DOM correspondientes
 */
function initDynamicContent() {
  const config = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
  if (!config) return;

  // Actualizar textos generales con data-bind
  document.querySelectorAll("[data-bind]").forEach(el => {
    const key = el.getAttribute("data-bind");
    const val = getNestedValue(config, key);
    if (val !== undefined && val !== null) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Saludo dinámico según la hora
  const greeting = getGreetingByHour();
  const defaultWaMessage = `Hola, ¿qué tal? Quisiera reservar una clase de cortesía`;

  const waClean = (config.general?.whatsapp || "573025145457").replace(/\D/g, "");
  const cleanNum = waClean.startsWith("57") ? waClean : ("57" + waClean);
  const baseWaUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(defaultWaMessage)}`;

  document.querySelectorAll(".dynamic-whatsapp-link").forEach(a => {
    a.href = baseWaUrl;
  });

  // Botón directo "Reservar Mi Clase de Cortesía" en el Hero Card
  document.querySelectorAll(".btn-cortesia-direct, #hero-btn-cortesia-direct").forEach(btn => {
    btn.href = baseWaUrl;
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
    btn.onclick = (e) => {
      e.preventDefault();
      const message = `Hola, ¿qué tal? Quisiera reservar una clase de cortesía`;
      const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
      window.FlamengoStorage?.trackEvent("click_cortesia_direct", { location: "hero_card_direct" });
      window.open(url, "_blank") || (window.location.href = url);
    };
  });

  // Botón de Inscripción Oficial a WhatsApp
  document.querySelectorAll(".btn-whatsapp-inscripcion, #btn-plan-inscripcion").forEach(btn => {
    const msgInscripcion = `Hola, ¿qué tal? ${greeting}, escribo porque quiero solicitar información sobre la inscripción y saber si puedo agendar una clase de cortesía en Flamengo Voleibol.`;
    const waInscripcionUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msgInscripcion)}`;
    btn.href = waInscripcionUrl;
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
    btn.onclick = (e) => {
      e.preventDefault();
      const greetingNow = getGreetingByHour();
      const currentMsg = `Hola, ¿qué tal? ${greetingNow}, escribo porque quiero solicitar información sobre la inscripción y saber si puedo agendar una clase de cortesía en Flamengo Voleibol.`;
      const finalUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(currentMsg)}`;
      window.FlamengoStorage?.trackEvent("click_inscripcion_whatsapp", { location: "plan_inscripcion" });
      window.open(finalUrl, "_blank") || (window.location.href = finalUrl);
    };
  });

  // Control de visibilidad de entrenadores
  const showCoaches = config.general?.showCoaches === true;
  document.querySelectorAll(".detail-row-coach").forEach(el => {
    el.style.display = showCoaches ? "flex" : "none";
  });
  const secEntrenadores = document.getElementById("entrenadores");
  if (secEntrenadores) {
    secEntrenadores.style.display = showCoaches ? "block" : "none";
  }
  document.querySelectorAll("a[href='#entrenadores'], a[href='entrenadores.html']").forEach(el => {
    el.style.display = showCoaches ? "" : "none";
  });

  document.querySelectorAll(".dynamic-whatsapp-display").forEach(el => {
    el.textContent = config.general?.whatsappDisplay || config.general?.whatsapp || "302 514 5457";
  });

  document.querySelectorAll(".dynamic-instagram-link").forEach(a => {
    a.href = config.general?.instagram || "https://www.instagram.com/flamengovoley/";
  });

  document.querySelectorAll(".dynamic-maps-link").forEach(a => {
    a.href = config.general?.mapsUrl || "https://www.google.com/maps/dir/4.603904,-74.1376/Flamengo+voley,+Cl.+34+Sur+%2369C-60,+Bogot%C3%A1/@4.6082248,-74.1435085,16z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x8e3f9f0bd5f49319:0x283ce19a9d6d62dd!2m2!1d-74.138982!2d4.613895?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D";
  });

  document.querySelectorAll(".dynamic-reviews-link").forEach(a => {
    a.href = config.general?.googleReviewUrl || "https://g.page/r/Cd1ibZ2a4TwoEAE/review";
  });
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
}

/**
 * Renderiza los grupos dinámicamente si fueron modificados en el admin
 */
function renderGroupsDynamic() {
  const container = document.getElementById("groups-container");
  const config = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
  if (!container || !config || !config.groups) return;

  const showCoaches = config.general?.showCoaches === true;

  container.innerHTML = config.groups.map(group => `
    <article class="group-card featured" data-category="${group.slug || 'general'}">
      <div class="group-card-header">
        <span class="group-badge">${escapeHtml(group.tag || 'Categoría Oficial')}</span>
        <h3 class="group-name">${escapeHtml(group.name)}</h3>
        <p class="group-desc">${escapeHtml(group.description)}</p>
      </div>

      <div class="group-details-list">
        <div class="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="detail-label">Edad:</span>
          <span class="detail-value">${escapeHtml(group.age)}</span>
        </div>
        <div class="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="detail-label">Nivel:</span>
          <span class="detail-value">${escapeHtml(group.level)}</span>
        </div>
        <div class="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="detail-label">Días:</span>
          <span class="detail-value">${escapeHtml(group.days)}</span>
        </div>
        <div class="detail-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="detail-label">Sede:</span>
          <span class="detail-value">${escapeHtml(group.location)}</span>
        </div>
        ${showCoaches ? `
        <div class="detail-row detail-row-coach">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <span class="detail-label">Profesores:</span>
          <span class="detail-value">${escapeHtml(group.coach)}</span>
        </div>
        ` : ''}
      </div>

      <div class="group-pricing-row">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Planes</span>
          <span class="price-tag" style="font-size: 1.15rem;">${escapeHtml(group.price)}</span>
        </div>
        <span class="spots-tag">${escapeHtml(group.spots || 'Cupos Disponibles')}</span>
      </div>

      <button type="button" class="btn btn-primary btn-block btn-select-group" data-group-name="${escapeHtml(group.name)}">
        RESERVAR CLASE DE CORTESÍA
      </button>
    </article>
  `).join("");

  initGroupFilters();
}

/**
 * Inicializa navbar y drawer móvil
 */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const toggleBtn = document.querySelector(".navbar-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-drawer .nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  }, { passive: true });

  toggleBtn?.addEventListener("click", () => {
    const isOpen = drawer?.classList.toggle("open");
    toggleBtn.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawer?.classList.remove("open");
      toggleBtn?.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/**
 * Filtro interactivo de tarjetas de grupos
 */
function initGroupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const groupCards = document.querySelectorAll(".group-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      groupCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue || category?.includes(filterValue)) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.3s ease";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll(".btn-select-group").forEach(btn => {
    btn.addEventListener("click", () => {
      const groupName = btn.getAttribute("data-group-name");
      const categorySelect = document.getElementById("trial-category");
      if (categorySelect && groupName) {
        for (let i = 0; i < categorySelect.options.length; i++) {
          if (categorySelect.options[i].text.toLowerCase().includes(groupName.toLowerCase()) || 
              categorySelect.options[i].value.toLowerCase().includes(groupName.toLowerCase())) {
            categorySelect.selectedIndex = i;
            break;
          }
        }
      }

      const trialSection = document.getElementById("entrenamiento-prueba");
      if (trialSection) {
        trialSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          document.getElementById("trial-name")?.focus();
        }, 600);
      }
    });
  });
}

/**
 * Formulario de Clase de Cortesía y WhatsApp Directo
 */
function initTrialForm() {
  const form = document.getElementById("form-trial-workout");
  if (!form) return;

  const nameInput = document.getElementById("trial-name");
  const ageInput = document.getElementById("trial-age");
  const phoneInput = document.getElementById("trial-phone");
  const categorySelect = document.getElementById("trial-category");
  const experienceSelect = document.getElementById("trial-experience");
  const availabilitySelect = document.getElementById("trial-availability");
  const messageInput = document.getElementById("trial-message");

  // 1. Filtrado en tiempo real: Solo letras y espacios para el nombre
  nameInput?.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

  // 2. Filtrado en tiempo real: Solo números para la edad
  ageInput?.addEventListener("input", () => {
    ageInput.value = ageInput.value.replace(/\D/g, "").slice(0, 2);
  });

  // 3. Filtrado en tiempo real: Solo números para el teléfono
  phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });

  function processAndSendTrial(e) {
    if (e) e.preventDefault();

    const name = nameInput?.value.trim() || "";
    const ageStr = ageInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const category = categorySelect?.value || "";
    const experience = experienceSelect?.value || "Iniciación";
    const availability = availabilitySelect?.value || "Plan 12 Sesiones ($75.000 / mes)";
    const message = messageInput?.value.trim() || "";

    // Validaciones estrictas
    if (!name || name.length < 2) {
      alert("Por favor ingresa tu nombre completo (solo letras).");
      nameInput?.focus();
      return false;
    }

    const ageNum = parseInt(ageStr, 10);
    if (isNaN(ageNum) || ageNum < 8 || ageNum > 25) {
      alert("La edad debe ser un número entre 8 y 25 años.");
      ageInput?.focus();
      return false;
    }

    if (!phone || phone.length < 7) {
      alert("Por favor ingresa tu número de WhatsApp (solo números).");
      phoneInput?.focus();
      return false;
    }

    if (!category) {
      alert("Por favor selecciona una categoría de interés (Masculina Menores o Femenino Infantil).");
      categorySelect?.focus();
      return false;
    }

    // 1. Guardar Lead en LocalStorage
    const leadData = {
      name,
      age: ageNum,
      phone,
      category,
      experience,
      availability,
      message
    };

    if (window.FlamengoStorage) {
      window.FlamengoStorage.saveTrialLead(leadData);
    }

    // 2. Construir mensaje de WhatsApp
    const config = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
    const waNumber = (config.general?.whatsapp || "573025145457").replace(/\D/g, "");
    const greeting = getGreetingByHour();

    const waText = 
`Hola, ¿qué tal? ${greeting}, escribo porque quiero reservar una clase de cortesía en Flamengo Voleibol (Parque Carvajal).

*Mis Datos:*
• *Nombre:* ${name}
• *Edad:* ${ageNum} años
• *WhatsApp:* ${phone}
• *Categoría:* ${category}
• *Nivel:* ${experience}
• *Plan de Interés:* ${availability}
${message ? `• *Mensaje:* ${message}` : ""}`;

    const cleanNum = waNumber.startsWith("57") ? waNumber : ("57" + waNumber);
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(waText)}`;

    // 3. Abrir WhatsApp de forma garantizada
    window.open(whatsappUrl, "_blank") || (window.location.href = whatsappUrl);

    form.reset();
    return true;
  }

  form.addEventListener("submit", processAndSendTrial);

  const submitBtn = form.querySelector("button[type='submit']");
  if (submitBtn) {
    submitBtn.addEventListener("click", processAndSendTrial);
  }
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    questionBtn?.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove("active");
      });
      item.classList.toggle("active", !isActive);
    });
  });
}

function initModals() {
  const modals = document.querySelectorAll(".modal-backdrop");
  const closeBtns = document.querySelectorAll(".modal-close-btn, .modal-close-action");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modals.forEach(m => m.classList.remove("active"));
      document.body.style.overflow = "";
    });
  });

  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });
}

function initAnalyticsEvents() {
  document.querySelectorAll(".btn-track-entrenar").forEach(btn => {
    btn.addEventListener("click", () => {
      window.FlamengoStorage?.trackEvent("click_quiero_entrenar", {
        location: btn.getAttribute("data-location") || "general"
      });
    });
  });

  document.querySelectorAll(".dynamic-whatsapp-link, .floating-whatsapp").forEach(btn => {
    btn.addEventListener("click", () => {
      window.FlamengoStorage?.trackEvent("click_whatsapp", {
        type: "direct_chat"
      });
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
