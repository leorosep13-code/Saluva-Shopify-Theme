# Saluva — Tema Shopify

Tema personalizado de Shopify para **Saluva**, marca de bienestar femenino.

## 🎨 Identidad Visual
- **Color Principal:** `#a4c93b`
- **Color Secundario:** `#d2a4f3`
- **Fondo:** Blanco `#ffffff`
- **Fuente:** League Spartan
- **Tema base Shopify:** Savor

## 📁 Estructura del Proyecto

```
saluva-theme/
├── layout/
│   └── theme.liquid              # Layout principal
├── templates/
│   └── index.json                # Homepage con secciones
├── sections/
│   ├── promo-bar.liquid          # Barra promocional con countdown
│   ├── header.liquid             # Encabezado sticky con navegación
│   ├── saluva-landing.liquid     # Hero con CTA
│   ├── saluva-stories.liquid     # Stories tipo Instagram
│   ├── saluva-trust-badges.liquid# Badges de confianza
│   ├── saluva-tienda.liquid      # Catálogo con filtros
│   ├── saluva-bestsellers.liquid # Más vendidos + social proof
│   ├── saluva-aprende.liquid     # Productos digitales
│   ├── saluva-quiz.liquid        # Quiz interactivo
│   └── footer.liquid             # Pie de página
├── snippets/
│   └── product-card.liquid       # Tarjeta de producto reutilizable
├── assets/
│   ├── saluva-base.css           # Variables, reset, utilidades
│   ├── saluva-sections.css       # Estilos de cada sección
│   └── saluva-scripts.js         # Countdown, stories, quiz, filtros, AJAX cart
├── config/
│   ├── settings_schema.json      # Esquema del personalizador
│   └── settings_data.json        # Valores por defecto
└── locales/
    └── es.default.json           # Traducciones en español
```

## 🚀 Cómo Subir a GitHub y Conectar con Shopify

### Paso 1: Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `saluva-theme`
3. Visibilidad: **Privado** (recomendado)
4. NO inicializar con README (ya tienes uno)
5. Click en **Create repository**

### Paso 2: Subir archivos desde tu computadora

```bash
# Descomprime el ZIP descargado y entra a la carpeta
cd saluva-theme

# Inicializa Git
git init
git add .
git commit -m "feat: tema inicial Saluva con todas las secciones"

# Conecta con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/saluva-theme.git
git branch -M main
git push -u origin main
```

### Paso 3: Conectar GitHub con Shopify

1. Ve a tu admin de Shopify → **Tienda Online** → **Temas**
2. Click en **Agregar tema** → **Conectar desde GitHub**
3. Autoriza a Shopify en tu cuenta de GitHub si es la primera vez
4. Selecciona el repositorio `saluva-theme`
5. Selecciona la rama `main`
6. Shopify importará el tema automáticamente

### Paso 4: Personalizar en Shopify

1. Una vez importado, click en **Personalizar** en tu tema
2. En la homepage verás las secciones ya ordenadas
3. Configura cada sección:
   - **Barra Promocional:** Cambia texto y fecha de fin
   - **Encabezado:** Sube tu logo
   - **Landing Hero:** Sube imagen hero, edita textos
   - **Stories:** Agrega imágenes a cada historia
   - **Tienda:** Selecciona la colección de productos
   - **Más Vendidos:** Selecciona tu colección de bestsellers
   - **Aprende:** Configura cada producto digital
   - **Quiz:** Asigna productos a cada resultado
   - **Footer:** Conecta tus menús de pie de página

## 📱 Secciones del Tema

### 1. Landing (Hero)
- Badge animado
- Título con texto resaltado en color de marca
- Dos CTAs (tienda + quiz)
- Imagen circular o placeholder
- Orbes decorativos con gradiente

### 2. Stories
- Burbujas tipo Instagram con borde en color primario
- Overlay fullscreen con barra de progreso
- Auto-avance cada 5 segundos
- Navegación con flechas y teclado (←→, Esc)
- Cada historia es configurable desde el personalizador

### 3. Tienda
- Filtros por categoría (tipo de producto)
- Grid de 4 columnas (responsive a 3 → 2)
- Tarjetas con hover, tags, rating, wishlist
- AJAX Add to Cart (sin recargar página)

### 4. Más Vendidos
- Grid destacado con tarjetas más grandes
- Barra de social proof con estadísticas

### 5. Aprende con Nosotros
- Cards para productos digitales (PDFs, videos, guías)
- Soporte para contenido gratis y de pago
- Integrable con productos digitales de Shopify

### 6. Quiz Interactivo
- Preguntas configurables desde el personalizador
- Barra de progreso visual
- Resultado con productos recomendados
- Mapeo de respuestas a resultados

## ⚙️ Funcionalidades JavaScript
- **Countdown:** Lee fecha de `data-end-date` y actualiza cada segundo
- **Header sticky:** Cambia sombra al hacer scroll + marca sección activa
- **Stories:** Overlay con progreso automático + navegación
- **Filtros:** Muestra/oculta productos por tipo sin recargar
- **Quiz:** Máquina de estados con intro → preguntas → resultado
- **AJAX Cart:** Agrega al carrito sin recargar + feedback visual
- **Menú mobile:** Hamburger toggle

## 🔧 Personalización Adicional

### Colores
Todos los colores se controlan desde **Personalizar tema → Colores Saluva** en el admin de Shopify. También puedes editarlos en `config/settings_data.json`.

### Tipografía
La fuente League Spartan se carga desde Google Fonts en `layout/theme.liquid`. Para cambiarla, modifica el enlace `<link>` y la variable `--font-family` en `saluva-base.css`.

## 📋 Requisitos
- Shopify (cualquier plan)
- Cuenta de GitHub
- Productos cargados en Shopify con tipos de producto asignados
- Colecciones creadas para "Tienda" y "Más Vendidos"

## 📄 Licencia
Tema privado para uso exclusivo de Saluva.
