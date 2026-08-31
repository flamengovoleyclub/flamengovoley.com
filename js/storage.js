/**
 * STORAGE MANAGER — FLAMENGO VOLEIBOL
 * Maneja la persistencia en LocalStorage, sincronización en tiempo real
 * entre el Admin y las páginas públicas, gestión de leads y eventos de conversión.
 */

const STORAGE_KEYS = {
  CONFIG: "flamengo_site_config_v1",
  LEADS: "flamengo_trial_leads_v1",
  ANALYTICS: "flamengo_analytics_log_v1",
  AUTH: "flamengo_admin_auth_v1"
};

const FlamengoStorage = {
  /**
   * Obtiene la configuración actual del sitio.
   * Si no existe en localStorage, devuelve la configuración por defecto de config.js.
   */
  getConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge profundo seguro con defaults
        return {
          ...DEFAULT_FLAMENGO_CONFIG,
          ...parsed,
          general: { ...DEFAULT_FLAMENGO_CONFIG.general, ...(parsed.general || {}) },
          hero: { ...DEFAULT_FLAMENGO_CONFIG.hero, ...(parsed.hero || {}) },
          fixtures: { ...DEFAULT_FLAMENGO_CONFIG.fixtures, ...(parsed.fixtures || {}) }
        };
      }
    } catch (e) {
      console.warn("Error leyendo configuración de localStorage, usando defaults:", e);
    }
    return DEFAULT_FLAMENGO_CONFIG;
  },

  /**
   * Guarda una nueva configuración en localStorage y despacha un evento.
   */
  saveConfig(newConfig) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
      window.dispatchEvent(new CustomEvent("flamengo_config_updated", { detail: newConfig }));
      return true;
    } catch (e) {
      console.error("Error guardando configuración:", e);
      return false;
    }
  },

  /**
   * Restablece la configuración a los valores por defecto originales.
   */
  resetConfig() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      window.dispatchEvent(new CustomEvent("flamengo_config_updated", { detail: DEFAULT_FLAMENGO_CONFIG }));
      return true;
    } catch (e) {
      console.error("Error restableciendo configuración:", e);
      return false;
    }
  },

  /**
   * Exporta la configuración actual a un archivo JSON descargable.
   */
  downloadJSONBackup() {
    const config = this.getConfig();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `flamengo_voleibol_config_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Importa y valida una configuración desde un string JSON.
   */
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.general || !parsed.groups) {
        throw new Error("El archivo JSON no tiene la estructura requerida de Flamengo Voleibol.");
      }
      this.saveConfig(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Guarda una solicitud de entrenamiento de prueba recibida.
   */
  saveTrialLead(lead) {
    try {
      const leads = this.getTrialLeads();
      const newLead = {
        id: "lead_" + Date.now(),
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
        status: "Pendiente",
        ...lead
      };
      leads.unshift(newLead);
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      
      // Notificar evento
      window.dispatchEvent(new CustomEvent("flamengo_lead_created", { detail: newLead }));

      // Registrar evento de analítica
      this.trackEvent("training_trial_request", {
        name: lead.name,
        category: lead.category,
        experience: lead.experience
      });

      return newLead;
    } catch (e) {
      console.error("Error guardando lead de prueba:", e);
      return null;
    }
  },

  /**
   * Obtiene la lista de leads/solicitudes de prueba recibidas.
   */
  getTrialLeads() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Actualiza el estado de un lead (Pendiente, Contactado, Confirmado, Cancelado).
   */
  updateLeadStatus(leadId, newStatus) {
    const leads = this.getTrialLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      return true;
    }
    return false;
  },

  /**
   * Elimina un lead por su ID.
   */
  deleteLead(leadId) {
    const leads = this.getTrialLeads().filter(l => l.id !== leadId);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    return true;
  },

  /**
   * Registrador de eventos de analítica y conversión SEO.
   */
  trackEvent(eventName, params = {}) {
    const logItem = {
      event: eventName,
      params: params,
      timestamp: new Date().toISOString(),
      url: window.location.pathname
    };
    
    // Log visible en consola para depuración
    console.info(`[Flamengo Analytics] 📊 Evento: ${eventName}`, params);

    // Integración transparente con Google Analytics (dataLayer / gtag) si está instalado
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }

    // Almacenamiento local de auditoría
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || "[]");
      logs.unshift(logItem);
      if (logs.length > 100) logs.pop(); // Mantener solo los últimos 100 eventos
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(logs));
    } catch (e) {}
  },

  /**
   * Autenticación simple para el panel de administración
   */
  checkAdminAuth() {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true";
  },

  setAdminAuth(status) {
    if (status) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }
};

// Exportar globalmente
if (typeof window !== "undefined") {
  window.FlamengoStorage = FlamengoStorage;
}
