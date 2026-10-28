# Tadá Repostería

Sitio web de repostería saludable con carrito de compras, sistema de pedidos por WhatsApp, delivery en Ica y alrededores.

## Características

- Carrito de compras funcional con localStorage
- Formulario de pedidos con validación
- Integración con WhatsApp
- Zonas de delivery de Ica con costos
- Catálogo con filtros por tipo
- Galería con lightbox
- Diseño responsive
- Accesible

## Tecnologías

- React 19 + Vite
- CSS vanilla
- Context API para carrito

## Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

## Configuración

Edita `client/src/config/whatsapp.js` para cambiar:
- Número de WhatsApp
- Zonas de delivery y precios
- Métodos de pago
- Horarios

## Estructura

```
postres/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── public/
└── package.json
```
