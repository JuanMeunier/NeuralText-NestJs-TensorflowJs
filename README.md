# 🧠 NeuralText API

API avanzada de análisis de texto que utiliza múltiples modelos de inteligencia artificial para proporcionar análisis completos y precisos.

## ✨ Características

- 🎯 **Análisis Multi-Modelo**: Combina 4 modelos de IA especializados
- 🔐 **Autenticación Google OAuth**: Login seguro con tu cuenta Google
- 📊 **Análisis Completo**: Sentimientos, emociones, entidades e intenciones
- 🚀 **Alto Rendimiento**: Procesamiento en paralelo de todos los modelos
- 📚 **Documentación Swagger**: API completamente documentada
- 🛡️ **TypeScript**: Código 100% tipado y seguro

## 🤖 Modelos de IA Utilizados

| Modelo | Propósito | Ejemplo de Salida |
|--------|-----------|-------------------|
| **Sentiment Analysis** | Detecta sentimiento general | `POSITIVE (0.95)` |
| **Named Entity Recognition** | Extrae entidades clave | `PERSON: Juan, PLACE: Madrid` |
| **Emotion Detection** | Identifica emociones específicas | `joy (0.87)` |
| **Intent Classification** | Clasifica la intención del texto | `question (0.92)` |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 13+
- Cuenta de Google Cloud (para OAuth)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/neuraltext-api.git
cd neuraltext-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### Configuración de Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb neuraltext_db

# La sincronización es automática en desarrollo
npm run start:dev
```

### Google OAuth Setup

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Crea credenciales OAuth 2.0:
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
5. Copia el Client ID y Client Secret a tu `.env`

## 🏃‍♂️ Ejecutar la Aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
```


## 📦 Tecnologías Utilizadas

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL + TypeORM
- **IA**: Transformers.js (Xenova)
- **Autenticación**: Google OAuth 2.0 + JWT
- **Documentación**: Swagger/OpenAPI
- **Validación**: Class Validator
- **Lenguaje**: TypeScript




## 🚀 Próximas Funcionalidades

- [ ] Análisis por lotes (batch processing)
- [ ] Cache Redis para mejor performance
- [ ] Webhooks para análisis en tiempo real
- [ ] Dashboard de analytics
- [ ] Soporte para más idiomas
- [ ] API de embeddings de texto

---

**Desarrollado con ❤️ usando NestJS y Transformers.js**