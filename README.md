# Lavado Industrial

Sistema web para digitalizar el proceso de lavado industrial con formularios móviles, evidencias fotográficas y dashboard en tiempo real.

## Estructura
- backend: API con Express, MongoDB y Socket.io
- frontend: React + MUI

## Configuración rápida
1. Copia los archivos de entorno:
   - backend/.env.example -> backend/.env
   - frontend/.env.example -> frontend/.env
2. Instala dependencias en cada carpeta:
   - backend: npm install
   - frontend: npm install
3. Ejecuta en dos terminales:
   - backend: npm run dev
   - frontend: npm run dev
4. Carga las máquinas base (una vez):
   - backend: npm run seed

## Uso
- Formulario: /formulario
- Dashboard: /dashboard

## Notas
- Las fotos se guardan localmente en backend/uploads.
- El checklist y los textos están en español; el código y estructura permanecen en inglés.

## Deploy en Azure (Alpha)
Flujo sugerido: VS Code → GitHub → GitHub Actions → Azure.

### Backend (App Service)
1. Crear App Service (Linux, Node 20).
2. Configurar variables de entorno en App Service:
   - MONGODB_URI
   - JWT_SECRET
   - CORS_ORIGIN (URL del frontend en Azure)
   - UPLOAD_DIR=uploads
3. En GitHub, agregar secretos:
   - AZURE_BACKEND_APP_NAME
   - AZURE_BACKEND_PUBLISH_PROFILE

### Frontend (Static Web Apps)
1. Crear Static Web App.
2. En GitHub, agregar secreto:
   - AZURE_STATIC_WEB_APPS_API_TOKEN
3. Configurar en el portal SWA la variable de entorno:
   - VITE_API_URL (URL del backend /api)
   - VITE_API_SOCKET (URL del backend)

### Base de datos
- Usar Azure Cosmos DB (Mongo API) y copiar el connection string a MONGODB_URI.

### Almacenamiento de fotos (alpha)
- El alpha usa almacenamiento local en App Service. Para producción, migrar a Azure Blob Storage.
