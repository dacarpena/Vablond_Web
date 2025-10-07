// Año en footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  
  // Inicializar tooltips
  initTooltips();
  
  // Inicializar animaciones de carga
  initLoadingAnimations();
  
  // Inicializar botón flotante
  initFloatingButton();
  
  // Inicializar navbar mejorado
  initNavbar();
});

// Inicializar botón flotante con animaciones
function initFloatingButton() {
  const fab = document.getElementById('floatingBtn');
  if (!fab) return;

  // Desplazamiento suave al hacer clic
  fab.addEventListener('click', (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      // Desplazamiento suave
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Enfoque en el primer campo del formulario
      const firstInput = contactSection.querySelector('input, textarea, select');
      if (firstInput) {
        setTimeout(() => firstInput.focus({ preventScroll: true }), 800);
      }
    }
  });

  // Mostrar/ocultar botón al hacer scroll
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > 300) {
      fab.classList.add('visible');
    } else {
      fab.classList.remove('visible');
    }

    // Ocultar en scroll hacia abajo, mostrar en scroll hacia arriba
    if (st > lastScrollTop && st > 300) {
      fab.classList.add('hidden-scroll');
    } else {
      fab.classList.remove('hidden-scroll');
    }
    
    lastScrollTop = st <= 0 ? 0 : st;
  }, { passive: true });
}

// Inicializar navbar mejorado
function initNavbar() {
  const navbar = document.querySelector('.topbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mnav');
  
  if (!navbar) return;
  
  // Efecto de scroll en navbar
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  const updateNavbar = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Menú móvil mejorado
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.contains('hidden');
      const icon = menuBtn.querySelector('svg');
      
      if (isHidden) {
        // Abrir menú
        mobileNav.classList.remove('hidden');
        mobileNav.style.opacity = '0';
        mobileNav.style.transform = 'translateY(-10px)';
        
        void mobileNav.offsetWidth; // Forzar reflow
        
        mobileNav.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        mobileNav.style.opacity = '1';
        mobileNav.style.transform = 'translateY(0)';
        
        // Cambiar ícono con animación
        icon.style.transform = 'rotate(90deg)';
        setTimeout(() => {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
          icon.style.transform = 'rotate(0deg)';
        }, 150);
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
      } else {
        // Cerrar menú
        mobileNav.style.opacity = '0';
        mobileNav.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          mobileNav.classList.add('hidden');
          document.body.style.overflow = '';
        }, 300);
        
        // Cambiar ícono con animación
        icon.style.transform = 'rotate(-90deg)';
        setTimeout(() => {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
          icon.style.transform = 'rotate(0deg)';
        }, 150);
      }
      
      menuBtn.setAttribute('aria-expanded', isHidden.toString());
    });
    
    // Cerrar menú al hacer clic en un enlace
    mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.style.opacity = '0';
        mobileNav.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          mobileNav.classList.add('hidden');
          document.body.style.overflow = '';
          
          const icon = menuBtn.querySelector('svg');
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }, 300);
        
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Cerrar menú con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
        menuBtn.click();
      }
    });
  }
  
  // Resaltar enlace activo en scroll
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], #mnav a[href^="#"]');
  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    return href ? document.querySelector(href) : null;
  }).filter(Boolean);
  
  if (sections.length > 0) {
    const highlightActiveSection = () => {
      const scrollPos = window.scrollY + 100;
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    highlightActiveSection(); // Ejecutar al cargar
  }
}

// Mapa Leaflet con animación de carga
document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('map');
  if (!mapEl || !window.L) return;
  
  // Mostrar indicador de carga
  mapEl.innerHTML = '<div class="flex items-center justify-center h-full"><div class="animate-pulse flex space-x-2"><div class="w-3 h-3 bg-red-300 rounded-full"></div><div class="w-3 h-3 bg-red-400 rounded-full"></div><div class="w-3 h-3 bg-red-500 rounded-full"></div></div></div>';
  
  // Cargar el mapa después de un pequeño retraso para permitir la renderización del indicador
  setTimeout(() => {
    try {
      const map = L.map('map', { 
        scrollWheelZoom: false,
        fadeAnimation: true,
        zoomControl: false
      }).setView([36.8300, -2.4500], 15);
      
      // Añadir control de zoom personalizado
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      // Añadir capa de mapa con transición suave
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        fadeAnimation: true
      }).addTo(map);
      
      // Añadir marcador con animación
      const marker = L.marker([36.8300, -2.4500], {
        icon: L.divIcon({
          html: '<div class="relative"><div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div><div class="relative bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold">V</div></div>',
          className: 'bg-transparent border-none',
          iconSize: [24, 24],
          popupAnchor: [0, -12]
        })
      }).addTo(map);
      
      // Añadir popup con animación
      marker.bindPopup('<div class="p-2"><strong>Vablond S.L.</strong><br>Avda. Vega de Acá 37, 3F<br>04007 Almería</div>', {
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        className: 'popup-custom',
        offset: L.point(0, -10)
      }).openPopup();
      
      // Asegurar que el mapa se redimensione correctamente
      setTimeout(() => map.invalidateSize(), 100);
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
      mapEl.innerHTML = '<div class="text-center p-8 text-red-600">No se pudo cargar el mapa. Por favor, recarga la página.</div>';
    }
  }, 100);
});

// Buscador LER con animaciones fluidas y funcionalidad avanzada
document.addEventListener('DOMContentLoaded', async () => {
  const q = document.getElementById('ler-q');
  const res = document.getElementById('ler-res');
  const spinner = document.getElementById('ler-spinner');
  const resultsContainer = document.getElementById('ler-results-container');
  
  if (!q || !res) return;
  
  let data = [];
  let isLoading = false;
  let searchTimeout;
  let currentQuery = '';
  
  // Estados del buscador
  const states = {
    IDLE: 'idle',
    LOADING: 'loading',
    SEARCHING: 'searching',
    RESULTS: 'results',
    NO_RESULTS: 'no-results',
    ERROR: 'error'
  };
  
  let currentState = states.IDLE;
  
  // Función para limpiar el contador de resultados
  const clearResultsCounter = () => {
    const counter = document.getElementById('ler-results-counter');
    if (counter) {
      counter.remove();
    }
  };

  // Cambiar estado del buscador
  const setState = (newState) => {
    currentState = newState;
    
    // Limpiar contador en todos los estados excepto RESULTS
    if (newState !== states.RESULTS) {
      clearResultsCounter();
    }
    
    switch (currentState) {
      case states.LOADING:
        res.innerHTML = `
          <li class="p-8 text-center">
            <div class="animate-spin mx-auto w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-gray-500">Cargando códigos LER...</p>
          </li>
        `;
        break;
      case states.SEARCHING:
        res.innerHTML = `
          <li class="p-8 text-center">
            <div class="animate-pulse flex items-center justify-center mb-4">
              <div class="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <div class="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <p class="text-gray-500">Buscando...</p>
          </li>
        `;
        break;
      case states.NO_RESULTS:
        showEmptyState();
        break;
      case states.ERROR:
        showErrorState();
        break;
      case states.IDLE:
      default:
        res.innerHTML = '';
        break;
    }
  };
  
  // Mostrar estado vacío
  const showEmptyState = () => {
    res.innerHTML = `
      <li class="p-8 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 00-16 0 8 8 0 007.962 7.291z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-lg font-medium">No se encontraron códigos LER</p>
        <p class="text-gray-400 text-sm mt-1">Intenta con otros términos de búsqueda</p>
      </li>
    `;
  };
  
  // Mostrar estado de error
  const showErrorState = (message) => {
    res.innerHTML = `
      <li class="p-8 text-center">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-red-600 text-lg font-medium">Error al cargar los datos</p>
        <p class="text-red-400 text-sm mt-1">${message || 'Por favor, inténtalo de nuevo más tarde'}</p>
        <button onclick="location.reload()" class="mt-4 btn btn-ghost text-sm">Recargar página</button>
      </li>
    `;
  };
  
  // Cargar datos LER
  const loadData = async () => {
    if (isLoading || data.length > 0) return;
    
    isLoading = true;
    setState(states.LOADING);
    
    try {
      const response = await fetch('./js/ler.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Datos inválidos o vacíos');
      }
      
      setState(states.IDLE);
    } catch (error) {
      console.error('Error cargando LER:', error);
      setState(states.ERROR, error.message);
    } finally {
      isLoading = false;
    }
  };
  
  // Resaltar texto coincidente
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };
  
  // Renderizar resultados con animaciones
  const renderResults = (results, query) => {
    if (!results.length) {
      setState(states.NO_RESULTS);
      return;
    }
    
    setState(states.RESULTS);
    
    // Crear elementos con animación
    const items = results.map((item, index) => {
      const li = document.createElement('li');
      li.className = 'group ler-result-item bg-white border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1';
      li.style.opacity = '0';
      li.style.transform = 'translateY(20px)';
      
      // Determinar si es peligroso
      const isPeligroso = item.codigo.includes('*');
      const badgeClass = isPeligroso ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200';
      const badgeText = isPeligroso ? 'Peligroso' : 'No peligroso';
      
      // Escapar comillas para evitar problemas en el onclick
      const escapedDescription = item.descripcion.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
      
      li.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <code class="text-lg font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">${highlightMatch(item.codigo, query)}</code>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badgeClass}">
                ${badgeText}
              </span>
            </div>
            <p class="text-gray-700 leading-relaxed">${highlightMatch(item.descripcion, query)}</p>
          </div>
          <div class="flex-shrink-0">
            <button onclick="selectLERCode('${item.codigo}', '${escapedDescription}')"
              class="ler-select-btn btn btn-primary text-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Agregar
            </button>
          </div>
        </div>
      `;
      
      // Animar entrada con retraso escalonado
      setTimeout(() => {
        li.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      }, index * 80);
      
      return li;
    });
    
    // Limpiar y añadir resultados
    res.innerHTML = '';
    items.forEach(item => res.appendChild(item));
    
    // Mostrar contador de resultados
    if (results.length > 0) {
      const counter = document.createElement('div');
      counter.className = 'text-sm text-gray-600 mb-4 px-1';
      counter.id = 'ler-results-counter'; // Agregar ID para poder eliminarlo después
      counter.innerHTML = `
        <span class="inline-flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          ${results.length} código${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''} - Selecciona uno para auto-completar el formulario
        </span>
      `;
      res.parentNode.insertBefore(counter, res);
    }
  };
  
  // Buscar códigos LER
  const searchLER = async (query) => {
    if (!query || query.length < 2) {
      setState(states.IDLE);
      return;
    }
    
    setState(states.SEARCHING);
    
    // Cargar datos si es necesario
    if (data.length === 0) {
      await loadData();
      if (data.length === 0) return;
    }
    
    // Filtrar resultados
    const normalizedQuery = query.toLowerCase().trim();
    const results = data.filter(item => 
      item.codigo.toLowerCase().includes(normalizedQuery) || 
      item.descripcion.toLowerCase().includes(normalizedQuery)
    ).slice(0, 50); // Limitar a 50 resultados
    
    renderResults(results, query);
  };
  
  // Event listeners
  q.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    currentQuery = query;
    
    // Si el campo está vacío, limpiar inmediatamente
    if (!query) {
      setState(states.IDLE);
      return;
    }
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (query === currentQuery) {
        searchLER(query);
      }
    }, 300);
  });
  
  // Cargar datos al hacer foco
  q.addEventListener('focus', () => {
    if (data.length === 0) {
      loadData();
    }
  });
  
  // Limpiar al perder foco si no hay query
  q.addEventListener('blur', () => {
    if (!currentQuery) {
      setTimeout(() => {
        if (!q.matches(':focus')) {
          setState(states.IDLE);
        }
      }, 150);
    }
  });
  
  // Navegación con teclado
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      q.blur();
      setState(states.IDLE);
    }
  });
  
  // Añadir información contextual sobre el buscador
  if (q) {
    q.addEventListener('focus', () => {
      if (!q.value) {
        showNotification('💡 Tip: Puedes buscar por código (ej: "15 01 01") o por descripción (ej: "envases")', 'info');
      }
    });
  }
});

// Funciones de utilidad
function initTooltips() {
  // Inicializar tooltips si es necesario
  if (window.tippy) {
    document.querySelectorAll('[data-tippy-content]').forEach(el => {
      tippy(el, {
        animation: 'scale-subtle',
        theme: 'light-border',
        delay: [100, 0],
        duration: [150, 100],
        arrow: true,
        interactive: true,
        appendTo: document.body
      });
    });
  }
}

function initLoadingAnimations() {
  // Añadir clase de carga a los botones de envío
  document.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.form && this.form.checkValidity()) {
        this.classList.add('opacity-75', 'cursor-not-allowed');
        this.disabled = true;
        
        // Añadir spinner
        const spinner = document.createElement('span');
        spinner.className = 'ml-2 inline-block animate-spin';
        spinner.innerHTML = '<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        this.appendChild(spinner);
      }
    });
  });
}

// Validación de formularios con mejor feedback visual
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[data-honeypot]').forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    
    // Añadir validación en tiempo real
    inputs.forEach(input => {
      // Añadir clases de validación
      input.addEventListener('input', function() {
        this.classList.remove('border-red-500', 'border-green-500');
        
        if (this.checkValidity()) {
          this.classList.add('border-green-500');
        } else if (this.value) {
          this.classList.add('border-red-500');
        }
      });
      
      // Añadir validación al perder el foco
      input.addEventListener('blur', function() {
        this.classList.remove('border-green-500');
        if (!this.checkValidity() && this.value) {
          this.classList.add('border-red-500');
        }
      });
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', (ev) => {
      // Verificar honeypot
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { 
        ev.preventDefault(); 
        return; 
      }
      
      // Verificar RGPD
      const rgpd = form.querySelector('input[name="rgpd"]');
      if (rgpd && !rgpd.checked) {
        ev.preventDefault();
        
        // Mostrar mensaje de error con animación
        let errorMsg = rgpd.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-msg')) {
          errorMsg = document.createElement('div');
          errorMsg.className = 'error-msg text-red-600 text-sm mt-1';
          rgpd.parentNode.insertBefore(errorMsg, rgpd.nextSibling);
        }
        
        errorMsg.textContent = 'Debes aceptar la política de privacidad.';
        errorMsg.style.opacity = '0';
        errorMsg.style.transform = 'translateY(-5px)';
        
        // Animar el mensaje de error
        setTimeout(() => {
          errorMsg.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
          errorMsg.style.opacity = '1';
          errorMsg.style.transform = 'translateY(0)';
          
          // Hacer scroll al campo de RGPD
          rgpd.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Resaltar el campo
          rgpd.parentElement.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50', 'rounded-md');
          setTimeout(() => {
            rgpd.parentElement.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50', 'rounded-md');
          }, 2000);
        }, 10);
        
        return;
      }
      
      // Si todo está bien, permitir el envío
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
      }
    });
  });
  
  // Mejorar la experiencia de los tooltips nativos
  document.querySelectorAll('[title]').forEach(el => {
    el.setAttribute('data-tippy-content', el.getAttribute('title'));
    el.removeAttribute('title');
  });
});

// Efecto de scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      
      // Calcular la posición de destino
      const headerHeight = document.querySelector('header')?.offsetHeight || 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Animación de scroll suave
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Actualizar la URL sin recargar la página
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    }
  });
});

// Mejorar la experiencia de carga de imágenes
if ('loading' in HTMLImageElement.prototype) {
  // El navegador soporta lazy loading nativo
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.loading = 'lazy';
  });
} else {
  // Polyfill para lazy loading
  const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('opacity-0');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

// Array para almacenar códigos LER seleccionados
let selectedLERCodes = [];

// Función para seleccionar código LER y redirigir al formulario
function selectLERCode(codigo, descripcion) {
  // Decodificar entidades HTML
  const decodedDescription = descripcion.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  
  // Verificar si el código ya está seleccionado
  const existingIndex = selectedLERCodes.findIndex(item => item.codigo === codigo);
  
  if (existingIndex === -1) {
    // Agregar nuevo código
    selectedLERCodes.push({ codigo, descripcion: decodedDescription });
    showNotification(`✅ Código ${codigo} agregado`, 'success');
  } else {
    // Mostrar mensaje si ya está seleccionado
    showNotification(`ℹ️ Código ${codigo} ya está seleccionado`, 'info');
    return;
  }
  
  // Actualizar la interfaz
  updateSelectedLERDisplay();
  
  // Redirigir al formulario de contacto si es la primera selección
  if (selectedLERCodes.length === 1) {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      // Desplazamiento suave al formulario
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Enfocar el campo de contenedor después del scroll
      setTimeout(() => {
        const containerSizeField = document.getElementById('container-size');
        if (containerSizeField) {
          containerSizeField.focus();
        }
      }, 800);
    }
  }
}

// Función para actualizar la visualización de códigos LER seleccionados
function updateSelectedLERDisplay() {
  const selectedContainer = document.getElementById('selected-ler-codes');
  const tagsContainer = document.getElementById('ler-tags-container');
  const wasteTypeField = document.getElementById('waste-type');
  const lerCodesField = document.getElementById('ler-codes');
  const wasteDescriptionsField = document.getElementById('waste-descriptions');
  
  if (!selectedContainer || !tagsContainer) return;
  
  // Limpiar contenedor de tags
  tagsContainer.innerHTML = '';
  
  const clearButton = document.getElementById('clear-ler-button');
  
  if (selectedLERCodes.length === 0) {
    selectedContainer.classList.add('hidden');
    wasteTypeField.value = '';
    lerCodesField.value = '';
    wasteDescriptionsField.value = '';
    wasteTypeField.placeholder = 'Haz clic para seleccionar códigos LER o escribe manualmente';
    if (clearButton) clearButton.style.display = 'none';
    return;
  }
  
  // Mostrar contenedor y botón de limpiar
  selectedContainer.classList.remove('hidden');
  if (clearButton) clearButton.style.display = 'block';
  
  // Crear tags para cada código seleccionado
  selectedLERCodes.forEach((item, index) => {
    const tag = document.createElement('div');
    const isPeligroso = item.codigo.includes('*');
    const tagClass = isPeligroso ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200';
    
    tag.className = `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${tagClass} animate-fadeIn`;
    tag.innerHTML = `
      <span class="font-bold">${item.codigo}</span>
      <span class="truncate max-w-[200px]" title="${item.descripcion}">${item.descripcion}</span>
      <button type="button" onclick="removeLERCode(${index})" class="ml-1 hover:bg-red-200 rounded-full p-1 transition-colors">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;
    tagsContainer.appendChild(tag);
  });
  
  // Actualizar campos del formulario
  const codes = selectedLERCodes.map(item => item.codigo).join(', ');
  const descriptions = selectedLERCodes.map(item => `${item.codigo}: ${item.descripcion}`).join('\n');
  
  wasteTypeField.value = `${selectedLERCodes.length} código${selectedLERCodes.length !== 1 ? 's' : ''} LER seleccionado${selectedLERCodes.length !== 1 ? 's' : ''}`;
  lerCodesField.value = codes;
  wasteDescriptionsField.value = descriptions;
  wasteTypeField.placeholder = 'Códigos LER seleccionados';
  
  // Efecto visual
  wasteTypeField.classList.add('border-green-500', 'bg-green-50');
  setTimeout(() => {
    wasteTypeField.classList.remove('border-green-500', 'bg-green-50');
  }, 2000);
}

// Función para remover un código LER seleccionado
function removeLERCode(index) {
  if (index >= 0 && index < selectedLERCodes.length) {
    const removedCode = selectedLERCodes[index];
    selectedLERCodes.splice(index, 1);
    updateSelectedLERDisplay();
    showNotification(`🗑️ Código ${removedCode.codigo} eliminado`, 'info');
  }
}

// Función para limpiar todos los códigos seleccionados
function clearAllLERCodes() {
  selectedLERCodes = [];
  updateSelectedLERDisplay();
  showNotification('🧹 Todos los códigos eliminados', 'info');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Verificar si hay datos guardados al cargar la página y mejorar funcionalidad del formulario
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar funcionalidad del campo de tipo de residuo
  const wasteTypeField = document.getElementById('waste-type');
  
  if (wasteTypeField) {
    // Hacer el campo clickeable para ir al buscador LER
    wasteTypeField.addEventListener('click', (e) => {
      if (wasteTypeField.hasAttribute('readonly')) {
        e.preventDefault();
        // Redirigir al buscador LER
        const lerSection = document.getElementById('ler');
        if (lerSection) {
          window.scrollTo({
            top: lerSection.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Enfocar el campo de búsqueda después del scroll
          setTimeout(() => {
            const lerSearchField = document.getElementById('ler-q');
            if (lerSearchField) {
              lerSearchField.focus();
              showNotification('🔍 Selecciona múltiples códigos LER para completar el formulario', 'info');
            }
          }, 800);
        }
      }
    });
    
    // Añadir cursor pointer cuando está en modo readonly
    wasteTypeField.style.cursor = 'pointer';
    
    // Permitir edición manual del campo
    wasteTypeField.addEventListener('dblclick', () => {
      // Limpiar selecciones LER si se va a editar manualmente
      if (selectedLERCodes.length > 0) {
        if (confirm('¿Deseas limpiar los códigos LER seleccionados para escribir manualmente?')) {
          clearAllLERCodes();
        } else {
          return;
        }
      }
      
      wasteTypeField.removeAttribute('readonly');
      wasteTypeField.placeholder = 'Escribe los tipos de residuo manualmente';
      wasteTypeField.classList.remove('border-green-500', 'bg-green-50');
      wasteTypeField.style.cursor = 'text';
      wasteTypeField.value = '';
      wasteTypeField.focus();
      showNotification('✏️ Modo de edición manual activado', 'info');
    });
    
    wasteTypeField.addEventListener('input', () => {
      // Limpiar los campos ocultos si se edita manualmente
      const lerCodesField = document.getElementById('ler-codes');
      const wasteDescriptionsField = document.getElementById('waste-descriptions');
      if (lerCodesField) lerCodesField.value = '';
      if (wasteDescriptionsField) wasteDescriptionsField.value = '';
    });
  }
  
  // Mejorar el buscador LER con información contextual
  const lerSearchField = document.getElementById('ler-q');
  if (lerSearchField) {
    lerSearchField.addEventListener('focus', () => {
      if (!lerSearchField.value) {
        showNotification('💡 Tip: Puedes seleccionar múltiples códigos LER. Busca por código o descripción', 'info');
      }
    });
  }
  
  // Agregar botón para limpiar selecciones
  addClearButton();
});

// Función para agregar botón de limpiar selecciones
function addClearButton() {
  const selectedContainer = document.getElementById('selected-ler-codes');
  if (selectedContainer) {
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'text-sm text-red-600 hover:text-red-800 underline mt-2';
    clearButton.textContent = 'Limpiar todas las selecciones';
    clearButton.onclick = clearAllLERCodes;
    clearButton.id = 'clear-ler-button';
    clearButton.style.display = 'none';
    
    selectedContainer.appendChild(clearButton);
  }
}
