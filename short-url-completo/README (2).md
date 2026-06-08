# URL Shortener API

## Requisitos

- Node.js
- Docker Desktop

## Instalación

```bash
npm install
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con lo siguiente:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=url_shortener
JWT_SECRET=mi_secreto_seguro_123
```

## Correr el proyecto

```bash
docker-compose up -d
npm run start:dev
```

La API quedará disponible en `http://localhost:3000`

---

## Endpoints
