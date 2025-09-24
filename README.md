# 📧 Bulk Email Scheduler

Servicio backend para **programar y encolar envíos masivos de correos** de forma escalable.  
Construido con **Node.js / TypeScript**, siguiendo principios de **DDD** y usando **Redis** como motor de colas (BullMQ).

---

## ✨ Características

- **Envío masivo (bulk)**: soporta miles de correos por lote.
- **Envío individual**: endpoint para mandar un correo por request.
- **Programación (cronjobs)**: dispara procesos masivos en horarios específicos.
- **Persistencia**: guarda estado de los correos en base de datos.
- **Escalabilidad**: integración con Redis/BullMQ para manejar colas distribuidas.
- **Resiliencia**: reintentos automáticos y backoff exponencial para jobs fallidos.
- **Extensible**: fácil de acoplar a cualquier proveedor SMTP/API (SendGrid, Resend, SES, etc.).

---

## 🛠️ Tecnologías

- [NestJS](https://nestjs.com/) — framework backend
- [BullMQ](https://docs.bullmq.io/) — colas de trabajos en Redis
- [Redis](https://redis.io/) — almacenamiento de jobs
- [Winston](https://github.com/winstonjs/winston) — logging estructurado
- [TypeScript](https://www.typescriptlang.org/) — tipado fuerte

---

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/<tu-org>/bulk-email-scheduler.git
   cd bulk-email-scheduler
   ```
2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo .env con tus variables:

```bash
DATABASE_URL="connection_string_a_tu_base_de_datos"
PORT=3000
REDIS_HOST=localhost
RESEND_FROM_EMAIL="Tu Nombre <noreply@domain.com>"
RESEND_API_KEY="re_tu_api_key_aqui"
EMAIL_TEMPLATES_PATH="src/templates/emails"
```

4. Levanta Redis (ejemplo con Docker):

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

5. Arranca el servicio:

```bash
npm run start:dev
```

---

## 📡 Endpoints

### Enviar correo único

POST /emails/send-one
Content-Type: application/json

```json
{
  "id": "123",
  "to": "test@example.com",
  "subject": "Hola!",
  "template": "welcome",
  "vars": { "name": "Kevin" }
}
```

### Enviar correos en bulk

POST /emails/send-bulk
Content-Type: application/json

```json
[
  {
    "id": "bulk-1",
    "to": "user1@example.com",
    "subject": "Promo",
    "template": "promo",
    "vars": { "discount": "20%" }
  },
  {
    "id": "bulk-2",
    "to": "user2@example.com",
    "subject": "Promo",
    "template": "promo",
    "vars": { "discount": "20%" }
  }
]
```
