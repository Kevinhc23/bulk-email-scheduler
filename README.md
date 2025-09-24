# API Transactional: Servicio de envío de correos electrónicos transaccionales y masivos

API Transactional es un servicio backend desarrollado en Node.js con TypeScript, diseñado para gestionar el envío de correos electrónicos transaccionales y masivos. Utiliza BullMQ para la gestión de colas de trabajo y Redis como almacén de datos en memoria, asegurando un procesamiento eficiente y escalable de los correos electrónicos.

## Características Principales

- **Envío de Correos Electrónicos**: Soporte para el envío de correos electrónicos individuales y masivos.
- **Gestión de Colas**: Implementación de BullMQ para manejar colas de trabajo, permitiendo el procesamiento asíncrono de tareas.
- **Almacenamiento en Memoria**: Uso de Redis para almacenar temporalmente los correos electrónicos antes de su envío.
- **Plantillas de Correo**: Soporte para plantillas de correo electrónico utilizando Handlebars.
- **API RESTful**: Endpoints para programar y gestionar el envío de correos electrónicos.
- **Manejo de Errores y Reintentos**: Estrategias de reintento para correos electrónicos fallidos, mejorando la fiabilidad del servicio.

## Tecnologías Utilizadas

- Node.js
- TypeScript
- BullMQ
- Redis
- Handlebars
- NestJS
- Resend

## Instalación y Configuración

1. Clona el repositorio:
   ```bash
   git clone kkfrr/api-transactional.git
    cd api-transactional
   ```
2. Instala las dependencias:
   ```bash
    npm install
   ```
3. Configura las variables de entorno en un archivo `.env` basado en el archivo `.env.example`.
4. Inicia el servidor:
   ```bash
    npm run start:dev
   ```

## Uso

- Accede a la documentación de la API en `http://localhost:3000/api` para explorar los endpoints disponibles.
- Utiliza los endpoints para programar el envío de correos electrónicos individuales o masivos.

## Contribución

- Si deseas contribuir al proyecto, por favor abre un issue o envía un pull request con tus mejoras o correcciones.

## Licencia

- Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Contacto

- Para preguntas o soporte, por favor contacta a
  - Nombre: Kevin Hernandez Crespo
  - Email: kevinhernandezcrespo97@gmail.com
