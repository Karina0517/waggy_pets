# Waggy Pets - Petshop Online

Waggy Pets es una tienda online de productos para mascotas. **No vendemos animales**, únicamente productos como comida, juguetes, accesorios y artículos de cuidado para tus mascotas.

Este proyecto está desarrollado con **Next.js + TypeScript** y cuenta con funcionalidades avanzadas para usuarios y administradores.

---

## Características Principales

- **Usuarios:**
  - Explorar productos por categoría, marca, precio, stock y rating.
  - Paginación y filtrado del lado del servidor.
  - Agregar productos al carrito de compras.
  - Notificaciones al agregar productos (Toastify y SweetAlert).
  - Internacionalización con i18n.

- **Administradores:**
  - Dashboard protegido con login.
  - CRUD de productos con opción de subir varias imágenes por producto (Cloudinary).
  - Gestión de productos con validaciones (Yup).
  - Envío de correos automáticos mediante Cron Jobs y Nodemailer.

- **Tecnologías y librerías usadas:**
  - Next.js + TypeScript
  - NextAuth (Google)
  - Docker
  - Nodemailer (envío de emails)
  - HeroUI y MUI (componentes)
  - Toastify y SweetAlert (notificaciones)
  - SCSS, CSS Modules y Tailwind (estilos)
  - Yup (validaciones front y back)
  - Cypress (pruebas unitarias y E2E)
  - Cloudinary (subida de imágenes)
  - Paginación y filtrado del lado del servidor

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) (v18+ recomendada)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional, si quieres levantar servicios en contenedores)
- Una cuenta de Google para autenticación NextAuth
- Configuración de Cloudinary para subir imágenes
- Configuración de variables de entorno (ver sección más abajo)

---

## Instalación y Ejecución

1. **Clonar el repositorio:**

```bash

git clone https://github.com/Karina0517/waggy_pets.git
cd waggy_pets
npm install
npm run dev
```

## Credenciales de Administrador

Para acceder al dashboard de administración:

- **Email:** karina@correo.com
- **Contraseña:** 1234567

El dashboard permite crear, editar, eliminar productos y subir varias imágenes por producto.

## Funcionalidades Avanzadas

- Carrito de compras con persistencia en base de datos
- Filtros y paginación del lado del servidor para una mejor performance
- Notificaciones en tiempo real usando Toastify y SweetAlert
- Validaciones front y back con Yup
- Formularios de creación de producto con carga de imágenes en Cloudinary
- Cron Jobs para tareas automáticas como envío de emails diarios
- Internacionalización (i18n) para múltiples idiomas
- Pruebas unitarias y E2E con Cypress