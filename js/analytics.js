/**
 * Configuración de Google Analytics que respeta las preferencias de cookies
 * Compatible con el sistema de gestión de cookies de Vablond
 */

// Configuración inicial de Google Analytics con consentimiento
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Configurar el consentimiento por defecto (denegado)
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied'
});

// Configurar Google Analytics
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=Lax;Secure'
});

/**
 * Función para actualizar el consentimiento de Google Analytics
 * Se llama desde el sistema de cookies cuando el usuario acepta/rechaza
 */
function updateAnalyticsConsent(analyticsAllowed) {
  if (typeof gtag !== 'undefined') {
    gtag('consent', 'update', {
      'analytics_storage': analyticsAllowed ? 'granted' : 'denied'
    });
    
    if (analyticsAllowed) {
      // Enviar evento de consentimiento otorgado
      gtag('event', 'cookie_consent_granted', {
        'event_category': 'cookies',
        'event_label': 'analytics'
      });
    }
  }
}

/**
 * Función para verificar si Google Analytics está activo
 */
function isAnalyticsActive() {
  return typeof gtag !== 'undefined' && 
         window.dataLayer && 
         window.dataLayer.some(item => 
           item[0] === 'consent' && 
           item[1] === 'update' && 
           item[2].analytics_storage === 'granted'
         );
}

/**
 * Función para limpiar cookies de Google Analytics
 */
function clearAnalyticsCookies() {
  const analyticsCookies = [
    '_ga',
    '_ga_' + 'GA_MEASUREMENT_ID'.replace('G-', ''),
    '_gid',
    '_gat',
    '_gat_gtag_' + 'GA_MEASUREMENT_ID'
  ];
  
  analyticsCookies.forEach(cookieName => {
    // Eliminar cookie del dominio actual
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Eliminar cookie del dominio padre
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    // Eliminar cookie del dominio padre con punto
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });
}

// Exportar funciones para uso del sistema de cookies
window.analyticsManager = {
  updateConsent: updateAnalyticsConsent,
  isActive: isAnalyticsActive,
  clearCookies: clearAnalyticsCookies
};
