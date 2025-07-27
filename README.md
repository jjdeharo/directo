# Conexión en Directo: herramientas de interacción en tiempo real

"Conexión en Directo" es un conjunto de aplicaciones web sencillas y sin servidor para fomentar la participación en tiempo real en aulas, conferencias o cualquier tipo de presentación. Todas las herramientas utilizan tecnología **WebRTC** (a través de la librería PeerJS) para la comunicación directa entre el presentador y los participantes, eliminando la necesidad de un backend o una base de datos.

---

## Filosofía del proyecto

* **Sin servidor (Serverless)**: La comunicación es directa P2P (Peer-to-Peer) entre el presentador y los participantes. Ningún dato viaja a un servidor central.
* **Privacidad por diseño**: No se requiere registro de usuarios y no se almacena ninguna información de la sesión en la nube. Cuando el presentador cierra la pestaña, los datos se pierden.
* **Código abierto**: Todo el proyecto está disponible bajo una licencia Creative Commons que permite su uso, modificación y distribución.
* **Soporte multilingüe**: La interfaz está disponible en español, catalán, gallego, euskera e inglés.

---

## Aplicaciones disponibles

Este proyecto incluye varias herramientas interactivas:

1.  **Votación simple**: Permite crear preguntas de opción múltiple y recibir votos en tiempo real. Los resultados se muestran como un gráfico de barras dinámico.
2.  **Nube de palabras**: Recopila palabras o frases cortas de la audiencia para formar una nube de palabras visual. El tamaño de cada palabra es proporcional a su frecuencia. Se puede exportar como imagen (PNG) o datos (CSV).
3.  **Lluvia de ideas y votos**: Una herramienta en dos fases. Primero, los participantes envían sus ideas de forma anónima. Después, en la fase de votación, pueden votar por las propuestas de los demás para priorizarlas.
4.  **Muro interactivo**: Un lienzo digital colaborativo donde los participantes envían "post-its" virtuales. El presentador puede organizar las notas libremente. El resultado se puede exportar como PDF o CSV.

---

## Cómo utilizar las aplicaciones

No se necesita instalación ni servidor. Simplemente abre el fichero `index.html` (o la URL donde esté alojado) en un navegador web.

### Para el presentador

1.  Abre la aplicación que desees utilizar desde la página principal.
2.  En la pantalla inicial de la aplicación, haz clic en el enlace inferior (normalmente **"¿Eres el presentador? Inicia sesión aquí."**).
3.  Introduce la pregunta o título de la actividad, configura las opciones específicas (respuestas, límites, etc.) y personaliza el color del tema.
4.  Haz clic en **"Iniciar Sesión"** o un botón similar.
5.  Comparte el **código QR**, el **enlace directo** o la **URL principal junto con el código de sesión** con tu audiencia.

### Para los participantes

1.  Abre la URL de la aplicación proporcionada.
2.  Introduce el código de la sesión que te ha dado el presentador.
3.  Haz clic en **"Unirse"**.
4.  Interactúa enviando tus respuestas (votos, ideas, etc.).

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
