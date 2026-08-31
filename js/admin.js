/**
 * CONTROLADOR DEL PANEL DE ADMINISTRACIÓN — FLAMENGO VOLEIBOL
 * Bogotá, Colombia
 * Edición en vivo, gestión de grupos, planes, entrenadores, leads y respaldos.
 */

let currentConfig = null;

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initTabs();
  loadConfigToForms();
  renderLeadsTable();
  initEventListeners();

  // Escuchar nuevos leads en tiempo real entre pestañas
  window.addEventListener("storage", (e) => {
    if (e.key === "flamengo_trial_leads_v1") {
      renderLeadsTable();
    }
  });

  window.addEventListener("flamengo_lead_created", () => {
    renderLeadsTable();
  });
});

/**
 * Control de Acceso por PIN
 */
function initAuth() {
  const lockScreen = document.getElementById("admin-lock-screen");
  const pinInput = document.getElementById("admin-pin-input");
  const pinForm = document.getElementById("admin-pin-form");
  const pinError = document.getElementById("admin-pin-error");

  const config = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
  const validPin = config.general.adminPin || "flamengo2026";

  if (window.FlamengoStorage && window.FlamengoStorage.checkAdminAuth()) {
    if (lockScreen) lockScreen.style.display = "none";
  }

  pinForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredPin = pinInput?.value.trim();
    if (enteredPin === validPin) {
      window.FlamengoStorage?.setAdminAuth(true);
      if (lockScreen) lockScreen.style.display = "none";
      showToast("¡Acceso concedido al panel!");
    } else {
      if (pinError) pinError.style.display = "block";
      if (pinInput) {
        pinInput.value = "";
        pinInput.focus();
      }
    }
  });

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    window.FlamengoStorage?.setAdminAuth(false);
    window.location.reload();
  });
}

/**
 * Navegación por pestañas del panel
 */
function initTabs() {
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add("active");

      if (targetTab === "leads") {
        renderLeadsTable();
      }
    });
  });
}

/**
 * Carga la configuración actual en los formularios
 */
function loadConfigToForms() {
  currentConfig = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
  if (!currentConfig) currentConfig = window.DEFAULT_FLAMENGO_CONFIG;

  // 1. Información General
  setVal("admin-club-name", currentConfig.general?.clubName);
  setVal("admin-tagline", currentConfig.general?.tagline);
  setVal("admin-whatsapp", currentConfig.general?.whatsapp);
  setVal("admin-whatsapp-display", currentConfig.general?.whatsappDisplay);
  setVal("admin-instagram", currentConfig.general?.instagram);
  setVal("admin-email", currentConfig.general?.email);
  setVal("admin-address", currentConfig.general?.address);
  setVal("admin-locality", currentConfig.general?.locality);
  setVal("admin-maps-url", currentConfig.general?.mapsUrl);
  setVal("admin-registration-fee", currentConfig.general?.registrationFee);
  setVal("admin-pin", currentConfig.general?.adminPin);
  
  const showCoachesEl = document.getElementById("admin-show-coaches");
  if (showCoachesEl) {
    showCoachesEl.checked = currentConfig.general?.showCoaches === true;
  }

  // 2. Hero Section
  setVal("admin-hero-badge", currentConfig.hero?.badge);
  setVal("admin-hero-title", currentConfig.hero?.titlePrimary);
  setVal("admin-hero-subtitle", currentConfig.hero?.subtitle);
  setVal("admin-hero-cta1", currentConfig.hero?.ctaPrimaryText);
  setVal("admin-hero-cta2", currentConfig.hero?.ctaSecondaryText);
  setVal("admin-hero-trust1", currentConfig.hero?.trustItem1);
  setVal("admin-hero-trust2", currentConfig.hero?.trustItem2);
  setVal("admin-hero-trust3", currentConfig.hero?.trustItem3);

  // 3. Renderizar listas
  renderGroupsAdminList();
  renderPlansAdminList();
  renderCoachesAdminList();
  renderFaqAdminList();
  renderFixturesAdmin();
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/**
 * Renderiza y gestiona la lista de Grupos en el Admin
 */
function renderGroupsAdminList() {
  const container = document.getElementById("admin-groups-container");
  if (!container) return;

  if (!currentConfig.groups || currentConfig.groups.length === 0) {
    container.innerHTML = `
      <div style="background: #151821; border: 1px dashed rgba(250,248,245,0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #8E95A5;">
        No hay grupos configurados actualmente. Haz clic en <strong>+ Agregar Nuevo Grupo</strong> para crear uno.
      </div>
    `;
    return;
  }

  container.innerHTML = currentConfig.groups.map((group, index) => `
    <div class="admin-card group-admin-item" data-group-index="${index}">
      <div class="admin-card-header">
        <h3 class="admin-card-title">Grupo #${index + 1}: ${escapeHtml(group.name || "Sin nombre")}</h3>
        <button type="button" class="btn btn-sm btn-secondary" onclick="deleteGroup(${index})" style="color: #EF4444; border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.1);">
          🗑️ Eliminar Grupo
        </button>
      </div>
      <div class="admin-grid-3">
        <div class="admin-field">
          <label class="admin-label">Nombre de la Categoría</label>
          <input type="text" class="admin-input group-field" data-prop="name" value="${escapeHtml(group.name || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Etiqueta / Tag</label>
          <input type="text" class="admin-input group-field" data-prop="tag" value="${escapeHtml(group.tag || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Tarifas / Precios</label>
          <input type="text" class="admin-input group-field" data-prop="price" value="${escapeHtml(group.price || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Rango de Edad</label>
          <input type="text" class="admin-input group-field" data-prop="age" value="${escapeHtml(group.age || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Nivel de Juego</label>
          <input type="text" class="admin-input group-field" data-prop="level" value="${escapeHtml(group.level || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Días de Entrenamiento</label>
          <input type="text" class="admin-input group-field" data-prop="days" value="${escapeHtml(group.days || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Horarios</label>
          <input type="text" class="admin-input group-field" data-prop="hours" value="${escapeHtml(group.hours || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Sede / Ubicación</label>
          <input type="text" class="admin-input group-field" data-prop="location" value="${escapeHtml(group.location || '')}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Entrenadores a Cargo</label>
          <input type="text" class="admin-input group-field" data-prop="coach" value="${escapeHtml(group.coach || '')}">
        </div>
        <div class="admin-field span-3">
          <label class="admin-label">Descripción Detallada</label>
          <textarea class="admin-textarea group-field" rows="2" data-prop="description">${escapeHtml(group.description || '')}</textarea>
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Elimina un grupo y guarda inmediatamente
 */
window.deleteGroup = function(index) {
  // Primero sincronizar cambios actuales de los inputs
  syncGroupInputsToMemory();
  
  const groupName = currentConfig.groups[index]?.name || `Grupo #${index + 1}`;
  if (confirm(`¿Estás seguro de eliminar "${groupName}"?`)) {
    currentConfig.groups.splice(index, 1);
    // Guardar inmediatamente en localStorage
    window.FlamengoStorage?.saveConfig(currentConfig);
    renderGroupsAdminList();
    showToast(`✅ Grupo "${groupName}" eliminado y cambios guardados.`);
  }
};

/**
 * Agrega un nuevo grupo y guarda inmediatamente
 */
window.addNewGroup = function() {
  syncGroupInputsToMemory();
  
  const newGroup = {
    id: "grupo_" + Date.now(),
    name: "NUEVA CATEGORÍA",
    slug: "nueva-categoria",
    tag: "Abierto",
    description: "Entrenamiento de voleibol en Parque Carvajal.",
    age: "Todas las edades",
    level: "Iniciación / Formativo",
    days: "Martes, Jueves y Sábados",
    hours: "Tarde / Noche",
    location: "Parque Carvajal (Calle 34 Sur # 69C - 60, Bogotá)",
    price: "$75.000 (12 ses.) / $60.000 (8 ses.)",
    coach: "Didier / Eber",
    spots: "Cupos disponibles",
    featured: false
  };

  currentConfig.groups.push(newGroup);
  window.FlamengoStorage?.saveConfig(currentConfig);
  renderGroupsAdminList();
  showToast("✅ Nuevo grupo agregado. Puedes editar sus datos y guardar.");
};

function syncGroupInputsToMemory() {
  const cards = document.querySelectorAll("#admin-groups-container .group-admin-item");
  cards.forEach(card => {
    const idx = parseInt(card.getAttribute("data-group-index"), 10);
    if (currentConfig.groups[idx]) {
      card.querySelectorAll(".group-field").forEach(input => {
        const prop = input.getAttribute("data-prop");
        if (prop) {
          currentConfig.groups[idx][prop] = input.value;
        }
      });
    }
  });
}

/**
 * Renderiza los planes de precios
 */
function renderPlansAdminList() {
  const container = document.getElementById("admin-plans-container");
  if (!container || !currentConfig.plans) return;

  container.innerHTML = currentConfig.plans.map((plan, index) => `
    <div class="admin-card" style="margin-bottom: 1.2rem;">
      <div class="admin-card-header">
        <h3 class="admin-card-title">${escapeHtml(plan.name)}</h3>
      </div>
      <div class="admin-grid-3">
        <div class="admin-field">
          <label class="admin-label">Nombre del Plan</label>
          <input type="text" class="admin-input plan-field" data-index="${index}" data-prop="name" value="${escapeHtml(plan.name)}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Precio</label>
          <input type="text" class="admin-input plan-field" data-index="${index}" data-prop="price" value="${escapeHtml(plan.price)}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Frecuencia / Detalle</label>
          <input type="text" class="admin-input plan-field" data-index="${index}" data-prop="frequency" value="${escapeHtml(plan.frequency)}">
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Renderiza y gestiona entrenadores
 */
function renderCoachesAdminList() {
  const container = document.getElementById("admin-coaches-container");
  if (!container || !currentConfig.coaches) return;

  container.innerHTML = currentConfig.coaches.map((coach, index) => `
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 class="admin-card-title">Entrenador: ${escapeHtml(coach.name)}</h3>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label class="admin-label">Nombre</label>
          <input type="text" class="admin-input coach-field" data-index="${index}" data-prop="name" value="${escapeHtml(coach.name)}">
        </div>
        <div class="admin-field">
          <label class="admin-label">Cargo / Rol</label>
          <input type="text" class="admin-input coach-field" data-index="${index}" data-prop="role" value="${escapeHtml(coach.role)}">
        </div>
        <div class="admin-field span-2">
          <label class="admin-label">Especialidad</label>
          <input type="text" class="admin-input coach-field" data-index="${index}" data-prop="specialty" value="${escapeHtml(coach.specialty)}">
        </div>
        <div class="admin-field span-2">
          <label class="admin-label">Biografía / Enfoque</label>
          <textarea class="admin-textarea coach-field" rows="2" data-index="${index}" data-prop="bio">${escapeHtml(coach.bio)}</textarea>
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * Renderiza y gestiona FAQ
 */
function renderFaqAdminList() {
  const container = document.getElementById("admin-faq-container");
  if (!container || !currentConfig.faq) return;

  container.innerHTML = currentConfig.faq.map((item, index) => `
    <div class="admin-card faq-admin-item" data-faq-index="${index}" style="margin-bottom: 1.2rem;">
      <div class="admin-card-header" style="margin-bottom: 0.8rem; padding-bottom: 0.6rem;">
        <h4 style="font-size: 1rem; color: #FF7597;">Pregunta #${index + 1}</h4>
        <button type="button" class="btn btn-sm btn-secondary" onclick="deleteFaq(${index})" style="color: #EF4444;">Eliminar</button>
      </div>
      <div class="admin-field" style="margin-bottom: 0.8rem;">
        <label class="admin-label">Pregunta</label>
        <input type="text" class="admin-input faq-field" data-prop="q" value="${escapeHtml(item.q)}">
      </div>
      <div class="admin-field">
        <label class="admin-label">Respuesta</label>
        <textarea class="admin-textarea faq-field" rows="3" data-prop="a">${escapeHtml(item.a)}</textarea>
      </div>
    </div>
  `).join("");
}

window.deleteFaq = function(index) {
  syncFaqInputsToMemory();
  currentConfig.faq.splice(index, 1);
  window.FlamengoStorage?.saveConfig(currentConfig);
  renderFaqAdminList();
  showToast("Pregunta eliminada.");
};

window.addNewFaq = function() {
  syncFaqInputsToMemory();
  currentConfig.faq.push({
    q: "¿Nueva pregunta frecuente?",
    a: "Escribe aquí la respuesta detallada."
  });
  window.FlamengoStorage?.saveConfig(currentConfig);
  renderFaqAdminList();
  showToast("Nueva pregunta añadida.");
};

function syncFaqInputsToMemory() {
  document.querySelectorAll("#admin-faq-container .faq-admin-item").forEach(card => {
    const idx = parseInt(card.getAttribute("data-faq-index"), 10);
    if (currentConfig.faq[idx]) {
      card.querySelectorAll(".faq-field").forEach(input => {
        const prop = input.getAttribute("data-prop");
        if (prop) currentConfig.faq[idx][prop] = input.value;
      });
    }
  });
}

/**
 * Renderiza partidos y resultados
 */
function renderFixturesAdmin() {
  const fix = currentConfig.fixtures;
  if (!fix) return;

  setVal("admin-match-status", fix.recentMatch?.status);
  setVal("admin-match-tournament", fix.recentMatch?.tournament);
  setVal("admin-match-home", fix.recentMatch?.teamHome);
  setVal("admin-match-score-home", fix.recentMatch?.scoreHome);
  setVal("admin-match-away", fix.recentMatch?.teamAway);
  setVal("admin-match-score-away", fix.recentMatch?.scoreAway);
  setVal("admin-match-note", fix.recentMatch?.resultNote);

  setVal("admin-next-tournament", fix.nextMatch?.tournament);
  setVal("admin-next-date", fix.nextMatch?.date);
  setVal("admin-next-location", fix.nextMatch?.location);
  setVal("admin-next-rival", fix.nextMatch?.teamAway);
}

/**
 * Renderiza la tabla de leads/solicitudes de prueba recibidas
 */
function renderLeadsTable() {
  const tbody = document.getElementById("admin-leads-tbody");
  const countEl = document.getElementById("admin-leads-count");
  if (!tbody) return;

  const leads = window.FlamengoStorage ? window.FlamengoStorage.getTrialLeads() : [];
  if (countEl) countEl.textContent = `(${leads.length} solicitudes)`;

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: #8E95A5;">
          No hay solicitudes registradas todavía. Cuando alguien reserve una clase en la web aparecerá aquí.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(lead => {
    const waClean = (lead.phone || "").replace(/\D/g, "");
    
    // Saludo dinámico según la hora
    const hour = new Date().getHours();
    let greeting = "Buenos días";
    if (hour >= 12 && hour < 18) greeting = "Buenas tardes";
    if (hour >= 18) greeting = "Buenas noches";

    const replyText = encodeURIComponent(`Hola ${lead.name}, ${greeting}. Te escribo de Flamengo Voleibol respecto a tu solicitud de clase de cortesía en Parque Carvajal para la categoría *${lead.category}*. ¿Cómo estás?`);
    const waLink = `https://wa.me/${waClean.startsWith("57") ? waClean : "57" + waClean}?text=${replyText}`;

    return `
      <tr>
        <td><strong>${escapeHtml(lead.name)}</strong></td>
        <td>${escapeHtml(lead.phone)}</td>
        <td>${escapeHtml(lead.category)}</td>
        <td>${escapeHtml(lead.experience || "-")}</td>
        <td><small>${lead.dateFormatted || "-"}</small></td>
        <td>
          <select class="admin-select" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onchange="changeLeadStatus('${lead.id}', this.value)">
            <option value="Pendiente" ${lead.status === "Pendiente" ? "selected" : ""}>⏳ Pendiente</option>
            <option value="Contactado" ${lead.status === "Contactado" ? "selected" : ""}>💬 Contactado</option>
            <option value="Confirmado" ${lead.status === "Confirmado" ? "selected" : ""}>✅ Confirmado</option>
          </select>
        </td>
        <td style="display: flex; gap: 0.5rem;">
          <a href="${waLink}" target="_blank" class="btn btn-sm btn-whatsapp" style="padding: 0.35rem 0.7rem; font-size: 0.75rem;">
            Responder WhatsApp
          </a>
          <button class="btn btn-sm btn-secondary" onclick="deleteLead('${lead.id}')" style="color: #EF4444; padding: 0.35rem 0.7rem; font-size: 0.75rem;">
            ✕
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

window.changeLeadStatus = function(leadId, newStatus) {
  window.FlamengoStorage?.updateLeadStatus(leadId, newStatus);
  showToast(`Estado de lead actualizado a: ${newStatus}`);
};

window.deleteLead = function(leadId) {
  if (confirm("¿Deseas eliminar este registro de lead?")) {
    window.FlamengoStorage?.deleteLead(leadId);
    renderLeadsTable();
    showToast("Lead eliminado.");
  }
};

/**
 * Event Listeners generales del Admin
 */
function initEventListeners() {
  document.querySelectorAll(".btn-save-all-config").forEach(btn => {
    btn.addEventListener("click", () => {
      saveAllChanges();
    });
  });

  document.getElementById("btn-export-backup")?.addEventListener("click", () => {
    window.FlamengoStorage?.downloadJSONBackup();
    showToast("Archivo JSON de respaldo generado y descargado.");
  });

  const fileInput = document.getElementById("admin-import-file");
  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = window.FlamengoStorage?.importJSON(event.target.result);
      if (res && res.success) {
        showToast("¡Configuración importada exitosamente!");
        setTimeout(() => window.location.reload(), 800);
      } else {
        showToast("Error importando archivo: " + (res?.error || "Formato no válido"), true);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("btn-reset-defaults")?.addEventListener("click", () => {
    if (confirm("¿Seguro que deseas restablecer TODOS los textos, precios y datos a los valores oficiales por defecto (Parque Carvajal, 3025145457, planes de $60.000 y $75.000)?")) {
      window.FlamengoStorage?.resetConfig();
      showToast("Valores restablecidos a los oficiales.");
      setTimeout(() => window.location.reload(), 800);
    }
  });
}

/**
 * Recopila todos los campos del Admin y los guarda en localStorage
 */
function saveAllChanges() {
  if (!currentConfig) {
    currentConfig = window.FlamengoStorage ? window.FlamengoStorage.getConfig() : window.DEFAULT_FLAMENGO_CONFIG;
  }

  // 1. General
  currentConfig.general.clubName = getVal("admin-club-name");
  currentConfig.general.tagline = getVal("admin-tagline");
  currentConfig.general.whatsapp = getVal("admin-whatsapp");
  currentConfig.general.whatsappDisplay = getVal("admin-whatsapp-display");
  currentConfig.general.instagram = getVal("admin-instagram");
  currentConfig.general.email = getVal("admin-email");
  currentConfig.general.address = getVal("admin-address");
  currentConfig.general.locality = getVal("admin-locality");
  currentConfig.general.mapsUrl = getVal("admin-maps-url");
  currentConfig.general.registrationFee = getVal("admin-registration-fee");
  currentConfig.general.adminPin = getVal("admin-pin") || "flamengo2026";
  currentConfig.general.showCoaches = document.getElementById("admin-show-coaches") ? document.getElementById("admin-show-coaches").checked : false;

  // 2. Hero
  currentConfig.hero.badge = getVal("admin-hero-badge");
  currentConfig.hero.titlePrimary = getVal("admin-hero-title");
  currentConfig.hero.subtitle = getVal("admin-hero-subtitle");
  currentConfig.hero.ctaPrimaryText = getVal("admin-hero-cta1");
  currentConfig.hero.ctaSecondaryText = getVal("admin-hero-cta2");
  currentConfig.hero.trustItem1 = getVal("admin-hero-trust1");
  currentConfig.hero.trustItem2 = getVal("admin-hero-trust2");
  currentConfig.hero.trustItem3 = getVal("admin-hero-trust3");

  // 3. Sincronizar grupos
  syncGroupInputsToMemory();

  // 4. Sincronizar planes
  document.querySelectorAll(".plan-field").forEach(input => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const prop = input.getAttribute("data-prop");
    if (currentConfig.plans && currentConfig.plans[idx]) {
      currentConfig.plans[idx][prop] = input.value;
    }
  });

  // 5. Entrenadores
  document.querySelectorAll(".coach-field").forEach(input => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const prop = input.getAttribute("data-prop");
    if (currentConfig.coaches && currentConfig.coaches[idx]) {
      currentConfig.coaches[idx][prop] = input.value;
    }
  });

  // 6. FAQ
  syncFaqInputsToMemory();

  // 7. Fixtures
  if (currentConfig.fixtures) {
    currentConfig.fixtures.recentMatch = {
      status: getVal("admin-match-status"),
      tournament: getVal("admin-match-tournament"),
      teamHome: getVal("admin-match-home"),
      scoreHome: getVal("admin-match-score-home"),
      teamAway: getVal("admin-match-away"),
      scoreAway: getVal("admin-match-score-away"),
      resultNote: getVal("admin-match-note")
    };

    currentConfig.fixtures.nextMatch = {
      status: "Próximo Encuentro",
      tournament: getVal("admin-next-tournament"),
      date: getVal("admin-next-date"),
      location: getVal("admin-next-location"),
      teamHome: currentConfig.general.clubName,
      teamAway: getVal("admin-next-rival"),
      category: "Categorías Menores e Infantil"
    };
  }

  // Guardar en Storage
  const success = window.FlamengoStorage?.saveConfig(currentConfig);
  if (success) {
    showToast("✅ ¡Cambios guardados con éxito! El sitio web público se ha actualizado.");
  } else {
    showToast("Error guardando cambios.", true);
  }
}

function showToast(msg, isError = false) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.className = "toast-msg" + (isError ? " error" : "");
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
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
