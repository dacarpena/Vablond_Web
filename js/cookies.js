/**
 * Sistema de gestión de cookies para Vablond
 * Cumple con RGPD y normativa española
 */

class CookieManager {
  constructor() {
    this.cookieTypes = {
      necessary: {
        name: 'Necesarias',
        description: 'Cookies técnicas imprescindibles para el funcionamiento del sitio web',
        required: true,
        cookies: ['vablond_session', 'vablond_csrf', 'vablond_preferences']
      },
      analytics: {
        name: 'Análisis',
        description: 'Cookies que nos ayudan a entender cómo interactúan los visitantes con el sitio web',
        required: false,
        cookies: ['_ga', '_ga_*', '_gid', '_gat']
      },
      functionality: {
        name: 'Funcionalidad',
        description: 'Cookies que permiten funcionalidades mejoradas y personalizadas',
        required: false,
        cookies: ['vablond_ler_selections', 'vablond_form_data', 'vablond_language']
      }
    };
    
    this.consentCookieName = 'vablond_cookie_consent';
    this.consentVersion = '1.0';
    this.init();
  }

  init() {
    // Verificar si ya existe consentimiento
    const consent = this.getConsent();
    
    if (!consent || consent.version !== this.consentVersion) {
      this.showCookieBanner();
    } else {
      this.applyCookieSettings(consent.preferences);
    }
    
    // Agregar event listeners
    this.addEventListeners();
  }

  showCookieBanner() {
    // Crear el banner de cookies si no existe
    if (document.getElementById('cookie-banner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = this.getCookieBannerHTML();
    
    document.body.appendChild(banner);
    
    // Animar entrada
    setTimeout(() => {
      banner.classList.add('cookie-banner-visible');
    }, 100);
    
    // Agregar event listeners del banner
    this.addBannerEventListeners();
  }

  getCookieBannerHTML() {
    return `
      <div class="cookie-banner-content">
        <div class="cookie-banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="cookie-banner-text">
          <h3>🍪 Uso de cookies</h3>
          <p>Utilizamos cookies propias y de terceros para mejorar su experiencia de navegación, analizar el tráfico del sitio web y personalizar el contenido. Puede aceptar todas las cookies o configurar sus preferencias.</p>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-accept-all" class="btn btn-primary">
            Aceptar todas
          </button>
          <button id="cookie-configure" class="btn btn-ghost">
            Configurar
          </button>
          <button id="cookie-reject-optional" class="btn btn-ghost">
            Solo necesarias
          </button>
        </div>
        <div class="cookie-banner-links">
          <a href="/legal/cookies.html" target="_blank" rel="noopener">Política de cookies</a>
          <a href="/legal/privacidad.html" target="_blank" rel="noopener">Política de privacidad</a>
        </div>
      </div>
    `;
  }

  showCookieModal() {
    // Crear modal de configuración
    const modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.className = 'cookie-modal';
    modal.innerHTML = this.getCookieModalHTML();
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animar entrada
    setTimeout(() => {
      modal.classList.add('cookie-modal-visible');
    }, 100);
    
    // Agregar event listeners del modal
    this.addModalEventListeners();
  }

  getCookieModalHTML() {
    const consent = this.getConsent();
    const preferences = consent ? consent.preferences : {};
    
    let cookieTypesHTML = '';
    
    Object.keys(this.cookieTypes).forEach(type => {
      const cookieType = this.cookieTypes[type];
      const isChecked = preferences[type] !== false;
      const isDisabled = cookieType.required;
      
      cookieTypesHTML += `
        <div class="cookie-type">
          <div class="cookie-type-header">
            <label class="cookie-switch ${isDisabled ? 'cookie-switch-disabled' : ''}">
              <input 
                type="checkbox" 
                id="cookie-${type}" 
                ${isChecked ? 'checked' : ''} 
                ${isDisabled ? 'disabled' : ''}
                data-cookie-type="${type}"
              >
              <span class="cookie-slider"></span>
            </label>
            <div class="cookie-type-info">
              <h4>${cookieType.name} ${cookieType.required ? '<span class="cookie-required">(Obligatorias)</span>' : ''}</h4>
              <p>${cookieType.description}</p>
            </div>
          </div>
          <div class="cookie-details">
            <strong>Cookies utilizadas:</strong>
            <ul>
              ${cookieType.cookies.map(cookie => `<li><code>${cookie}</code></li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    });

    return `
      <div class="cookie-modal-overlay" id="cookie-modal-overlay"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2>Configuración de cookies</h2>
          <button id="cookie-modal-close" class="cookie-modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="cookie-modal-body">
          <p>Personaliza qué tipos de cookies deseas permitir. Las cookies necesarias no se pueden desactivar ya que son imprescindibles para el funcionamiento del sitio web.</p>
          <div class="cookie-types">
            ${cookieTypesHTML}
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="cookie-save-preferences" class="btn btn-primary">
            Guardar preferencias
          </button>
          <button id="cookie-accept-all-modal" class="btn btn-ghost">
            Aceptar todas
          </button>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    // Listener para abrir configuración desde el footer
    document.addEventListener('click', (e) => {
      if (e.target.id === 'cookie-settings-link') {
        e.preventDefault();
        this.showCookieModal();
      }
    });
  }

  addBannerEventListeners() {
    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
      this.acceptAllCookies();
    });

    document.getElementById('cookie-configure')?.addEventListener('click', () => {
      this.showCookieModal();
    });

    document.getElementById('cookie-reject-optional')?.addEventListener('click', () => {
      this.acceptNecessaryOnly();
    });
  }

  addModalEventListeners() {
    const modal = document.getElementById('cookie-modal');
    
    document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
      this.closeCookieModal();
    });

    document.getElementById('cookie-modal-overlay')?.addEventListener('click', () => {
      this.closeCookieModal();
    });

    document.getElementById('cookie-save-preferences')?.addEventListener('click', () => {
      this.saveCustomPreferences();
    });

    document.getElementById('cookie-accept-all-modal')?.addEventListener('click', () => {
      this.acceptAllCookies();
    });

    // Escape key para cerrar modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal) {
        this.closeCookieModal();
      }
    });
  }

  acceptAllCookies() {
    const preferences = {};
    Object.keys(this.cookieTypes).forEach(type => {
      preferences[type] = true;
    });
    
    this.saveConsent(preferences);
    this.applyCookieSettings(preferences);
    this.hideCookieBanner();
    this.closeCookieModal();
    this.showNotification('✅ Todas las cookies han sido aceptadas', 'success');
  }

  acceptNecessaryOnly() {
    const preferences = {};
    Object.keys(this.cookieTypes).forEach(type => {
      preferences[type] = this.cookieTypes[type].required;
    });
    
    this.saveConsent(preferences);
    this.applyCookieSettings(preferences);
    this.hideCookieBanner();
    this.closeCookieModal();
    this.showNotification('ℹ️ Solo se han activado las cookies necesarias', 'info');
  }

  saveCustomPreferences() {
    const preferences = {};
    
    Object.keys(this.cookieTypes).forEach(type => {
      const checkbox = document.getElementById(`cookie-${type}`);
      preferences[type] = checkbox ? checkbox.checked : this.cookieTypes[type].required;
    });
    
    this.saveConsent(preferences);
    this.applyCookieSettings(preferences);
    this.hideCookieBanner();
    this.closeCookieModal();
    this.showNotification('✅ Preferencias de cookies guardadas', 'success');
  }

  saveConsent(preferences) {
    const consent = {
      version: this.consentVersion,
      timestamp: new Date().toISOString(),
      preferences: preferences
    };
    
    this.setCookie(this.consentCookieName, JSON.stringify(consent), 365);
  }

  getConsent() {
    const consentCookie = this.getCookie(this.consentCookieName);
    return consentCookie ? JSON.parse(consentCookie) : null;
  }

  applyCookieSettings(preferences) {
    // Aplicar configuración de Google Analytics
    if (preferences.analytics) {
      this.enableGoogleAnalytics();
    } else {
      this.disableGoogleAnalytics();
    }
    
    // Aplicar otras configuraciones según sea necesario
    if (preferences.functionality) {
      this.enableFunctionalityCookies();
    }
    
    // Limpiar cookies no permitidas
    this.cleanupUnwantedCookies(preferences);
  }

  enableGoogleAnalytics() {
    // Código para habilitar Google Analytics
    if (window.analyticsManager) {
      window.analyticsManager.updateConsent(true);
    } else if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  disableGoogleAnalytics() {
    // Código para deshabilitar Google Analytics
    if (window.analyticsManager) {
      window.analyticsManager.updateConsent(false);
      window.analyticsManager.clearCookies();
    } else if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }

  enableFunctionalityCookies() {
    // Habilitar cookies de funcionalidad
    console.log('Functionality cookies enabled');
  }

  cleanupUnwantedCookies(preferences) {
    // Limpiar cookies no permitidas
    Object.keys(this.cookieTypes).forEach(type => {
      if (!preferences[type] && !this.cookieTypes[type].required) {
        this.cookieTypes[type].cookies.forEach(cookieName => {
          this.deleteCookie(cookieName);
        });
      }
    });
  }

  hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('cookie-banner-visible');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  closeCookieModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
      modal.classList.remove('cookie-modal-visible');
      document.body.style.overflow = '';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }

  showNotification(message, type = 'info') {
    // Reutilizar la función de notificaciones existente si está disponible
    if (typeof showNotification === 'function') {
      showNotification(message, type);
    } else {
      // Fallback simple
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  // Utilidades para cookies
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Método público para reabrir configuración
  openSettings() {
    this.showCookieModal();
  }
}

// Inicializar el gestor de cookies cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.cookieManager = new CookieManager();
});

// Función global para abrir configuración
function openCookieSettings() {
  if (window.cookieManager) {
    window.cookieManager.openSettings();
  }
}
