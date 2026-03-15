# Generador de Contraseñas Pro

Aplicación web moderna y profesional para generar contraseñas seguras con interfaz en React, soporte para tema oscuro y claro, y dos métodos de generación:

- **Contraseña aleatoria** de 25 caracteres
- **Contraseña basada en una frase** introducida por el usuario

Además incluye:

- selección de caracteres especiales
- selección de números
- selección de mayúsculas
- copiado al portapapeles
- envío por correo mediante `mailto:`
- botón para finalizar y reabrir la aplicación
- indicador visual de fortaleza de contraseña

---

## Vista general

Este proyecto está construido con:

- **React**
- **Framer Motion**
- **Lucide React**
- **Tailwind CSS**
- **shadcn/ui**

La interfaz está diseñada para ofrecer una experiencia moderna, clara y rápida de usar.

---

## Funcionalidades

### 1. Generación aleatoria de contraseñas
Permite crear una contraseña de **25 caracteres** con las siguientes opciones configurables:

- caracteres especiales
- números
- letras mayúsculas

La aplicación siempre incluye letras minúsculas como base.

### 2. Generación desde frase
El usuario introduce una frase y la aplicación genera una contraseña derivada de ella mediante:

- normalización del texto
- extracción de iniciales
- transformación parcial de palabras
- adición de números
- adición de un carácter especial
- mezcla aleatoria del resultado

### 3. Medidor de seguridad
Cada contraseña generada se evalúa automáticamente y se clasifica como:

- **Baja**
- **Media**
- **Alta**

### 4. Copiar al portapapeles
Permite copiar la contraseña generada directamente al portapapeles del sistema.

### 5. Enviar por mail
Abre el cliente de correo predeterminado mediante `mailto:` con la contraseña incluida en el cuerpo del mensaje.

### 6. Tema oscuro y claro
El tema visual puede cambiarse manualmente y queda guardado en `localStorage`.

### 7. Finalizar aplicación
La interfaz puede cerrarse con un botón de “Finalizar aplicación”, mostrando una pantalla de cierre con opción para reabrirla.

---

## Estructura del componente

El componente principal exportado es:

```jsx
export default function GeneradorContrasenasPro()
