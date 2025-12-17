# GCMiRinconcito - Documentación de Arquitectura

## 📁 Estructura del Proyecto

```
gcmirinconcito/
├── index.html                    # Archivo principal (versión legacy)
├── index-refactored.html         # Archivo principal (versión modular)
├── netlify.toml                  # Configuración de Netlify
├── README.md                     # Documentación general
├── README-dev.md                 # Este archivo
│
├── assets/
│   └── images/                   # Imágenes del sitio
│       ├── Logo.svg
│       ├── Banner-hero.png
│       ├── premio.png
│       └── [razas-*.png]         # Imágenes de razas
│
├── css/                          # Estilos modulares
│   ├── main.css                  # Archivo principal (importa todos)
│   ├── variables.css             # Variables CSS (colores, espaciado)
│   ├── base.css                  # Estilos base y tipografía
│   ├── animations.css            # Keyframes y animaciones
│   ├── components.css            # Componentes reutilizables
│   ├── navigation.css            # Header y navegación
│   ├── hero.css                  # Sección hero
│   ├── breeds.css                # Tarjetas de razas
│   ├── modal.css                 # Modal y carrusel
│   ├── accordion.css             # Acordeón de políticas
│   ├── chatbot.css               # Widget de chat
│   └── footer.css                # Footer y tablas
│
├── js/
│   ├── main.js                   # Punto de entrada principal
│   └── modules/                  # Módulos ES6
│       ├── config.js             # Configuración global
│       ├── utils.js              # Funciones utilitarias
│       ├── theme.js              # Gestor de tema dark/light
│       ├── navigation.js         # Navegación SPA
│       ├── breeds.js             # Carrusel de razas
│       ├── chatbot.js            # Widget de chat IA
│       ├── accordion.js          # Acordeón de políticas
│       └── animations.js         # Animaciones de scroll
│
└── netlify/
    └── functions/
        └── gemini.js             # Serverless function para Gemini API
```

---

## 🎨 Módulos CSS

### `variables.css`
Define las variables CSS para temas claro y oscuro:
- Colores primarios y de acento
- Colores de fondo
- Colores de texto
- Sombras y bordes

### `base.css`
Estilos fundamentales:
- Reset y normalización
- Tipografía base
- Estilos del body
- Correcciones para modo oscuro

### `animations.css`
Todas las animaciones:
- `@keyframes float`, `shimmer`, `fadeUp`, etc.
- Clases de animación reutilizables
- Preferencias de movimiento reducido

### `components.css`
Componentes UI reutilizables:
- Botones (`.btn-primary`, `.btn-accent`)
- Tarjetas (`.feature-card`, `.service-card`)
- Badges y etiquetas
- Banners

### Otros módulos
- `navigation.css`: Header, menú móvil, filtros
- `hero.css`: Sección principal, parallax
- `breeds.css`: Tarjetas de razas, carrusel
- `modal.css`: Modal de detalle, carrusel de imágenes
- `accordion.css`: Sección de políticas
- `chatbot.css`: Widget de chat completo
- `footer.css`: Footer, tabla de recompensas

---

## 🔧 Módulos JavaScript

### `config.js`
Exporta configuraciones:
```javascript
export const APP_CONFIG = { appName, version, debug }
export const WHATSAPP_CONFIG = { phoneNumber, messages }
export const CHATBOT_CONFIG = { agentNames, timeouts }
export const CAROUSEL_CONFIG = { cardWidth, gap, autoScrollInterval }
export const BREEDS_DATA = { ... }  // Datos de todas las razas
```

### `utils.js`
Funciones utilitarias:
```javascript
getWhatsAppLink(message)     // Genera enlace de WhatsApp
parseMarkdown(text)          // Convierte Markdown a HTML
debounce(fn, delay)          // Anti-rebote para eventos
throttle(fn, limit)          // Limitador de frecuencia
getRandomExcluding(arr, val) // Elemento aleatorio excluyendo uno
```

### `theme.js`
Clase `ThemeManager`:
- Toggle entre tema claro/oscuro
- Persistencia en localStorage
- Actualización de iconos

### `navigation.js`
Clase `NavigationManager`:
- Navegación SPA (Single Page Application)
- Ocultar/mostrar header al scroll
- Menú móvil
- Botón "volver arriba"

### `breeds.js`
Clase `BreedsManager`:
- Renderizado dinámico de tarjetas
- Carrusel con navegación
- Auto-scroll con pausa al hover
- Modal con carrusel de imágenes

### `chatbot.js`
Clase `ChatbotManager`:
- Widget de chat con IA (Gemini)
- Validación de nombre
- Sistema de calificación
- Detección de intención de compra
- Temporizadores de inactividad

### `accordion.js`
Clase `AccordionManager`:
- Toggle de acordeones
- Navegación por teclado
- Accesibilidad (ARIA)

### `animations.js`
Clase `AnimationsManager`:
- Intersection Observer para reveal
- Preferencias de movimiento reducido
- Efectos especiales (typing, countUp)

---

## 📦 Cómo usar la versión modular

### 1. Cambiar a la versión refactorizada
Renombra los archivos:
```bash
mv index.html index-legacy.html
mv index-refactored.html index.html
```

### 2. Importar CSS
En el `<head>` del HTML:
```html
<link rel="stylesheet" href="css/main.css">
```

### 3. Importar JavaScript
Al final del `<body>`:
```html
<script type="module" src="js/main.js"></script>
```

---

## 🔄 Flujo de Inicialización

```
1. DOM Ready
   └── App.init()
       ├── ThemeManager      → Aplica tema guardado
       ├── NavigationManager → Configura navegación SPA
       ├── BreedsManager     → Renderiza tarjetas de razas
       ├── AccordionManager  → Configura acordeones
       ├── AnimationsManager → Configura Intersection Observer
       └── ChatbotManager    → Inicializa widget de chat
```

---

## 🛠 Mantenimiento

### Añadir una nueva raza
1. Añadir imágenes en `assets/images/`
2. Editar `js/modules/config.js`:
```javascript
export const BREEDS_DATA = {
    // ... razas existentes
    'nueva-raza': {
        title: 'Nueva Raza',
        category: 'medianas',
        images: ['assets/images/nueva-raza-1.png'],
        description: '...',
        characteristics: [...]
    }
};
```

### Modificar estilos
- Variables globales → `css/variables.css`
- Componente específico → archivo CSS correspondiente

### Modificar comportamiento
- Configuración → `js/modules/config.js`
- Lógica específica → módulo correspondiente

---

## 📝 Convenciones de código

### CSS
- Usar variables CSS para colores y espaciado
- Prefijo `--` para variables
- Comentarios para secciones

### JavaScript
- Clases ES6 para módulos
- JSDoc para documentación
- Exportaciones nombradas para config
- Export default para clases

### HTML
- Comentarios para secciones principales
- IDs semánticos
- Data attributes para comportamiento JS

---

## 🚀 Despliegue

El proyecto está configurado para Netlify:
- Serverless functions en `netlify/functions/`
- Build automático desde rama principal
- Variables de entorno para API keys

### Variables de entorno requeridas
```
GEMINI_API_KEY=tu_api_key_aqui
```

---

## 📄 Licencia

© 2024 GCMiRinconcito. Todos los derechos reservados.
