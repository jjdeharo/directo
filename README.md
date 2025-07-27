# Aplicación de votación en tiempo real

Una aplicación web sencilla y sin servidor para crear y participar en votaciones en tiempo real. Utiliza WebRTC (a través de la librería PeerJS) para la comunicación directa entre el presentador y los participantes, eliminando la necesidad de un backend o una base de datos.

---

## Características principales

* **Creación de votaciones.** El presentador puede definir una pregunta y múltiples opciones de respuesta.
* **Personalización visual.** Selector de color para personalizar el tema de la votación, con vista previa en directo.
* **Sin servidor (Serverless).** Comunicación directa P2P (Peer-to-Peer) entre usuarios gracias a WebRTC.
* **Múltiples formas de compartir.** Genera un código QR, un enlace directo y un código de sesión corto para que los participantes se unan.
* **Resultados en directo.** Los resultados se actualizan instantáneamente en la pantalla del presentador a medida que llegan los votos.
* **Modo proyector.** Una vista a pantalla completa optimizada para proyectar los resultados a una audiencia.
* **Soporte multilingüe.** Interfaz disponible en Español, Catalán, Gallego, Euskera e Inglés.
* **Gestión de la sesión.** El presentador puede finalizar una sesión y volver a la pantalla de edición para hacer ajustes y lanzar una nueva.

---

## Cómo utilizar la aplicación

No se necesita instalación ni servidor. Simplemente abre el archivo `index.html` (o la URL donde esté alojado) en un navegador web.

### Para el presentador

1.  En la pantalla inicial, haz clic en el enlace inferior: **"¿Eres el presentador? Inicia sesión aquí."**.
2.  Introduce tu pregunta, las opciones de respuesta y elige un color para el tema.
3.  Haz clic en **"Iniciar Sesión"**.
4.  Comparte el **código QR**, el **enlace directo** o la **URL principal junto con el código de sesión** con tu audiencia.

### Para los participantes

1.  Abre la URL de la aplicación.
2.  Introduce el código de la sesión proporcionado por el presentador.
3.  Haz clic en **"Unirse"**.
4.  Vota por tu opción preferida.

---

## Tecnologías utilizadas

* **HTML5**
* **CSS3** con **Tailwind CSS** para el diseño.
* **JavaScript** (Vanilla JS).
* **PeerJS** como capa de abstracción sobre WebRTC para la comunicación P2P.
* **QRCode.js** para la generación de los códigos QR.

---

## Licencia

Este proyecto está bajo la Licencia **Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)**.

Creado por Juan José de Haro.
